import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

function TaskDump({ setSchedule }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState('');
  const [startTime, setStartTime] = useState('8:00 am');
  const [endTime, setEndTime] = useState('8:00 pm');
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');

  const handleSchedule = async () => {
    console.log('block start:', blockStart, 'block end:', blockEnd);
    const response = await axios.post('http://127.0.0.1:8000/schedule', {
      tasks: tasks,
      start_time: startTime,
      end_time: endTime,
      block_start: blockStart,
      block_end: blockEnd,
    });
  
    const cleaned = response.data.schedule.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    setSchedule(parsed);
    navigate('/preview');
  };
  
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        backgroundColor: '#FEF4F0',
      }}
    >
      {/* Header */}
      <motion.div layoutId="dumpy-title" 
        style={{
            backgroundColor: '#ffa9bb',
            padding: '20px',
            textAlign: 'center',
            borderRadius: '12px',
            height: '70px',
            margin: '30px',
          }}>
        <h1 className="dumpy-title" style={{ 
            fontSize: '75px',
            marginTop: '-60px',
            }}>Dumpy</h1>
      </motion.div>

      {/* Content */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '200px',
        padding: '60px',
        }}>

        {/* Left — task text area */}
        <div>
            <h2 style={{ fontSize: '28px', color: '#5b3f34', marginLeft: '60px',marginBottom: '16px' }}>
            What are we doing today?
            </h2>
            <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder={"E.g:\nMake breakfast\nDrive to work\nMeeting at 5pm!"}
            style={{
                width: '100%',
                height: '400px',
                borderRadius: '12px',
                border: '1px solid #ffffff',
                padding: '20px',
                fontSize: '20px',
                marginLeft: '60px',
                color: '#3D2B2B',
                backgroundColor: 'white',
                resize: 'none',
                fontFamily: 'Inter, sans-serif',
            }}
            />
        </div>

        {/* Right — time pickers */}
        <div style={{ paddingTop: '40px' , paddingLeft:'40px', paddingRight:'60px' }}>
            <p style={{ fontSize: '18px', color: '#5b3f34', marginBottom: '24px' }}>
            Tell us what hours are you alive at!
            </p>

            {/* Start time */}
            <p style={{ fontSize: '16px', color: '#5b3f34', marginBottom: '8px' }}>Start your day at:</p>
            <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'white',
                fontSize: '16px',
                color: '#5b3f34',
                marginBottom: '24px',
                fontFamily: 'Inter, sans-serif',
            }}
            />

            {/* End time */}
            <p style={{ fontSize: '16px', color: '#5b3f34', marginBottom: '8px' }}>End your day at:</p>
            <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'white',
                fontSize: '16px',
                color: '#5b3f34',
                marginBottom: '24px',
                fontFamily: 'Inter, sans-serif',
            }}
            />

            {/* Block time */}
            <p style={{ fontSize: '16px', color: '#5b3f34', marginBottom: '8px' }}>Any time you want to block?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
            <input
                type="time"
                value={blockStart}
                onChange={(e) => setBlockStart(e.target.value)}
                style={{
                width: '50%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'white',
                fontSize: '16px',
                color: '#5b3f34',
                fontFamily: 'Inter, sans-serif',
                }}
            />
            <input
                type="time"
                value={blockEnd}
                onChange={(e) => setBlockEnd(e.target.value)}
                style={{
                width: '50%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'white',
                fontSize: '16px',
                color: '#3D2B2B',
                fontFamily: 'Inter, sans-serif',
                }}
            />
            </div>

            {/* Schedule button */}
            <button
            onClick={handleSchedule}
            style={{
                width: '100%',
                padding: '16px',
                marginTop: '32px',
                backgroundColor: '#E34A35',
                color: '#FEF4F0',
                border: 'none',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
            }}
            >
            Schedule it
            </button>

        </div>

        </div>

    </motion.div>
  );
}

export default TaskDump;