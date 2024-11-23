from django.contrib import admin

from .models import ParsingLog, PDFUpload
from .tasks.parsing import parse_events_pdf


@admin.register(ParsingLog)
class ParsingLogAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'status', 'timestamp')
    list_filter = ('status', 'timestamp')
    search_fields = ('file_name', 'message')


@admin.register(PDFUpload)
class PDFUploadAdmin(admin.ModelAdmin):
    list_display = ('id', 'file', 'uploaded_at', 'parsed', 'parsing_log')
    list_filter = ('parsed', 'uploaded_at')
    search_fields = ('file__name',)
    actions = ['run_parsing']

    def run_parsing(self, request, queryset):
        for pdf in queryset.filter(parsed=False):
            parse_events_pdf.delay(pdf.file.path)
            pdf.parsed = True
            pdf.save()
        self.message_user(request, "Парсинг запущен для выбранных файлов.")

    run_parsing.short_description = "Запустить парсинг выбранных файлов"
