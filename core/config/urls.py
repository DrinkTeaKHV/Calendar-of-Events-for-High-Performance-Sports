import os

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions, routers
from rest_framework_simplejwt.views import TokenRefreshView

from apps.events.api.views import EventViewSet, SportListAPIView, FavoriteEventViewSet
from apps.users.api.views import TelegramTokenObtainPairView, UserSettingsViewSet, LogoutView

schema_view = get_schema_view(
    openapi.Info(
        title="Swagger",
        default_version='v1',
        description="Документация к api",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
router = routers.DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'settings', UserSettingsViewSet, basename='settings')
router.register(r'favorite-events', FavoriteEventViewSet, basename='favorite-event')
urlpatterns = [

    path('api/swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    path('admin/', admin.site.urls),

    path('api/', include(router.urls)),
    path('api/login/', TelegramTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/logout', LogoutView.as_view(), name='logout'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/sports/', SportListAPIView.as_view(), name='sports-list'),  # Эндпоинт для получения списка

]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if os.environ.get('DJANGO_SETTINGS_MODULE') == 'config.debug_toolbar_settings':
    urlpatterns.append(path('__debug__/', include('debug_toolbar.urls')))
