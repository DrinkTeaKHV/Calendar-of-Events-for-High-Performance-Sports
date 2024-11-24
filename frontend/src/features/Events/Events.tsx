import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Pagination, Chip,} from '@mui/material';
import {resetSport, resetLocation, resetParticipantsCount} from '../../store/slices/filtersSlice';
import {useGetEventsQuery} from '../../store/slices/apiSlice';
import {useSelector, useDispatch} from 'react-redux';
import {formatDate} from '../../utils/formatDate';
import {RootState} from '../../store/store';

const Events: React.FC = () => {
  const headers = [ '№ СМ', 'Вид спорта', 'Место проведения', 'Пол', 'Тип соревнования', 'Начало', 'Окончание',];
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const dispatch = useDispatch();

  const filters = useSelector((state: RootState) => state.filters);
  const { data, error, isError } = useGetEventsQuery({ page, pageSize, ...filters,});
  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  if (isError) {
    const status = error && 'status' in error ? error.status : null;

    if (status === 404 || status === 400) {
      if (page > 1) {
        setPage(1);
        return null;
      }

      return <div>No data available.</div>;
    } else {
      return <div>Error loading data.</div>;
    }
  }

  if (!data || data.results.length === 0) {
    return <div>No data available.</div>;
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