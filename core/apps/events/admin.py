from django.contrib import admin

from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('number', 'name', 'sport_type', 'start_date', 'end_date')
    list_filter = ('sport_type', 'city', 'event_type')
    search_fields = ('name', 'sport_type', 'discipline_program')
