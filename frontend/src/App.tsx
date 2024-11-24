import React from 'react';
import CalendarComponent from "./features/CalendarComponent/CalendarComponent";
import TopNavigationBar from "./features/TopNavigationBar/TopNavigationBar";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Notifications from "./features/Notifications/Notifications";
import {EModeSwitcher} from "./definitions/enums/EModeSwitcher";
import {useAppSelector} from "./hooks/useAppSelector";
import Sidebar from "./features/Sidebar/Sidebar";
import Events from "./features/Events/Events";
import Login from "./features/Login/Login";
import {Box} from "@mui/material";
import './main.global.css';

const App = () => {
  const sidebarIsActive = useAppSelector((state) => state.sidebar.sidebar);
  const mode = useAppSelector((state) => state.mode.mode);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Box sx={{ width: '100%', position: 'fixed', zIndex: 1300 }}>
              <TopNavigationBar />
            </Box>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                marginTop: '64px',
              }}
            >
              {sidebarIsActive && <Sidebar />}
              <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                  {mode === EModeSwitcher.events
                    ? <Events />
                    : <CalendarComponent />
                  }
              </Box>
            </Box>
          </Box>
        } />
        <Route path="/login" element={
          <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Login />
          </Box>
        } />
        <Route path="/settings" element={
          <Box sx={{ width: '100%', position: 'fixed', zIndex: 1300 }}>
            <TopNavigationBar />
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
              <Notifications />
            </Box>
          </Box>
        } />
      </Routes>
    </Router>
  );
}

export default App;