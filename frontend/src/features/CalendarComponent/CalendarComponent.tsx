import React, {useEffect, useState} from 'react';
import {TCalendarEvent} from "../../definitions/types/TCalendarEvent";
import {localizer, messages} from "../../utils/calendar.settings";
import {CircularProgress, Typography, Box} from '@mui/material';
import {useGetEventsQuery} from '../../store/slices/apiSlice';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {useAppSelector} from '../../hooks/useAppSelector';
import {Calendar, Views} from 'react-big-calendar';
import {RootState} from '../../store/store';
import styles from './style.module.css';

const CalendarComponent: React.FC = () => {
  const filters = useAppSelector((state: RootState) => state.filters);
  const [page, setPage] = useState(1);
  const pageSize = 1360;
  const { data, error, isError, isLoading } = useGetEventsQuery({
    page,
    pageSize,
    sport: filters.sport || undefined,
    location: filters.location || undefined,
    participantsCount: filters.participantsCount || undefined,
  });
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
    } else {
      setEvents([]);
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [filters.sport, filters.location, filters.participantsCount]);

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

  const handleSelectEvent = (event: TCalendarEvent) =>
    alert(`Событие: ${event.title}\nОписание: ${event.desc}`);

  const eventStyleGetter = (
    event: TCalendarEvent,
    start: Date,
    end: Date,
    isSelected: boolean
  ) => {
    const style = {
      backgroundColor: '#1976d2',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block',
    };

    return { style };
  };

  if (isError) {
    const status = error && 'status' in error ? error.status : null;

    return (
      <Box sx={{ padding: '16px', textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {status === 404 || status === 400
            ? 'Нет доступных данных.'
            : 'Ошибка загрузки данных.'}
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.results.length === 0) {
    return (
      <Box sx={{ padding: '16px', textAlign: 'center' }}>
        <Typography variant="h6">Нет доступных данных.</Typography>
      </Box>
    );
  }

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