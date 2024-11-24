from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.http import JsonResponse


class RefreshTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Читаем access и refresh токены из кук
        access_token = request.COOKIES.get('access_token')
        refresh_token = request.COOKIES.get('refresh_token')

        if access_token:
            try:
                # Проверяем валидность access_token
                RefreshToken(access_token).check_exp()
            except Exception:
                # Если access_token протух, пытаемся обновить его через refresh_token
                if refresh_token:
                    try:
                        new_access_token = RefreshToken(refresh_token).access_token

                        # Обновляем access_token в куках
                        response = self.get_response(request)
                        response.set_cookie(
                            key='access_token',
                            value=str(new_access_token),
                            httponly=True,
                            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                            samesite='Lax',
                            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                        )
                        return response
                    except Exception:
                        return JsonResponse({'detail': 'Invalid or expired refresh token.'}, status=401)
        return self.get_response(request)
