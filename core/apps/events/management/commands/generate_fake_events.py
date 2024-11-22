import random

from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker

from apps.events.models import Event


class Command(BaseCommand):
    help = 'Generate fake events'

    def add_arguments(self, parser):
        parser.add_argument('total', type=int, help='Количество создаваемых мероприятий')

    def handle(self, *args, **kwargs):
        total = kwargs['total']
        fake = Faker('ru_RU')

        sport_types = ['Футбол', 'Баскетбол', 'Плавание', 'Теннис', 'Лёгкая атлетика']
        event_types = ['Чемпионат', 'Кубок', 'Первенство', 'Турнир']
        genders = ['Мужчины', 'Женщины', 'Смешанные']
        age_groups = ['Дети', 'Юноши', 'Взрослые', 'Сеньоры']
        disciplines = ['100м', '200м', '400м', '800м', '1500м']
        countries = ['Россия', 'Беларусь', 'Казахстан']
        regions = ['Московская область', 'Санкт-Петербург', 'Новосибирская область', 'Краснодарский край']
        cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Краснодар', 'Екатеринбург']
        venues = ['Стадион "Лужники"', 'СК "Олимпийский"', 'Дворец спорта "Юбилейный"']

        existing_numbers = set(Event.objects.values_list('number', flat=True))

        for _ in range(total):
            number = random.randint(1, 100000)
            while number in existing_numbers:
                number = random.randint(1, 100000)
            existing_numbers.add(number)

            sm_in_ekp = fake.lexify(text='???-????-????')
            name = f"{random.choice(event_types)} по {random.choice(sport_types)}"
            gender_age_group = f"{random.choice(genders)}, {random.choice(age_groups)}"
            discipline_program = random.choice(disciplines)
            start_date = fake.date_between(start_date='-1y', end_date='+1y')
            end_date = start_date + timezone.timedelta(days=random.randint(1, 7))
            country = random.choice(countries)
            region = random.choice(regions)
            city = random.choice(cities)
            venue = random.choice(venues)
            participants = random.randint(10, 500)
            sport_type = random.choice(sport_types)
            event_type = random.choice(event_types)

            Event.objects.create(
                number=number,
                sm_in_ekp=sm_in_ekp,
                name=name,
                gender_age_group=gender_age_group,
                discipline_program=discipline_program,
                start_date=start_date,
                end_date=end_date,
                country=country,
                region=region,
                city=city,
                venue=venue,
                participants=participants,
                sport_type=sport_type,
                event_type=event_type,
            )

        self.stdout.write(self.style.SUCCESS(f'Создано {total} фейковых мероприятий.'))
