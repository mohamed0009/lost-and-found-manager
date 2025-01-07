import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  useTheme,
  styled,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  fontSize: '3rem',
  backgroundColor: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const Profile: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: 'STD2024001',
    notifications: true,
    emailNotifications: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your update logic here
    setShowSnackbar(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Info Section */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <LargeAvatar>{user?.name?.charAt(0)}</LargeAvatar>
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  bgcolor: 'primary.main',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  mt: 1
                }}
              >
                {user?.role}
              </Typography>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Settings Section */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Paramètres du profil
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom complet"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Numéro d'étudiant"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Notifications
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notifications}
                        onChange={handleChange}
                        name="notifications"
                        color="primary"
                      />
                    }
                    label="Notifications dans l'application"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.emailNotifications}
                        onChange={handleChange}
                        name="emailNotifications"
                        color="primary"
                      />
                    }
                    label="Notifications par email"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{
                      mt: 2,
                      height: 48,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                    }}
                  >
                    Sauvegarder les modifications
                  </Button>
                </Grid>
              </Grid>
            </form>
          </StyledPaper>
        </Grid>
      </Grid>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          Profil mis à jour avec succès
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 