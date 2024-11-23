from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from ..models import UserExtended
from .serializers import (
    TelegramTokenObtainPairSerializer,
    UserNotificationSettingsSerializer,
)


class TelegramTokenObtainPairView(TokenObtainPairView):
    serializer_class = TelegramTokenObtainPairSerializer



class UserSettingsViewSet(viewsets.ModelViewSet):
    """
    API endpoint для настройки уведомлений пользователя.
    """
    serializer_class = UserNotificationSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

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
