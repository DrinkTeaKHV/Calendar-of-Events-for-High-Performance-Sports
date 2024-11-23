from django.contrib import admin

from apps.notifications.models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'notification_type', 'email_sent', 'telegram_sent', 'created_at')
    list_filter = ('notification_type', 'email_sent', 'telegram_sent', 'created_at')
    search_fields = ('user__username', 'event__name', 'message')
