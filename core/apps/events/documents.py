from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry

from .models import CompetitionType, Event, Sport

# Определяем индекс
event_index = Index('events')

# Настройки индекса
event_index.settings(
    number_of_shards=1,
    number_of_replicas=0
)

@registry.register_document
class EventDocument(Document):
    sport = fields.ObjectField(
        properties={
            'id': fields.IntegerField(),
            'name': fields.TextField(),
        }
    )
    competition_type = fields.ObjectField(
        properties={
            'id': fields.IntegerField(),
            'name': fields.TextField(),
        }
    )

    class Index:
        # Название индекса в Elasticsearch
        name = 'events'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = Event  # Модель, которую будем индексировать

        # Поля модели, которые будут индексироваться в Elasticsearch
        fields = [
            'sm_number',
            'name',
            'participants',
            'gender',
            'start_date',
            'end_date',
            'location',
            'participants_count',
            'reserve',
            'month',
            'year',
            'min_age',
            'max_age',
        ]

        # Связи ForeignKey
        related_models = [Sport, CompetitionType]

    def get_queryset(self):
        """Определяем queryset для индексации."""
        return super(EventDocument, self).get_queryset().select_related(
            'sport',
            'competition_type'
        )

    def get_instances_from_related(self, related_instance):
        """Получаем события из связанных моделей."""
        if isinstance(related_instance, Sport):
            return related_instance.event_set.all()
        elif isinstance(related_instance, CompetitionType):
            return related_instance.event_set.all()
