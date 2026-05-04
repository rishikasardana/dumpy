import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import TaskDump from './pages/TaskDump';
import Preview from './pages/Preview';
import Success from './pages/Success';
import './App.css';

function App() {
  const [schedule, setSchedule] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/task-dump" element={<TaskDump setSchedule={setSchedule} />} />
        <Route path="/preview" element={<Preview schedule={schedule} />} />
        <Route path="/success" element={<Success schedule={schedule} />} />
      </Routes>
    </Router>
  );
}

export default App;