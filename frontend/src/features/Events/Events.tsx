import React, {useState, useEffect} from 'react';
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
} from '@mui/material';
import {
  resetSport,
  resetLocation,
  resetParticipantsCount,
  resetCompetitionType,
  resetGender,
  resetQ
} from '../../store/slices/filtersSlice'; // Import new reset actions
import {useGetEventsQuery} from '../../store/slices/apiSlice';
import {useAppSelector} from '../../hooks/useAppSelector';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {formatDate} from '../../utils/formatDate';
import {RootState} from '../../store/store';

const Events: React.FC = () => {
  const headers = [
    '№ СМ',
    'Вид спорта',
    'Место проведения',
    'Кол. участников',
    'Пол',
    'Тип соревнования',
    'Начало',
    'Окончание',
  ];
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state: RootState) => state.filters);
  const { data, error, isError, isLoading } = useGetEventsQuery({
    page,
    pageSize,
    sport: filters.sport,
    location: filters.location,
    participantsCount: filters.participantsCount,
    competitionType: filters.competitionType,
    genders: filters.gender,
  });

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  useEffect(() => {
    setPage(1);
  }, [filters.sport, filters.location, filters.participantsCount, filters.competitionType, filters.gender, filters.q]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    const status = error && 'status' in error ? error.status : null;

    if (status === 404 || status === 400) {
      return <Typography variant="h6" align="center">Нет доступных данных.</Typography>;
    } else {
      return <Typography variant="h6" align="center">Ошибка загрузки данных.</Typography>;
    }
  }

  if (!data || data.results.length === 0) {
    return <Typography variant="h6" align="center">Нет доступных данных.</Typography>;
  }

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
                  <Checkbox />
                </TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>
                  {event.sm_number}
                </TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>
                  {event.sport}
                </TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>
                  {event.location}
                </TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>
                  {event.participants_count}
                </TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>
                  {event.gender}
                </TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>
                  {event.competition_type}
                </TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>
                  {formatDate(event.start_date)}
                </TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>
                  {formatDate(event.end_date)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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