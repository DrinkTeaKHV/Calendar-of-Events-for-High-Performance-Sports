import React, { useState, useEffect } from 'react';
import {
  Chip,
  Table,
  TableRow,
  Checkbox,
  TableBody,
  TableHead,
  TableCell,
  Pagination,
  Typography,
  TableContainer,
  CircularProgress,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import {
  resetSport,
  resetLocation,
  resetParticipantsCount,
  resetCompetitionType,
  resetGender,
  resetQ,
  setStartDate,
  setEndDate,
  setOrdering,
  resetAllFilters,
} from '../../store/slices/filtersSlice';
import { useGetEventsQuery, useAddToFavoritesMutation } from '../../store/slices/apiSlice';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { formatDate } from '../../utils/formatDate';
import { RootState } from '../../store/store';

const Events: React.FC = () => {
  const headers = [
    '№ СМ',
     'Название',
    'Вид спорта',
    'Место проведения',
    'Макс. участников',
    'Пол',
    'Тип соревнования',
    'Начало',
    'Окончание',
  ];

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state: RootState) => state.filters);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [addToFavorites] = useAddToFavoritesMutation();

  const { data, error, isError, isLoading } = useGetEventsQuery({
    page,
    pageSize,
    sport: filters.sport,
    location: filters.location,
    participantsCount: filters.participantsCount,
    competitionType: filters.competitionType,
    gender: filters.gender,
    q: filters.q,
    start_date: filters.start_date,
    end_date: filters.end_date,
    ordering: filters.ordering,
  });

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  useEffect(() => {
    setPage(1);
  }, [
    filters.sport,
    filters.location,
    filters.participantsCount,
    filters.competitionType,
    filters.gender,
    filters.q,
    filters.start_date,
    filters.end_date,
    filters.ordering,
  ]);

  const orderingOptions = [
    { value: 'start_date', label: 'Дата начала (по возрастанию)' },
    { value: '-start_date', label: 'Дата начала (по убыванию)' },
    { value: 'end_date', label: 'Дата окончания (по возрастанию)' },
    { value: '-end_date', label: 'Дата окончания (по убыванию)' },
  ];

  const handleCheckboxChange = async (eventId: number, isChecked: boolean) => {
    if (isChecked) {
      try {
        await addToFavorites({ event: eventId }).unwrap();
        setSelectedEvents((prev) => [...prev, eventId]);
      } catch (error) {
        console.error('Ошибка при добавлении в избранное:', error);
      }
    } else {
      setSelectedEvents((prev) => prev.filter((id) => id !== eventId));
    }
  };

  const handlePageChange = (
      event: React.ChangeEvent<unknown>,
      value: number
  ) => {
    if (value <= totalPages && value >= 1) {
      setPage(value);
    }
  };

  const handleDelete = (filterType: string) => {
    switch (filterType) {
      case 'sport':
        dispatch(resetSport());
        break;
      case 'location':
        dispatch(resetLocation());
        break;
      case 'participantsCount':
        dispatch(resetParticipantsCount());
        break;
      case 'competitionType':
        dispatch(resetCompetitionType());
        break;
      case 'gender':
        dispatch(resetGender());
        break;
      case 'q':
        dispatch(resetQ());
        break;
      case 'start_date':
        dispatch(setStartDate(null));
        break;
      case 'end_date':
        dispatch(setEndDate(null));
        break;
      case 'ordering':
        dispatch(setOrdering(null));
        break
      default:
        break;
    }
  };

  const activeFilters = [
    { type: 'sport', label: filters.sport },
    { type: 'location', label: filters.location },
    {
      type: 'participantsCount',
      label: filters.participantsCount
          ? `до ${filters.participantsCount} человек`
          : '',
    },
    { type: 'competitionType', label: filters.competitionType },
    { type: 'gender', label: filters.gender },
    { type: 'q', label: filters.q },
    { type: 'start_date', label: filters.start_date ? `с ${filters.start_date}` : '' },
    { type: 'end_date', label: filters.end_date ? `до ${filters.end_date}` : '' },
    { type: 'ordering', label: filters.ordering ? `Сортировка: ${filters.ordering.replace('_', ' ')}` : '' },
  ].filter((filter) => filter.label);


  return (
      <div style={{ padding: '16px' }}>
        <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '16px',
              flexWrap: 'wrap',
            }}
        >
          {activeFilters.map((filter) => (
              <Chip
                  key={filter.type}
                  label={filter.label}
                  onDelete={() => handleDelete(filter.type)}
              />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <TextField
              type="date"
              label="Дата начала"
              InputLabelProps={{ shrink: true }}
              value={filters.start_date || ''}
              onChange={(e) => dispatch(setStartDate(e.target.value || null))}
          />
          <TextField
              type="date"
              label="Дата окончания"
              InputLabelProps={{ shrink: true }}
              value={filters.end_date || ''}
              onChange={(e) => dispatch(setEndDate(e.target.value || null))}
          />
          <TextField
              select
              label="Сортировка"
              value={filters.ordering || ''}
              onChange={(e) => dispatch(setOrdering(e.target.value || null))}
              sx={{ minWidth: '200px' }}
          >
            {orderingOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
            ))}
          </TextField>
        </div>

        {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <CircularProgress />
            </div>
        ) : data && data.results.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    {headers.map((header, index) => (
                        <TableCell key={index}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.results.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                              checked={event.is_favorite}
                              onChange={(e) =>
                                  handleCheckboxChange(event.id, e.target.checked)
                              }
                          />
                        </TableCell>
                        <TableCell>{event.sm_number}</TableCell>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.sport}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.participants_count}</TableCell>
                        <TableCell>{event.gender}</TableCell>
                        <TableCell>{event.competition_type}</TableCell>
                        <TableCell>{formatDate(event.start_date)}</TableCell>
                        <TableCell>{formatDate(event.end_date)}</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        ) : (
            <Typography variant="h6" align="center">
              Нет доступных данных.
            </Typography>
        )}
        {totalPages > 1 && (
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                sx={{ mt: 2, float: 'right' }}
            />
        )}
      </div>
  );
};

export default Events;
