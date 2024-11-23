import React from 'react';
import CalendarComponent from "./features/CalendarComponent/CalendarComponent";
import TopNavigationBar from "./features/TopNavigationBar/TopNavigationBar";
import {EModeSwitcher} from "./definitions/enums/EModeSwitcher";
import {useAppSelector} from "./hooks/useAppSelector";
import Sidebar from "./features/Sidebar/Sidebar";
import Events from "./features/Events/Events";
import {Box} from "@mui/material";
import './main.global.css';

const App = () => {
  const mode = useAppSelector((state) => state.mode.mode);

  return (
    <>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Box sx={{ width: '100%', position: 'fixed' }}>
          <TopNavigationBar />
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            marginTop: '64px',
          }}
        >
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
            {mode === EModeSwitcher.events
              ? <Events />
              : <CalendarComponent />
            }
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;