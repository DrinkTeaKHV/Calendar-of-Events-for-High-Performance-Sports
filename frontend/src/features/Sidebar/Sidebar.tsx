import React from 'react';
import {Drawer, List, ListItem, ListItemText, ListSubheader, Checkbox, Chip} from '@mui/material';

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          marginTop: '64px',
        },
      }}
    >
      <List subheader={<ListSubheader>Фильтр по категориям</ListSubheader>}>
        {['Дисциплина', 'Программа', 'Место проведения'].map((category) => (
          <ListItem key={category}>
            <Chip label={category} variant="outlined" sx={{ mr: 1 }} />
            <Checkbox />
          </ListItem>
        ))}
        <ListItem>
          <ListItemText primary="List item" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;