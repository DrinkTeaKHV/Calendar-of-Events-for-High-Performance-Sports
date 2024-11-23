from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import TelegramTokenObtainPairSerializer


class TelegramTokenObtainPairView(TokenObtainPairView):
    serializer_class = TelegramTokenObtainPairSerializer
