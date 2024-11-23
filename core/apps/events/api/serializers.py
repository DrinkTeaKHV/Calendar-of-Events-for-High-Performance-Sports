from rest_framework import serializers

from apps.events.models import CompetitionType, Event, Sport


class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ['id', 'name']
        read_only_fields = ['id']


class CompetitionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionType
        fields = ['id', 'name']
        read_only_fields = ['id']


class EventSerializer(serializers.ModelSerializer):
    sport = serializers.SerializerMethodField(read_only=True)
    competition_type = serializers.SerializerMethodField(read_only=True)

    def get_sport(self, obj):
        return obj.sport.name

    def get_competition_type(self, obj):
        return obj.competition_type.name

    class Meta:
        model = Event
        fields = [
            'id',
            'sm_number',
            'name',
            'participants',
            'gender',
            'competition_type',
            'start_date',
            'end_date',
            'location',
            'participants_count',
            'reserve',
            'sport',
            'month',
            'year',
            'min_age',
            'max_age',
        ]
        read_only_fields = ['id']
