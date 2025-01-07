import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const NetworkMonitor: React.FC = () => {
  const [lastApiCall, setLastApiCall] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('online');

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('https://localhost:7186/api/test');
        if (response.ok) {
          setApiStatus('online');
          setLastApiCall(new Date().toLocaleTimeString());
        } else {
          setApiStatus('offline');
        }
      } catch {
        setApiStatus('offline');
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    checkBackendStatus();

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper sx={{ p: 2, position: 'fixed', bottom: 16, right: 16 }}>
      <Typography variant="body2">
        Backend Status: {apiStatus === 'online' ? '🟢 Online' : '🔴 Offline'}
      </Typography>
      {lastApiCall && (
        <Typography variant="caption">
          Last successful connection: {lastApiCall}
        </Typography>
      )}
    </Paper>
  );
};

export default NetworkMonitor; 