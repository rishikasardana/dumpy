import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

function Preview({ schedule }) {
  const navigate = useNavigate();

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
      <motion.div style={{
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
        gridTemplateColumns: '1fr 1.5fr',
        gap: '40px',
        padding: '40px 60px',
      }}>

        {/* Left — Timeline */}
        <div>
          <h2 style={{ fontSize: '24px', color: '#5b3f34', marginBottom: '24px' }}>Your day</h2>
          <div style={{ position: 'relative', paddingLeft: '80px' }}>
            
            <div style={{
              position: 'absolute',
              left: '70px',
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: '#F1C4A5',
            }} />

            {Array.from({ length: 32 }, (_, i) => i).map((slot) => {
              const startHour = 6;
              const hour = Math.floor(slot / 2) + startHour;
              const minutes = slot % 2 === 0 ? '00' : '30';
              const timeLabel = hour < 12 ? `${hour}:${minutes} am` : hour === 12 ? `12:${minutes} pm` : `${hour - 12}:${minutes} pm`;
              const matchingTask = schedule && schedule.find(item => {
                return item.time.toLowerCase() === timeLabel.toLowerCase();
              });

              return (
                <div key={slot} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  height: matchingTask ? '48px' : '28px',
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '-80px',
                    fontSize: matchingTask ? '14px' : '11px',
                    color: '#5b3f34',
                    opacity: matchingTask ? 0.8 : 0.4,
                    width: '64px',
                    textAlign: 'right',
                  }}>
                    {timeLabel}
                  </span>
                  {matchingTask && (
                    <div style={{
                      flex: 1,
                      backgroundColor: matchingTask.type === 'important' ? '#E34A35' : matchingTask.type === 'implicit' ? '#ffa9bb' : '#F7DDCE',
                      borderRadius: '20px',
                      padding: '12px 20px',
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: matchingTask.type === 'important' ? '#FEF4F0' : '#5b3f34',
                        fontWeight: '500',
                      }}>
                        {matchingTask.task}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — Task Cards */}
        <div>
          <h2 style={{ fontSize: '24px', color: '#5b3f34', marginBottom: '24px' }}>To-Do</h2>
          {schedule && schedule.map((item, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '10px',
              border: item.type === 'important' ? '1.5px solid #E34A35' : '0.5px solid #F1C4A5',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                backgroundColor: item.type === 'important' ? '#E34A35' : item.type === 'implicit' ? '#ffa9bb' : '#F7DDCE',
                borderRadius: '6px',
                padding: '4px 10px',
                minWidth: '70px',
                textAlign: 'center',
              }}>
                <p style={{ margin: 0, fontSize: '11px', color: item.type === 'important' ? '#FEF4F0' : '#5b3f34', fontWeight: '500' }}>
                  {item.time}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#5b3f34', fontWeight: '500' }}>{item.task}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#5b3f34', opacity: 0.5 }}>{item.duration}</p>
              </div>
              <div style={{
                backgroundColor: item.type === 'important' ? '#E34A35' : '#F7DDCE',
                borderRadius: '20px',
                padding: '3px 10px',
              }}>
                <p style={{ margin: 0, fontSize: '11px', color: item.type === 'important' ? '#FEF4F0' : '#5b3f34' }}>
                  {item.type}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={async () => {
              localStorage.setItem('dumpy_schedule', JSON.stringify(schedule));
              const loginRes = await axios.get('http://127.0.0.1:8000/auth/login');
              window.location.href = loginRes.data.auth_url;
            }}
            style={{
              width: '100%',
              padding: '16px',
              marginTop: '16px',
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
            Add to Google Calendar
          </button>
        </div>

      </div>
    </motion.div>
  );
}

export default Preview;