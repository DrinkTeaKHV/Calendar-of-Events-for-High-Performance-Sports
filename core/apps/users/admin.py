from django.contrib.auth.admin import UserAdmin

from apps.users.models import UserExtended


class UserExtendedAdmin(UserAdmin):
    model = UserExtended
    list_display = ['username', 'email', 'telegram_id', 'receive_new_event_notifications', 'receive_event_update_notifications', 'receive_event_reminders', 'is_staff']
    list_filter = ['receive_new_event_notifications', 'receive_event_update_notifications', 'receive_event_reminders', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        (None, {
            'fields': (
                'telegram_id',
                'receive_new_event_notifications',
                'receive_event_update_notifications',
                'receive_event_reminders',
            )
        }),
    )