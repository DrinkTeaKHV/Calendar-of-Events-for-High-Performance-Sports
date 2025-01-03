# Generated by Django 5.1.3 on 2024-11-24 01:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_competitiontype_sport_alter_event_options_and_more'),
        ('users', '0003_userextended_receive_event_reminders_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userextended',
            name='favorite_sports',
            field=models.ManyToManyField(blank=True, related_name='subscribed_users', to='events.sport', verbose_name='Любимые виды спорта'),
        ),
    ]
