import {TCalendarEvent} from '../definitions/types/TCalendarEvent';
import {generateRandomDate} from "./generateRandomDate";
import {generateRandomInt} from "./generateRandomInt";

let eventIdCounter = 1;

const sampleTitles = [
  'Встреча',
  'Конференция',
  'Семинар',
  'Обед с командой',
  'Срок сдачи проекта',
  'Звонок с клиентом',
  'Вебинар',
  'Тренинг',
  'Запуск продукта',
  'Заседание совета',
  'Один на один',
  'Планирование спринта',
  'Ретроспектива',
  'День демо',
  'Сетевое мероприятие',
  'Сессия мозгового штурма',
  'Презентация продаж',
  'Интервью с HR',
  'Ревью дизайна',
  'Код-ревью',
];

export const generateRandomEvent = (
  startRange: Date,
  endRange: Date
): TCalendarEvent => {
  const title = sampleTitles[generateRandomInt(0, sampleTitles.length - 1)];
  const allDay = Math.random() < 0.3;
  const start = generateRandomDate(startRange, endRange);
  let end: Date;

  if (allDay) {
    end = new Date(start);
    end.setDate(start.getDate() + 1);
  } else {
    const durationHours = generateRandomInt(1, 4);

    end = new Date(start);
    end.setHours(start.getHours() + durationHours);
  }

  const descriptions = [
    'Discuss project milestones.',
    'Plan for the next sprint.',
    'Review quarterly results.',
    'Brainstorm new ideas.',
    'Client feedback session.',
    'Team building activities.',
    'Technical training.',
    'Strategy meeting.',
    'Product demo.',
    'Market analysis.',
  ];

  const desc = descriptions[generateRandomInt(0, descriptions.length - 1)];

  return {
    id: eventIdCounter++,
    title,
    allDay,
    start,
    end,
    desc,
  };
};

export const generateRandomEvents = (
  numberOfEvents: number,
  startRange: Date,
  endRange: Date
): TCalendarEvent[] => {
  const events: TCalendarEvent[] = [];

  for (let i = 0; i < numberOfEvents; i++) {
    events.push(generateRandomEvent(startRange, endRange));
  }

  return events;
};