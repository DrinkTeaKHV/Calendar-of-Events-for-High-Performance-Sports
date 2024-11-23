from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from apps.users.models import UserExtended


@admin.register(UserExtended)
class UserExtendedAdmin(UserAdmin):
    """ Админка пользователя """
    fieldsets = (
        (None, {'fields': ('username', 'password', 'telegram_id')}),
        (_('Personal info'), {
            'fields': (
                'first_name', 'last_name',
            )}
         ),
        (_("Permissions"), {
            "fields": (
                "is_active", "is_superuser",
            )},
         ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
