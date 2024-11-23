import React, {useState} from 'react';
import {TCalendarEvent} from "../../definitions/types/TCalendarEvent";
import {generateRandomEvents} from "../../utils/generateRandomEvents";
import {Calendar, Views, DateLocalizer} from 'react-big-calendar';
import {format, parse, startOfWeek, getDay} from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {dateFnsLocalizer} from 'react-big-calendar';
import styles from './style.module.css';

const locales = { 'en-US': require('date-fns/locale/en-US') };
const localizer: DateLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent: React.FC = () => {
  const startRange = new Date();
  const endRange = new Date();

  startRange.setMonth(startRange.getMonth() - 1);
  endRange.setMonth(endRange.getMonth() + 2);

  const [events, setEvents] = useState<TCalendarEvent[]>(
    generateRandomEvents(20, startRange, endRange)
  );

  const handleSelectEvent = (event: TCalendarEvent) => {
    alert(`Event: ${event.title}\nDescription: ${event.desc}`);
  };

  const handleSelectSlot = (slotInfo: {
    start: Date;
    end: Date;
    action: string;
    slots: Date[];
  }) => {
    const title = window.prompt('New Event name');
    if (title) {
      const desc = window.prompt('Event Description') || '';
      setEvents([
        ...events,
        {
          id: events.length + 1,
          title,
          desc,
          start: slotInfo.start,
          end: slotInfo.end,
          allDay: false
        },
      ]);
    }
  };

  const eventStyleGetter = (
    event: TCalendarEvent,
    start: Date,
    end: Date,
    isSelected: boolean
  ) => {
    const style = {
      backgroundColor: isSelected ? '#3174ad' : '#ff7f50',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block',
    };
    return { style };
  };

  return (
    <div className={styles.container}>
      <Calendar
        selectable
        events={events}
        startAccessor="start"
        endAccessor="end"
        localizer={localizer}
        defaultView={Views.MONTH}
        style={{ height: '100%' }}
        views={['month', 'week', 'day']}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default CalendarComponent;
