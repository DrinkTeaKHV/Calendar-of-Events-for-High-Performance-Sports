from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from elasticsearch_dsl import analyzer, token_filter

from .models import Event

# Определяем фильтры
russian_stop = token_filter(
    'russian_stop',
    type='stop',
    stopwords='_russian_'  # Используем предопределённый список русских стоп-слов
)

russian_stemmer = token_filter(
    'russian_stemmer',
    type='stemmer',
    language='russian'
)

# Определяем анализатор
russian_analyzer = analyzer(
    'russian_analyzer',
    tokenizer='standard',
    filter=[
        'lowercase',
        russian_stop,
        russian_stemmer,
    ],
)


@registry.register_document
class EventDocument(Document):
    name = fields.TextField(
        analyzer=russian_analyzer,
        fields={'raw': fields.KeywordField()}
    )
    # Определяем остальные поля, по которым будет происходить поиск
    sport_type = fields.TextField(
        analyzer=russian_analyzer,
    )
    discipline_program = fields.TextField(
        analyzer=russian_analyzer,
    )
    city = fields.TextField(
        analyzer=russian_analyzer,
    )
    gender_age_group = fields.TextField(
        analyzer=russian_analyzer,
    )
    event_type = fields.TextField(
        analyzer=russian_analyzer,
    )

    class Index:
        name = 'events'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
            'analysis': {
                'filter': {
                    'russian_stop': {
                        'type': 'stop',
                        'stopwords': '_russian_',
                    },
                    'russian_stemmer': {
                        'type': 'stemmer',
                        'language': 'russian',
                    },
                },
                'analyzer': {
                    'russian_analyzer': {
                        'tokenizer': 'standard',
                        'filter': [
                            'lowercase',
                            'russian_stop',
                            'russian_stemmer',
                        ],
                    },
                },
            },
        }

    class Django:
        model = Event
        fields = [
            'number',
            'sm_in_ekp',
            'start_date',
            'end_date',
            'country',
            'region',
            'venue',
            'participants',
        ]
