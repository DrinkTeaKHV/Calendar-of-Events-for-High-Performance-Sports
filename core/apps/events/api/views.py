from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from elasticsearch_dsl import Q
from rest_framework import filters, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from apps.events.api.serializers import EventSerializer
from apps.events.documents import EventDocument
from apps.events.models import Event


class EventPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = EventPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['sport_type', 'discipline_program', 'city', 'gender_age_group', 'event_type', 'participants']
    ordering_fields = ['start_date', 'end_date']
    ordering = ['start_date']

    @method_decorator(cache_page(settings.CACHE_TTL, key_prefix='events_list'))
    @swagger_auto_schema(
        operation_description="Получить список мероприятий с возможностью поиска и фильтрации",
        manual_parameters=[
            openapi.Parameter('q', openapi.IN_QUERY, description="Поисковый запрос", type=openapi.TYPE_STRING),
            openapi.Parameter('sport_type', openapi.IN_QUERY, description="Вид спорта", type=openapi.TYPE_STRING),
            openapi.Parameter('discipline_program', openapi.IN_QUERY, description="Дисциплина, программа",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('city', openapi.IN_QUERY, description="Город", type=openapi.TYPE_STRING),
            openapi.Parameter('gender_age_group', openapi.IN_QUERY, description="Пол и возрастная группа",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('event_type', openapi.IN_QUERY, description="Тип соревнования", type=openapi.TYPE_STRING),
            openapi.Parameter('participants', openapi.IN_QUERY, description="Количество участников",
                              type=openapi.TYPE_INTEGER),
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
        q = request.query_params.get('q', None)
        sport_type = request.query_params.get('sport_type', None)
        discipline_program = request.query_params.get('discipline_program', None)
        city = request.query_params.get('city', None)
        gender_age_group = request.query_params.get('gender_age_group', None)
        event_type = request.query_params.get('event_type', None)
        participants = request.query_params.get('participants', None)
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)

        if q or any([sport_type, discipline_program, city, gender_age_group, event_type, participants, start_date,
                     end_date]):
            search = EventDocument.search()

            must_queries = []

            if q:
                # Поиск по этим значениям
                multi_match_query = Q(
                    "multi_match",
                    query=q,
                    fields=[
                        'name',
                        'sport_type',
                        'discipline_program',
                        'city',
                        'gender_age_group',
                        'event_type',
                    ],
                    fuzziness='AUTO',
                )
                must_queries.append(multi_match_query)

            if sport_type:
                must_queries.append(Q('term', sport_type__keyword=sport_type))
            if discipline_program:
                must_queries.append(Q('term', discipline_program__keyword=discipline_program))
            if city:
                must_queries.append(Q('term', city__keyword=city))
            if gender_age_group:
                must_queries.append(Q('term', gender_age_group__keyword=gender_age_group))
            if event_type:
                must_queries.append(Q('term', event_type__keyword=event_type))
            if participants:
                try:
                    participants = int(participants)
                    must_queries.append(Q('term', participants=participants))
                except ValueError:
                    pass  # Можно добавить обработку ошибки

            if start_date and end_date:
                must_queries.append(Q('range', start_date={'gte': start_date, 'lte': end_date}))

            if must_queries:
                search = search.query('bool', must=must_queries)

            # Добавляем сортировку
            ordering = request.query_params.get('ordering', None)
            if ordering:
                search = search.sort(ordering)

            # Выполняем поиск и получаем результаты
            response = search.execute()
            ids = [hit.meta.id for hit in response]
            queryset = Event.objects.filter(id__in=ids)

            # Применяем стандартную фильтрацию и пагинацию
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        else:
            # Стандартное поведение
            return super().list(request, *args, **kwargs)
