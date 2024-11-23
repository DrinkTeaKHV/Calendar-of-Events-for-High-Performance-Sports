import React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Pagination, Chip} from '@mui/material';

const rows = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  title: 'Typography',
  value: 'Cell',
}));

const Events: React.FC = () => {
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
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                {['Head', 'Head', 'Head', 'Head', 'Head', 'Head'].map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  {['', '', '', '', ''].map((_, index) => (
                    <TableCell key={index}>{row.value}</TableCell>
                  ))}
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