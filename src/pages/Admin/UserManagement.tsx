import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grow
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { TransitionProps } from '@mui/material/transitions';
import TokenService from '../../services/tokenService';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
}

interface EditUserDialog {
  open: boolean;
  user: User | null;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState<EditUserDialog>({
    open: false,
    user: null
  });
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = TokenService.getToken();
      const response = await axios.get('https://localhost:7186/api/Admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Erreur lors du chargement des utilisateurs');
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: number, newStatus: string) => {
    try {
      const token = TokenService.getToken();
      await axios.put(
        `https://localhost:7186/api/Admin/users/${userId}/status`,
        JSON.stringify(newStatus),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const handleEditClick = (user: User) => {
    setEditDialog({ open: true, user });
    setEditedUser(user);
  };

  const handleEditClose = () => {
    setEditDialog({ open: false, user: null });
    setEditedUser({});
  };

  const handleEditSave = async () => {
    if (!editDialog.user) return;

    try {
      const token = TokenService.getToken();
      await axios.put(
        `https://localhost:7186/api/Admin/users/${editDialog.user.id}`,
        editedUser,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setUsers(users.map(user => 
        user.id === editDialog.user?.id ? { ...user, ...editedUser } : user
      ));
      handleEditClose();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      const token = TokenService.getToken();
      await axios.delete(`https://localhost:7186/api/Admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  if (loading) return <Typography>Chargement...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4 
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            textAlign: 'center',
            position: 'relative',
            pb: 2,
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '4px',
              backgroundColor: 'primary.main',
              borderRadius: '2px'
            },
            '& span': {
              color: 'text.secondary',
              fontSize: '1rem',
              display: 'block',
              mt: 1
            }
          }}
        >
          Gestion des Utilisateurs
          <span>Gérez les comptes et les permissions des utilisateurs</span>
        </Typography>
      </Box>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden',
          maxWidth: '80%',
          mx: 'auto',
          '& .MuiTable-root': {
            minWidth: 800
          }
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '12px', fontSize: '1rem' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '12px', fontSize: '1rem' }}>Nom</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '12px', fontSize: '1rem' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '12px', fontSize: '1rem' }}>Rôle</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '12px', fontSize: '1rem' }}>Statut</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '12px', fontSize: '1rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow 
                key={user.id}
                sx={{ 
                  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  '&:hover': { backgroundColor: 'action.selected' },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell sx={{ padding: '12px', fontSize: '0.9rem' }}>{user.id}</TableCell>
                <TableCell sx={{ fontWeight: 500, padding: '12px', fontSize: '0.9rem' }}>{user.name}</TableCell>
                <TableCell sx={{ padding: '12px', fontSize: '0.9rem' }}>{user.email}</TableCell>
                <TableCell sx={{ padding: '12px' }}>
                  <Chip 
                    label={user.role}
                    color={user.role === 'Admin' ? 'primary' : 'default'}
                    sx={{ 
                      fontWeight: 'bold',
                      minWidth: 80,
                      height: 28,
                      fontSize: '0.85rem'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ padding: '12px' }}>
                  <Chip 
                    label={user.status}
                    color={user.status === 'active' ? 'success' : 'error'}
                    sx={{ 
                      fontWeight: 'bold',
                      minWidth: 80,
                      height: 28,
                      fontSize: '0.85rem'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ padding: '12px' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1,
                    '& .MuiButton-root': {
                      minWidth: 'auto',
                      px: 2,
                      py: 0.5
                    },
                    '& .MuiIconButton-root': {
                      width: 32,
                      height: 32,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }
                  }}>
                    <Button
                      variant="contained"
                      color={user.status === 'active' ? 'error' : 'success'}
                      onClick={() => handleStatusChange(
                        user.id, 
                        user.status === 'active' ? 'inactive' : 'active'
                      )}
                      size="small"
                      sx={{ 
                        textTransform: 'none',
                        borderRadius: 1.5,
                        fontSize: '0.85rem',
                        width: '120px',
                        height: '32px',
                        px: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        '&.MuiButton-containedError': {
                          backgroundColor: 'error.main',
                          '&:hover': {
                            backgroundColor: 'error.dark',
                          }
                        },
                        '&.MuiButton-containedSuccess': {
                          backgroundColor: 'success.main',
                          '&:hover': {
                            backgroundColor: 'success.dark',
                          }
                        }
                      }}
                    >
                      {user.status === 'active' ? 'Désactiver' : 'Activer'}
                    </Button>
                    <IconButton 
                      color="info"
                      onClick={() => handleEditClick(user)}
                      size="small"
                      sx={{ 
                        backgroundColor: 'action.hover',
                        '&:hover': { backgroundColor: 'action.selected' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleDelete(user.id)}
                      size="small"
                      sx={{ 
                        backgroundColor: 'error.light',
                        color: 'white',
                        '&:hover': { backgroundColor: 'error.main' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={editDialog.open} 
        onClose={handleEditClose}
        TransitionComponent={Grow}
        TransitionProps={{
          timeout: 200
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 450,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            transform: 'scale(1) !important',
            transition: 'all 0.2s ease-in-out !important',
            border: '2px solid transparent',
            '&:hover': {
              border: '2px solid',
              borderColor: 'primary.light',
            },
            '& .MuiDialogTitle-root': {
              background: 'linear-gradient(45deg, primary.dark, primary.main)',
              color: 'white',
              px: 3,
              py: 2.5,
            }
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            pb: 1
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Modifier l'utilisateur
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
              {editDialog.user?.name}
            </Typography>
            <Box sx={{ 
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '3px',
              bgcolor: 'primary.light',
              borderRadius: '2px'
            }} />
          </Box>
        </DialogTitle>
        <DialogContent 
          sx={{ 
            p: 3,
            background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)',
            '& .MuiTextField-root': {
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.2)',
                }
              }
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2.5,
            pt: 2 
          }}>
            <TextField
              label="Nom"
              fullWidth
              value={editedUser.name || ''}
              onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& label.Mui-focused': {
                  color: 'primary.main',
                }
              }}
            />
            <TextField
              label="Email"
              fullWidth
              value={editedUser.email || ''}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& label.Mui-focused': {
                  color: 'primary.main',
                }
              }}
            />
            <TextField
              label="Rôle"
              fullWidth
              value={editedUser.role || ''}
              onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
              variant="outlined"
              select
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& label.Mui-focused': {
                  color: 'primary.main',
                }
              }}
            >
              <MenuItem value="Admin" sx={{ py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label="Admin" 
                    size="small" 
                    color="primary"
                    sx={{ minWidth: 60 }}
                  />
                  <Typography>Administrateur</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="User" sx={{ py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label="User" 
                    size="small" 
                    color="default"
                    sx={{ minWidth: 60 }}
                  />
                  <Typography>Utilisateur</Typography>
                </Box>
              </MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions 
          sx={{ 
            p: 3, 
            pt: 2,
            background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Button 
            onClick={handleEditClose}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',
              }
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleEditSave} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              ml: 2,
              textTransform: 'none',
              fontSize: '0.95rem',
              background: 'linear-gradient(45deg, primary.dark, primary.main)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 