import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import TaskDump from './pages/TaskDump';
import Preview from './pages/Preview';
import Success from './pages/Success';
import './App.css';

function AnimatedRoutes({ schedule, setSchedule }) {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/task-dump" element={<TaskDump setSchedule={setSchedule} />} />
        <Route path="/preview" element={<Preview schedule={schedule} />} />
        <Route path="/success" element={<Success schedule={schedule} />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [schedule, setSchedule] = useState(null);

  return (
    <Router>
      <AnimatedRoutes schedule={schedule} setSchedule={setSchedule} />
    </Router>
  );
}

export default App;