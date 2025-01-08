import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  Divider,
  Fade,
  Grow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import TokenService from '../../services/tokenService';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setPageLoaded(true);
    }, 300);
  }, []);

  const handleEditProfile = async () => {
    try {
      const token = TokenService.getToken();
      if (!editedUser.name.trim() || !editedUser.email.trim()) {
        setError('Tous les champs sont obligatoires');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedUser.email)) {
        setError('Format d\'email invalide');
        return;
      }

      await axios.put(
        `https://localhost:7186/api/Admin/users/${user?.id}`,
        {
          id: user?.id,
          name: editedUser.name,
          email: editedUser.email,
          role: user?.role,
          status: user?.status
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Mettre à jour le contexte utilisateur
      if (user) {
        updateUser({
          ...user,
          name: editedUser.name,
          email: editedUser.email,
        });
      }
      
      setSuccess(true);
      setOpenDialog(false);
      setError('');
      
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response.data.message || 'Email déjà utilisé ou données invalides');
      } else if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError('Une erreur est survenue lors de la mise à jour du profil');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Chargement du profil...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={pageLoaded} timeout={800}>
      <Box>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* En-tête du profil */}
          <Grow in={pageLoaded} timeout={800}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Mon Profil
              </Typography>
              <Typography color="text.secondary">
                Gérez vos informations personnelles
              </Typography>
            </Box>
          </Grow>

          {/* Informations du profil */}
          <Grow 
            in={pageLoaded} 
            timeout={1000}
            style={{ transitionDelay: '200ms' }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              }}
            >
              <Grid container spacing={4}>
                {/* Avatar et informations de base */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: 'primary.main',
                        fontSize: '3rem'
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h5" gutterBottom>
                      {user?.name}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {user?.role}
                    </Typography>
                  </Box>
                </Grid>

                {/* Détails du profil */}
                <Grid item xs={12} md={8}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Informations personnelles
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography color="text.secondary">Email</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {user?.email}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography color="text.secondary">Statut du compte</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {user?.status === 'active' ? 'Actif' : 'Inactif'}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 4 }}>
                      <Button
                        variant="contained"
                        onClick={() => setOpenDialog(true)}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          py: 1.5,
                          textTransform: 'none',
                          fontSize: '1rem',
                          background: theme => 
                            `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                            transform: 'translateY(-1px)'
                          }
                        }}
                      >
                        Modifier le profil
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grow>
        </Container>

        {/* Dialog de modification */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              borderBottom: '1px solid',
              borderColor: 'divider',
              px: 3,
              py: 2,
              backgroundColor: 'primary.main',
              color: 'white'
            }}
          >
            Modifier le profil
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {error && <Alert severity="error">{error}</Alert>}
              
              <TextField
                label="Nom"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
              
              <TextField
                label="Email"
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions 
            sx={{ 
              p: 3, 
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              gap: 1
            }}
          >
            <Button 
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{ 
                borderRadius: '8px',
                px: 3,
                py: 1,
                textTransform: 'none'
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleEditProfile}
              variant="contained"
              color="primary"
              sx={{ 
                borderRadius: '8px',
                px: 3,
                py: 1,
                textTransform: 'none',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              Sauvegarder
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar de succès */}
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSuccess(false)} 
            severity="success"
            sx={{ width: '100%' }}
          >
            Profil mis à jour avec succès
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default Profile; 