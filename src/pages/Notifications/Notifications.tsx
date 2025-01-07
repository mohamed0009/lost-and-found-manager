import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Paper,
  Divider,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import {
  CheckCircleOutline as ReadIcon,
  Delete as DeleteIcon,
  NotificationsNone as NotificationIcon
} from '@mui/icons-material';
import { useNotifications } from '../../contexts/NotificationsContext';

const Notifications: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const theme = useTheme();

  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Notifications
        </Typography>
        {notifications.some(n => !n.read) && (
          <Button
            onClick={markAllAsRead}
            startIcon={<ReadIcon />}
            variant="outlined"
            size="small"
          >
            Tout marquer comme lu
          </Button>
        )}
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        {notifications.length === 0 ? (
          <Box sx={{ 
            p: 4, 
            textAlign: 'center',
            color: 'text.secondary'
          }}>
            <NotificationIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography>
              Aucune notification pour le moment
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{
                    bgcolor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                  secondaryAction={
                    <Box>
                      {!notification.read && (
                        <IconButton 
                          edge="end" 
                          onClick={() => handleMarkAsRead(notification.id)}
                          sx={{ mr: 1 }}
                        >
                          <ReadIcon color="primary" />
                        </IconButton>
                      )}
                    </Box>
                  }
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.timestamp}
                    primaryTypographyProps={{
                      fontWeight: notification.read ? 400 : 500,
                      color: notification.read ? 'text.primary' : 'primary.main',
                    }}
                    secondaryTypographyProps={{
                      sx: { mt: 0.5 }
                    }}
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default Notifications; 