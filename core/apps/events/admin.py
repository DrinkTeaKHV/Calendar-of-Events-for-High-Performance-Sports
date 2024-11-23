from django.contrib import admin

from .models import Event, Sport, CompetitionType, FavoriteEvent


@admin.register(Sport)
class SportAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(CompetitionType)
class CompetitionTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'sport', 'competition_type', 'start_date', 'end_date', 'location')
    list_filter = ('sport', 'competition_type', 'start_date', 'year')
    search_fields = ('name', 'location')


@admin.register(FavoriteEvent)
class FavoriteEventAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'added_at')
    list_filter = ('user', 'event')
    search_fields = ('user__username', 'event__name')
