from django.conf import settings
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from elasticsearch_dsl import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from ..documents import EventDocument
from ..models import Event, Sport
from .serializers import EventSerializer, SportSerializer


class EventPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint для просмотра мероприятий с возможностью поиска и фильтрации.
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = EventPagination
    ordering_fields = ['start_date', 'end_date', 'participants_count']
    ordering = ['start_date']

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

        # Поиск по отдельным полям
        exact_fields = {
            'sport_type': 'sport.name',
            'competition_type': 'competition_type.name',
            'location': 'location',
            'gender': 'gender',
        }

        for param, field in exact_fields.items():
            value = params.get(param)
            if value:
                must_queries.append(Q('match', **{field: value}))

        # Диапазоны числовых значений
        participants_range = {}
        min_count = params.get('min_participants_count')
        max_count = params.get('max_participants_count')

        if min_count:
            try:
                participants_range['gte'] = int(min_count)
            except ValueError:
                pass  # Можно добавить логирование ошибки
        if max_count:
            try:
                participants_range['lte'] = int(max_count)
            except ValueError:
                pass

        if participants_range:
            must_queries.append(Q('range', participants_count=participants_range))

        # Диапазон по датам
        date_range = {}
        start_date = params.get('start_date')
        end_date = params.get('end_date')

        if start_date:
            date_range['gte'] = start_date
        if end_date:
            date_range['lte'] = end_date

        if date_range:
            must_queries.append(Q('range', start_date=date_range))

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

        if must_queries:
            # Формируем запрос ElasticSearch
            search = EventDocument.search().query('bool', must=must_queries)

            # Добавляем сортировку
            ordering = query_params.get('ordering', None)
            sort = self._build_sort(ordering)
            if sort:
                search = search.sort(*sort)

            # Выполняем поиск
            response = search.execute()

            # Получаем список ID из результата
            ids = [int(hit.meta.id) for hit in response]
            queryset = Event.objects.filter(id__in=ids)

            # Применяем стандартную пагинацию
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        # Если фильтров нет, возвращаем стандартный список
        return super().list(request, *args, **kwargs)

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
            "genders": list(genders),
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
