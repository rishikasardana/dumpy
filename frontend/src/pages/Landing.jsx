import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Landing() {
  const navigate = useNavigate();

  return (
    <motion.div
      exit = {{opacity:0}}
      style ={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fef4f0',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          backgroundColor: '#ffa9bb',
          borderRadius: '24px',
          padding: '80px 60px',
          extAlign: 'center',
          width: '95%',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',

        }}
      >
        <motion.h1
          className="dumpy-title"
          
          style={{ fontSize: '96px', marginBottom: '24px' }}
        >
          Dumpy
        </motion.h1>

        <p style={{
          fontSize: '18px',
          color: '#5b3f34',
          marginBottom: '40px',
          lineHeight: '1.6',
          textAlign: 'center'
        }}>
          Need help organizing your calendar? Dump it all here, and<br />
          Dumpy will organise it for you!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/task-dump')}
          style={{
            backgroundColor: '#E34A35',
            color: '#FEF4F0',
            border: 'none',
            borderRadius: '50px',
            padding: '16px 48px',
            fontSize: '18px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Get Started!
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default Landing;