import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Pagination, Chip} from '@mui/material';
import {useGetEventsQuery} from "../../store/slices/apiSlice";
import {formatDate} from "../../utils/formatDate";

const Events: React.FC = () => {
  const headers = ['№ СМ', 'Вид спорта', 'Место проведения', 'Пол', 'Тип соревнования', 'Начало', 'Окончание'];
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, error, isError, isLoading } = useGetEventsQuery({ page, pageSize });
  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (value <= totalPages && value >= 1) {
      setPage(value);
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['Chip1', 'Chip2', 'Chip3'].map((label, index) => (
          <Chip key={index} label={label} onDelete={() => { }} />
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
                <TableCell sx={{ fontSize: '0.65rem' }}>{event.sm_number}</TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>{event.sport}</TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>{event.location}</TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>{event.gender}</TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>{event.competition_type}</TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>{formatDate(event.start_date)}</TableCell>
                <TableCell sx={{ fontSize: '0.65rem' }}>{formatDate(event.end_date)}</TableCell>
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