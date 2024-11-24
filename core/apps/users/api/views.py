from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings

from ..models import UserExtended
from .serializers import (
    TelegramTokenObtainPairSerializer,
    UserNotificationSettingsSerializer,
)


class TelegramTokenObtainPairView(TokenObtainPairView):
    serializer_class = TelegramTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Получаем токены из ответа
        access_token = response.data.get('access')
        refresh_token = response.data.get('refresh')

        if not access_token or not refresh_token:
            return Response(
                {'error': 'Ошибка аутентификации. Токены отсутствуют.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Создаем объект ответа
        res = Response(response.data, status=response.status_code)

        # Устанавливаем токены в куки
        res.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite='Lax',
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
        )
        res.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite='Lax',
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
        )

        return res


class UserSettingsViewSet(viewsets.ModelViewSet):
    """
    API endpoint для настройки уведомлений пользователя.
    """
    serializer_class = UserNotificationSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'put']

    def get_queryset(self):
        return UserExtended.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get', 'put'], url_path='notifications')
    def notifications(self, request):
        user = request.user
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = self.get_serializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)


class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out successfully."})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response
