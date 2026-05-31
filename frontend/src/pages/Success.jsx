import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

function Success({ schedule }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('adding');

  const hasRun = React.useRef(false);

useEffect(() => {
  if (hasRun.current) return;
  hasRun.current = true;

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const savedSchedule = JSON.parse(localStorage.getItem('dumpy_schedule'));

  if (token && savedSchedule) {
    axios.post('http://127.0.0.1:8000/add-to-calendar', {
      schedule: savedSchedule,
      token: token,
    }).then(() => {
      localStorage.removeItem('dumpy_schedule');
      setStatus('done');
    }).catch((err) => {
      console.error(err);
      setStatus('error');
    });
  }
}, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        backgroundColor: '#FEF4F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div style={{
        backgroundColor: '#ffa9bb',
        padding: '20px',
        textAlign: 'center',
        borderRadius: '12px',
        height: '70px',
        width: '90%',
        marginBottom: '40px',
      }}>
        <h1 className="dumpy-title" style={{ fontSize: '75px', marginTop: '-60px' }}>Dumpy</h1>
      </motion.div>

      <div style={{ textAlign: 'center', padding: '40px' }}>
      {status === 'adding' && (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
            width: '60px', height: '60px', borderRadius: '50%',
            border: '4px solid #ffa9bb',
            borderTop: '4px solid #E34A35',
            margin: '0 auto 24px',
            }}
        />
        )}

        {status === 'done' && (
          <>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    backgroundColor: '#ffa9bb', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                }}
                >
                <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    style={{ fontSize: '40px' }}
                >
                     ✓
                </motion.span>
                </motion.div>
            <p style={{ fontSize: '28px', fontWeight: '500', color: '#5b3f34', marginBottom: '8px' }}>You're all set!</p>
            <p style={{ fontSize: '16px', color: '#5b3f34', opacity: 0.6, marginBottom: '32px' }}>
              Your tasks have been added to Google Calendar!
            </p>
            <button
              onClick={() => window.open('https://calendar.google.com', '_blank')}
              style={{
                backgroundColor: '#E34A35', color: '#FEF4F0',
                border: 'none', borderRadius: '50px',
                padding: '16px 48px', fontSize: '18px',
                fontWeight: '500', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', marginBottom: '16px',
                width: '100%',
              }}
            >
              View in Google Calendar
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: 'transparent', color: '#E34A35',
                border: '1.5px solid #E34A35', borderRadius: '50px',
                padding: '16px 48px', fontSize: '18px',
                fontWeight: '500', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', width: '100%',
              }}
            >
              Dump more tasks
            </button>
          </>
        )}
        {status === 'error' && (
          <p style={{ fontSize: '24px', color: '#E34A35' }}>Something went wrong. Please try again!</p>
        )}
      </div>
    </motion.div>
  );
}

export default Success;