export type TCalendarEvent = {
  id: number;
  title: string;
  allDay?: boolean;
  start: Date;
  end: Date;
  desc?: string;
}