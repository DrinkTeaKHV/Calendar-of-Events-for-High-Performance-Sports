import {dateFnsLocalizer, DateLocalizer} from "react-big-calendar";
import {format as dateFnsFormat} from "date-fns/format";
import {getDay, Locale, parse} from "date-fns";
import ru from "date-fns/locale/ru";

const ruLocale = ru as unknown as Locale;

const localizer: DateLocalizer = dateFnsLocalizer({
  format: (date: Date, formatString: string, culture?: string): string => {
    const intlOptions: Intl.DateTimeFormatOptions = {};

    if (formatString === 'MMMM') {
      intlOptions.month = 'long';
    } else if (formatString === 'EEEE') {
      intlOptions.weekday = 'long';
    } else {
      return dateFnsFormat(date, formatString, { locale: ruLocale });
    }

    return new Intl.DateTimeFormat(culture || 'ru-RU', intlOptions).format(date);
  },
  parse: (value: string, formatString: string) =>
    parse(value, formatString, new Date(), { locale: ruLocale }),
  startOfWeek: () => 1,
  getDay: (date: Date) => getDay(date),
  locales: { ru: ruLocale },
});

const messages = {
  allDay: 'Весь день',
  previous: 'Назад',
  next: 'Вперёд',
  today: 'Сегодня',
  month: 'Месяц',
  week: 'Неделя',
  day: 'День',
  agenda: 'Повестка',
  date: 'Дата',
  time: 'Время',
  event: 'Событие',
  noEventsInRange: 'Нет событий в этом диапазоне.',
  showMore: (total: number) => `+ ещё (${total})`,
};

export { localizer, messages };