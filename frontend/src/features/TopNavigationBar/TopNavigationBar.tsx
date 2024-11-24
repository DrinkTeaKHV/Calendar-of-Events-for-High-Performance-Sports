import React from 'react';
import {AppBar, Toolbar, Typography, IconButton, InputBase, ToggleButtonGroup, ToggleButton, Box} from '@mui/material';
import {Menu, Search, AccountCircle, CalendarToday, List} from '@mui/icons-material';
import {EModeSwitcher} from "../../definitions/enums/EModeSwitcher";
import {useAppSelector} from "../../hooks/useAppSelector";
import {useAppDispatch} from "../../hooks/useAppDispatch";
import {setMode} from "../../store/slices/modeSlice";
import {toggleSidebar} from "../../store/slices/siderbarSlice";
import { useNavigate } from 'react-router-dom';

const TopNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const mode = useAppSelector((state) => state.mode.mode);
  const dispatch = useAppDispatch();

  const handleSidebarClick = () =>
    dispatch(toggleSidebar());

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, mode: EModeSwitcher) =>
      dispatch(setMode(mode));

  const handleNavigateToSettings = () => {
      navigate('/settings');
  };

  const handleNavigateToEvents = () => {
      navigate('/');
  };


    return (
    <AppBar position="static" sx={{ height: '64px' }}>
      <Toolbar sx={{ height: '64px', minHeight: '64px' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleSidebarClick}
        >
          <Menu />
        </IconButton>
        <Typography onClick={handleNavigateToEvents} variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }}>
          Мероприятия
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleViewChange}
          sx={{
            border: '1px solid #ccc',
            borderRadius: 1,
            bgcolor: 'white',
            height: '40px',
          }}
        >
          <ToggleButton value={EModeSwitcher.events} sx={{ border: 'none', padding: '0 16px' }}>
            <List />
          </ToggleButton>
          <ToggleButton value={EModeSwitcher.calendar} sx={{ border: 'none', padding: '0 16px' }}>
            <CalendarToday />
          </ToggleButton>
        </ToggleButtonGroup>
        <IconButton onClick={handleNavigateToSettings} color="inherit">
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavigationBar;