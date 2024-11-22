from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.users.models import UserExtended


@admin.register(UserExtended)
class UserExtendedAdmin(UserAdmin):
    """ Админка пользователя """
    pass
