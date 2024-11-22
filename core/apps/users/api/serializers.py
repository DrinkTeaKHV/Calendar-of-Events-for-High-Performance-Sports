from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from apps.users.models import UserExtended


class TelegramTokenObtainPairSerializer(TokenObtainPairSerializer):
    telegram_id = serializers.IntegerField()

    def validate(self, attrs):
        telegram_id = attrs.get('telegram_id')
        password = attrs.get('password')

        try:
            user = UserExtended.objects.get(telegram_id=telegram_id)
        except UserExtended.DoesNotExist:
            raise serializers.ValidationError('Пользователь с таким Telegram ID не найден.')

        if not user.check_password(password):
            raise serializers.ValidationError('Неверный пароль.')

        # Передаем стандартные поля для дальнейшей валидации
        data = super().validate({
            'username': user.username,
            'password': password,
        })

        return data
