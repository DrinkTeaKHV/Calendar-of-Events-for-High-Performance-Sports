import React from 'react';
import CalendarComponent from "./features/CalendarComponent/CalendarComponent";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Notifications from "./features/Notifications/Notifications";
import Events from "./features/Events/Events";
import './main.global.css';

const App = () => {
    return (
       <Router>
          <Routes>
              <Route path="/" element={<Events />} />
              <Route path="/calendar" element={<CalendarComponent />} />
              <Route path="/notifications" element={<Notifications />} />
          </Routes>
       </Router>
    );
}

export default App;