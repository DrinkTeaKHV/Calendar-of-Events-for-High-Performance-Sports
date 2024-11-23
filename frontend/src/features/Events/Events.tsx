import React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Pagination, Chip} from '@mui/material';
import {useGetEventsQuery} from "../../store/slices/apiSlice";
import {formatDate} from "../../utils/formatDate";

const Events: React.FC = () => {
  const headers = ['№ СМ', 'Вид спорта', 'Место проведения', 'Пол', 'Тип соревнования', 'Начало', 'Окончание'];
  const eventsResponse = useGetEventsQuery();

  if (!eventsResponse?.data) {
    return <div>Loading or no data available...</div>;
  }

  return (
    <>
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['Chip', 'Chip', 'Chip'].map((label, index) => (
            <Chip key={index} label={label} onDelete={() => {}} />
          ))}
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox /></TableCell>
                {headers.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {eventsResponse.data.results.map((event) => (
                <TableRow key={event.id}>
                  <TableCell padding="checkbox"><Checkbox /></TableCell>
                  <TableCell sx={{ fontSize: '0.65rem' }} key={event.id}>{event.sm_number}</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem' }} key={event.id}>{event.sport}</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem' }} key={event.id}>{event.location}</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem' }} key={event.id}>{event.gender}</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem' }} key={event.id}>{event.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem' }} key={event.id}>{formatDate(event.start_date)}</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem' }} key={event.id}>{formatDate(event.end_date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination count={5} variant="outlined" shape="rounded" sx={{ mt: 2, float: 'right' }} />
      </div>
    </>
  );
};

export default Events;