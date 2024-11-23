from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry

from .models import Event


@registry.register_document
class EventDocument(Document):
    name = fields.TextField(
        analyzer='ngram_analyzer',
        search_analyzer='standard',
        fields={'keyword': fields.KeywordField()},
    )
    sport_type = fields.TextField(
        analyzer='ngram_analyzer',
        search_analyzer='standard',
        fields={'keyword': fields.KeywordField()},
    )
    discipline_program = fields.TextField(
        analyzer='ngram_analyzer',
        search_analyzer='standard',
        fields={'keyword': fields.KeywordField()},
    )
    city = fields.TextField(
        analyzer='ngram_analyzer',
        search_analyzer='standard',
        fields={'keyword': fields.KeywordField()},
    )
    gender_age_group = fields.TextField(
        analyzer='ngram_analyzer',
        search_analyzer='standard',
        fields={'keyword': fields.KeywordField()},
    )
    event_type = fields.TextField(
        analyzer='ngram_analyzer',
        search_analyzer='standard',
        fields={'keyword': fields.KeywordField()},
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
                    'ngram_filter': {
                        'type': 'edge_ngram',
                        'min_gram': 2,
                        'max_gram': 20,
                    },
                },
                'analyzer': {
                    'ngram_analyzer': {
                        'tokenizer': 'standard',
                        'filter': [
                            'lowercase',
                            'russian_stop',
                            'russian_stemmer',
                            'ngram_filter',
                        ],
                    },
                    'standard_russian': {
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
