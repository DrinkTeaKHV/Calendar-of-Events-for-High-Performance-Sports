from django.conf import settings
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from elasticsearch_dsl import Q
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from ..documents import EventDocument
from ..models import Event, Sport, GENDER_CHOICES, FavoriteEvent
from .serializers import EventSerializer, SportSerializer, FavoriteEventSerializer


class EventPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class EventFilter(filters.FilterSet):
    sport_type = filters.CharFilter(field_name='sport__name', lookup_expr='iexact')
    competition_type = filters.CharFilter(field_name='competition_type__name', lookup_expr='iexact')
    location = filters.CharFilter(lookup_expr='iexact')
    gender = filters.ChoiceFilter(choices=GENDER_CHOICES)
    min_participants_count = filters.NumberFilter(field_name='participants_count', lookup_expr='gte')
    max_participants_count = filters.NumberFilter(field_name='participants_count', lookup_expr='lte')
    start_date = filters.DateFilter(field_name='start_date', lookup_expr='gte')
    end_date = filters.DateFilter(field_name='end_date', lookup_expr='lte')

    class Meta:
        model = Event
        fields = [
            'sport_type',
            'competition_type',
            'location',
            'gender',
            'min_participants_count',
            'max_participants_count',
            'start_date',
            'end_date',
        ]


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint для просмотра мероприятий с возможностью поиска и фильтрации.
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = EventPagination
    ordering_fields = ['start_date', 'end_date', 'participants_count']
    ordering = ['start_date']
    filter_backends = [DjangoFilterBackend]
    filterset_class = EventFilter

    def _build_query(self, params):
        """
        Формирует запрос для ElasticSearch на основе параметров фильтрации.
        """
        must_queries = []

        # Основной поиск
        q = params.get('q')
        if q:
            must_queries.append(
                Q(
                    "multi_match",
                    query=q,
                    fields=['name', 'sport.name', 'competition_type.name', 'location', 'gender'],
                    fuzziness='AUTO',
                )
            )

        return must_queries

    def _build_sort(self, ordering):
        """
        Формирует параметры сортировки для ElasticSearch.
        """
        if ordering:
            ordering_fields = [field.strip() for field in ordering.split(',')]
            sort_fields = []

            for field in ordering_fields:
                if field.lstrip('-') in self.ordering_fields:
                    sort_fields.append(
                        {field.lstrip('-'): {"order": "desc" if field.startswith('-') else "asc"}}
                    )

            return sort_fields
        return None

    @swagger_auto_schema(
        operation_description="Получить список мероприятий с возможностью поиска и фильтрации",
        manual_parameters=[
            openapi.Parameter('q', openapi.IN_QUERY, description="Поисковый запрос", type=openapi.TYPE_STRING),
            openapi.Parameter('sport_type', openapi.IN_QUERY, description="Вид спорта", type=openapi.TYPE_STRING),
            openapi.Parameter('competition_type', openapi.IN_QUERY, description="Тип соревнования",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('location', openapi.IN_QUERY, description="Город", type=openapi.TYPE_STRING),
            openapi.Parameter('max_participants_count', openapi.IN_QUERY, description="Максимальное число участников",
                              type=openapi.TYPE_INTEGER),
            openapi.Parameter('min_participants_count', openapi.IN_QUERY, description="Минимальное число участников",
                              type=openapi.TYPE_INTEGER),
            openapi.Parameter('gender', openapi.IN_QUERY, description="Пол", type=openapi.TYPE_STRING),
            openapi.Parameter('start_date', openapi.IN_QUERY, description="Дата начала (YYYY-MM-DD)",
                              type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE),
            openapi.Parameter('end_date', openapi.IN_QUERY, description="Дата окончания (YYYY-MM-DD)",
                              type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE),
            openapi.Parameter('ordering', openapi.IN_QUERY, description="Поле для сортировки",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('page', openapi.IN_QUERY, description="Номер страницы", type=openapi.TYPE_INTEGER),
            openapi.Parameter('page_size', openapi.IN_QUERY, description="Размер страницы", type=openapi.TYPE_INTEGER),
        ],
    )
    def list(self, request, *args, **kwargs):
        query_params = request.query_params
        must_queries = self._build_query(query_params)
        ordering = query_params.get('ordering', None)

        if must_queries:
            # Формируем запрос ElasticSearch
            search = EventDocument.search().query('bool', must=must_queries)

            # Добавляем сортировку
            sort = self._build_sort(ordering)
            if sort:
                search = search.sort(*sort)

            # Выполняем поиск
            response = search.execute()

            # Получаем список ID из результата
            ids = [int(hit.meta.id) for hit in response]
            queryset = self.queryset.filter(id__in=ids)

            # Применяем сортировку в Django ORM
            if ordering:
                queryset = queryset.order_by(*ordering.split(','))

            # Применяем стандартную пагинацию
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        # Если фильтров нет, возвращаем стандартный список с сортировкой
        queryset = self.filter_queryset(self.get_queryset())
        if ordering:
            queryset = queryset.order_by(*ordering.split(','))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @method_decorator(cache_page(settings.CACHE_TTL, key_prefix='filter_list'))
    @swagger_auto_schema(
        operation_description="Получить уникальные значения для фильтров мероприятий",
        manual_parameters=[],
        responses={
            200: openapi.Response(
                description="Уникальные значения фильтров",
                examples={
                    "application/json": {
                        "sports": ["Футбол", "Баскетбол", "Волейбол"],
                        "competition_types": ["Чемпионат", "Турнир"],
                        "locations": ["Москва", "Санкт-Петербург", "Екатеринбург"],
                        "genders": ["male", "female"],
                        "participants_counts": [
                            {"participants_count": 10, "count": 3},
                            {"participants_count": 20, "count": 5},
                            {"participants_count": 30, "count": 2}
                        ]
                    }
                }
            )
        }
    )
    @action(detail=False, methods=['get'], url_path='filter-options')
    def filter_options(self, request, *args, **kwargs):
        """
        Получить уникальные значения для фильтров: вид спорта, тип соревнования, место, пол и количество участников.
        """
        sports = (
            Event.objects.values_list('sport__name', flat=True)
            .distinct()
            .order_by('sport__name')
        )
        competition_types = (
            Event.objects.values_list('competition_type__name', flat=True)
            .distinct()
            .order_by('competition_type__name')
        )
        locations = (
            Event.objects.values_list('location', flat=True)
            .distinct()
            .order_by('location')
        )
        genders = (
            Event.objects.values_list('gender', flat=True)
            .distinct()
            .order_by('gender')
        )
        participants_counts = (
            Event.objects
            .filter(participants_count__isnull=False)  # Исключить `null`
            .values('participants_count')
            .annotate(count=Count('participants_count'))
            .order_by('participants_count')
        )

        return Response({
            "sports": list(sports),
            "competition_types": list(competition_types),
            "locations": list(locations),
            "gender": list(genders),
            "participants_counts": list(participants_counts),
        })


class SportListAPIView(APIView):
    """
    API для получения списка видов спорта.
    """

    def get(self, request, *args, **kwargs):
        sports = Sport.objects.all().order_by('name')  # Получение всех видов спорта, сортировка по имени
        serializer = SportSerializer(sports, many=True)
        return Response(serializer.data)


class FavoriteEventViewSet(viewsets.ModelViewSet):
    """
    API для управления избранными мероприятиями
    """
    serializer_class = FavoriteEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает избранные мероприятия текущего пользователя
        """
        return FavoriteEvent.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Переопределяем метод create, чтобы не создавать дублирующиеся записи.
        """
        user = request.user
        event_id = request.data.get('event')

        if not event_id:
            return Response(
                {"detail": "Поле 'event' обязательно."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response(
                {"detail": "Мероприятие с таким ID не найдено."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Проверяем, есть ли уже это мероприятие в избранном
        favorite, created = FavoriteEvent.objects.get_or_create(user=user, event=event)

        if not created:
            return Response(
                {"detail": "Это мероприятие уже добавлено в избранное."},
                status=status.HTTP_200_OK
            )

        serializer = self.get_serializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
