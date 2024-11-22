import factory

from apps.users.models import UserExtended


class UserExtendedFactory(factory.django.DjangoModelFactory):
    """
    Фабрика создания пользователей
    """

    class Meta:
        model = UserExtended

    is_superuser = False
    is_staff = False
    is_active = True
