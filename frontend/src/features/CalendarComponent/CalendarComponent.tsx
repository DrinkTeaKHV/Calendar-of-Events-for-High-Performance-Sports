import React, {useEffect, useState} from 'react';
import {TCalendarEvent} from "../../definitions/types/TCalendarEvent";
import {localizer, messages} from "../../utils/calendar.settings";
import {useGetEventsQuery} from '../../store/slices/apiSlice';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Calendar, Views} from 'react-big-calendar';
import styles from './style.module.css';
import {getRandomColor} from "../../utils/getRandomColor";

const CalendarComponent: React.FC = () => {
  const startRange = new Date();
  const endRange = new Date();

  startRange.setMonth(startRange.getMonth() - 1);
  endRange.setMonth(endRange.getMonth() + 2);

  const { data } = useGetEventsQuery({ page: 1,  pageSize: 1360 });
  const [events, setEvents] = useState<TCalendarEvent[]>([]);

  useEffect(() => {
    if (data && data.results) {
      const mappedEvents: TCalendarEvent[] = data.results.map((event) => ({
        id: event.id,
        title: event.name,
        desc: event.competition_type,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        allDay: false,
      }));

      setEvents(mappedEvents);
    }
  }, [data]);

  const handleSelectEvent = (event: TCalendarEvent) =>
    alert(`Событие: ${event.title}\nОписание: ${event.desc}`);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date; action: string; slots: Date[]; }) => {
    const title = window.prompt('Название нового события');

    if (title) {
      const desc = window.prompt('Описание события') || '';

      const newEvent: TCalendarEvent = {
        id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1, // Ensure unique ID
        title,
        desc,
        start: slotInfo.start,
        end: slotInfo.end,
        allDay: false,
      };

      setEvents([...events, newEvent]);
    }
  };
  console.log(getRandomColor());

  const eventStyleGetter = (
    event: TCalendarEvent,
    start: Date,
    end: Date,
    isSelected: boolean
  ) => {
    const style = {
      backgroundColor: isSelected ? getRandomColor() : getRandomColor(),
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