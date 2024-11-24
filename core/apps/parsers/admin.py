import os

from django.conf import settings
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path
from django.utils.timezone import now

from .downloader import EKPDownloader
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
            pdf.save(update_fields=['parsed'])
        self.message_user(request, "Парсинг запущен для выбранных файлов.")

    run_parsing.short_description = "Запустить парсинг выбранных файлов"

    # Кастомный путь для кнопки
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'download-minsport/',
                self.admin_site.admin_view(self.download_and_parse_from_minsport),
                name='download_and_parse_from_minsport',
            )
        ]
        return custom_urls + urls

    # Метод для загрузки и парсинга
    def download_and_parse_from_minsport(self, request):
        downloader = EKPDownloader(save_folder=os.path.join(settings.MEDIA_ROOT, 'pdf_uploads'))
        try:
            saved_files = downloader.download_and_generate_report()
            if saved_files:
                created_count = 0
                for file_path in saved_files:
                    # Приведение пути к относительному виду
                    relative_path = os.path.relpath(file_path, settings.MEDIA_ROOT)

                    # Проверяем, существует ли уже объект
                    if not PDFUpload.objects.filter(file=relative_path).exists():
                        pdf_upload = PDFUpload.objects.create(
                            file=relative_path,  # Сохраняем относительный путь
                            uploaded_at=now(),
                            parsed=False
                        )
                        # Запуск парсинга с использованием полного пути
                        parse_events_pdf.delay(file_path)
                        pdf_upload.parsed = True
                        pdf_upload.save(update_fields=['parsed'])
                        created_count += 1

                self.message_user(
                    request,
                    f"Загружено {len(saved_files)} файлов, создано {created_count} новых объектов PDFUpload."
                )
            else:
                self.message_user(request, "Не удалось загрузить файлы с Минспорта.")
        except Exception as e:
            self.message_user(request, f"Произошла ошибка: {e}")
        return redirect('admin:parsers_pdfupload_changelist')

    # Добавление кнопки в интерфейс
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['download_and_parse_button'] = True  # Передаём флаг в шаблон
        return super().changelist_view(request, extra_context=extra_context)
