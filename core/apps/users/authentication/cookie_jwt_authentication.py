from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Чтение токенов из кук
        access_token = request.COOKIES.get('access_token')

        if not access_token:
            return None  # Если токен отсутствует, вернуть None (анонимный пользователь)

        # Проверка токена с использованием JWTAuthentication
        validated_token = self.get_validated_token(access_token)
        user = self.get_user(validated_token)

        if not user.is_active:
            raise AuthenticationFailed('User is inactive.')

        return (user, validated_token)