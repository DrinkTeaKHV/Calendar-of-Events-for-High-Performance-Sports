import React, {useState} from 'react';
import {TCalendarEvent} from "../../definitions/types/TCalendarEvent";
import {generateRandomEvents} from "../../utils/generateRandomEvents";
import {localizer, messages} from "../../utils/calendar.settings";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Calendar, Views} from 'react-big-calendar';
import styles from './style.module.css';

const CalendarComponent: React.FC = () => {
  const startRange = new Date();
  const endRange = new Date();

  startRange.setMonth(startRange.getMonth() - 1);
  endRange.setMonth(endRange.getMonth() + 2);

  const [events, setEvents] = useState<TCalendarEvent[]>(
    generateRandomEvents(20, startRange, endRange)
  );

  const handleSelectEvent = (event: TCalendarEvent) => {
    alert(`Событие: ${event.title}\nОписание: ${event.desc}`);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date; action: string; slots: Date[]; }) => {
    const title = window.prompt('Название нового события');

    if (title) {
      const desc = window.prompt('Описание события') || '';

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
      backgroundColor: isSelected ? '#1876D1' : '#1876D1',
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
        culture="ru-RU"
        messages={messages}
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
