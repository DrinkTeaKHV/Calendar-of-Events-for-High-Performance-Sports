# Generated by Django 5.1.3 on 2024-11-23 05:43

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CompetitionType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(unique=True, verbose_name='Тип соревнования')),
            ],
            options={
                'verbose_name': 'Тип соревнования',
                'verbose_name_plural': 'Типы соревнований',
            },
        ),
        migrations.CreateModel(
            name='Sport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(unique=True, verbose_name='Название вида спорта')),
            ],
            options={
                'verbose_name': 'Вид спорта',
                'verbose_name_plural': 'Виды спорта',
            },
        ),
        migrations.AlterModelOptions(
            name='event',
            options={'verbose_name': 'Мероприятие', 'verbose_name_plural': 'Мероприятия'},
        ),
        migrations.RemoveField(
            model_name='event',
            name='city',
        ),
        migrations.RemoveField(
            model_name='event',
            name='country',
        ),
        migrations.RemoveField(
            model_name='event',
            name='discipline_program',
        ),
        migrations.RemoveField(
            model_name='event',
            name='event_type',
        ),
        migrations.RemoveField(
            model_name='event',
            name='gender_age_group',
        ),
        migrations.RemoveField(
            model_name='event',
            name='number',
        ),
        migrations.RemoveField(
            model_name='event',
            name='region',
        ),
        migrations.RemoveField(
            model_name='event',
            name='sm_in_ekp',
        ),
        migrations.RemoveField(
            model_name='event',
            name='sport_type',
        ),
        migrations.RemoveField(
            model_name='event',
            name='venue',
        ),
        migrations.AddField(
            model_name='event',
            name='gender',
            field=models.CharField(choices=[('male', 'Мужской'), ('female', 'Женский'), ('other', 'Другой')], default='male', verbose_name='Пол'),
        ),
        migrations.AddField(
            model_name='event',
            name='location',
            field=models.CharField(default=None, verbose_name='Место проведения'),
        ),
        migrations.AddField(
            model_name='event',
            name='max_age',
            field=models.IntegerField(blank=True, null=True, verbose_name='Максимальный возраст'),
        ),
        migrations.AddField(
            model_name='event',
            name='min_age',
            field=models.IntegerField(blank=True, null=True, verbose_name='Минимальный возраст'),
        ),
        migrations.AddField(
            model_name='event',
            name='month',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='Месяц проведения'),
        ),
        migrations.AddField(
            model_name='event',
            name='participants_count',
            field=models.IntegerField(blank=True, null=True, verbose_name='Количество участников'),
        ),
        migrations.AddField(
            model_name='event',
            name='reserve',
            field=models.BooleanField(default=False, verbose_name='Резерв'),
        ),
        migrations.AddField(
            model_name='event',
            name='sm_number',
            field=models.CharField(default=1, unique=True, verbose_name='№ СМ в ЕКП'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='event',
            name='year',
            field=models.IntegerField(blank=True, null=True, verbose_name='Год проведения'),
        ),
        migrations.AlterField(
            model_name='event',
            name='name',
            field=models.CharField(verbose_name='Наименование мероприятия'),
        ),
        migrations.AlterField(
            model_name='event',
            name='participants',
            field=models.CharField(verbose_name='Участники'),
        ),
        migrations.AddField(
            model_name='event',
            name='competition_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='events.competitiontype', verbose_name='Тип соревнования'),
        ),
        migrations.AddField(
            model_name='event',
            name='sport',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='events.sport', verbose_name='Вид спорта'),
        ),
        migrations.CreateModel(
            name='FavoriteEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('added_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event', verbose_name='Мероприятие')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Избранное мероприятие',
                'verbose_name_plural': 'Избранные мероприятия',
                'unique_together': {('user', 'event')},
            },
        ),
    ]