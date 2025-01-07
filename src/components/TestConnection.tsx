import React, { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import axios from 'axios';

const TestConnection: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let mounted = true;

    const testConnection = async () => {
      try {
        const response = await axios.get('https://localhost:7186/api/test', {
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          // Fix the type error
          httpsAgent: new (require('https').Agent)({ 
            rejectUnauthorized: false 
          })
        });

        if (!mounted) return;

        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
          setTimeout(() => setOpen(false), 3000);
        } else {
          throw new Error(response.data.message || 'Backend error');
        }
      } catch (error) {
        if (!mounted) return;
        
        setStatus('error');
        if (axios.isAxiosError(error)) {
          if (error.code === 'ERR_NETWORK') {
            setMessage('Backend server is not running. Please start the backend server.');
          } else if (error.code === 'ECONNABORTED') {
            setMessage('Connection timeout. Please check if the backend server is running.');
          } else {
            setMessage(error.message || 'Failed to connect to backend');
          }
        } else {
          setMessage('An unexpected error occurred');
        }
        console.error('Connection error:', error);
      }
    };

    testConnection();
    return () => { mounted = false; };
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert 
        onClose={handleClose}
        severity={status === 'success' ? 'success' : 'error'}
        variant="filled"
        sx={{ 
          width: '100%',
          '& .MuiAlert-icon': {
            fontSize: '20px'
          },
          '& .MuiAlert-message': {
            fontSize: '14px'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default TestConnection; 