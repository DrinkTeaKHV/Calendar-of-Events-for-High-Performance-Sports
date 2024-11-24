from rest_framework import serializers

from apps.events.models import CompetitionType, Event, Sport, FavoriteEvent


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
    is_favorite = serializers.SerializerMethodField(read_only=True)  # Новое поле

    def get_sport(self, obj):
        return obj.sport.name

    def get_is_favorite(self, obj):
        """
        Проверяет, добавлено ли событие в избранное текущим пользователем.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return FavoriteEvent.objects.filter(user=request.user, event=obj).exists()
        return False

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
            'is_favorite'
        ]
        read_only_fields = ['id']


class FavoriteEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteEvent
        fields = ['id', 'user', 'event', 'added_at']
        read_only_fields = ['added_at']
