import {TCalendarEvent} from '../definitions/types/TCalendarEvent';
import {generateRandomDate} from "./generateRandomDate";
import {generateRandomInt} from "./generateRandomInt";

let eventIdCounter = 1;

const sampleTitles = [
  'Meeting',
  'Conference',
  'Workshop',
  'Team Lunch',
  'Project Deadline',
  'Client Call',
  'Webinar',
  'Training Session',
  'Product Launch',
  'Board Meeting',
  'One-on-One',
  'Sprint Planning',
  'Retrospective',
  'Demo Day',
  'Networking Event',
  'Brainstorming Session',
  'Sales Presentation',
  'HR Interview',
  'Design Review',
  'Code Review',
];

export const generateRandomEvent = (
  startRange: Date,
  endRange: Date
): TCalendarEvent => {
  const title = sampleTitles[generateRandomInt(0, sampleTitles.length - 1)];
  const allDay = Math.random() < 0.3; // 30% chance the event is all day

  // Generate a random start date within the range
  const start = generateRandomDate(startRange, endRange);

  // Determine event duration
  let end: Date;
  if (allDay) {
    // All-day events last for one day
    end = new Date(start);
    end.setDate(start.getDate() + 1);
  } else {
    // Events last between 1 to 4 hours
    const durationHours = generateRandomInt(1, 4);
    end = new Date(start);
    end.setHours(start.getHours() + durationHours);
  }

  // Optional description
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