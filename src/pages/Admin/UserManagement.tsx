import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useTheme,
  alpha,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';
import { mockService } from '../../services/mockData';
import { User, ValidationError } from '../../types';
import { USER_ROLES, USER_STATUS } from '../../constants';
import { validateUser } from '../../utils/validation';

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: typeof USER_ROLES[keyof typeof USER_ROLES];
  status: typeof USER_STATUS[keyof typeof USER_STATUS];
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: USER_ROLES.USER,
    status: USER_STATUS.ACTIVE
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const theme = useTheme();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await mockService.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      showError("Erreur lors du chargement des utilisateurs");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: USER_ROLES.USER,
      status: USER_STATUS.ACTIVE
    });
    setErrors([]);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await mockService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        showSuccess("Utilisateur supprimé avec succès");
      } catch (error) {
        showError("Erreur lors de la suppression de l'utilisateur");
      }
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validateUser(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (selectedUser) {
        // Mise à jour
        const updatedUser = await mockService.updateUser(selectedUser.id, formData);
        setUsers(users.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        ));
        showSuccess("Utilisateur mis à jour avec succès");
      } else {
        // Création
        const newUser = await mockService.register(
          formData.name,
          formData.email,
          formData.password!
        );
        setUsers([...users, newUser]);
        showSuccess("Utilisateur créé avec succès");
      }
      
      handleCloseDialog();
    } catch (error: any) {
      showError(error.message || "Une erreur est survenue");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    resetForm();
  };

  const showSuccess = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'success'
    });
  };

  const showError = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error'
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Gestion des Utilisateurs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedUser(null);
            setOpenDialog(true);
          }}
        >
          Ajouter un utilisateur
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Dernière connexion</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id}
                sx={{ 
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.primary.main, 0.05) 
                  }
                }}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role}
                    color={user.role === 'Admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={user.status === 'active' ? <ActiveIcon /> : <InactiveIcon />}
                    label={user.status === 'active' ? 'Actif' : 'Inactif'}
                    color={user.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(user.lastLogin).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleEdit(user)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(user.id)}
                    color="error"
                    size="small"
                    disabled={user.role === 'Admin'}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSave}>
          <DialogTitle>
            {selectedUser ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                name="name"
                label="Nom"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                required
                error={errors.some(e => e.field === 'name')}
                helperText={errors.find(e => e.field === 'name')?.message}
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                required
                error={errors.some(e => e.field === 'email')}
                helperText={errors.find(e => e.field === 'email')?.message}
              />
              {!selectedUser && (
                <TextField
                  name="password"
                  label="Mot de passe"
                  type="password"
                  fullWidth
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  error={errors.some(e => e.field === 'password')}
                  helperText={errors.find(e => e.field === 'password')?.message}
                />
              )}
              <TextField
                select
                name="role"
                label="Rôle"
                fullWidth
                value={formData.role}
                onChange={handleInputChange}
              >
                <MenuItem value={USER_ROLES.USER}>Utilisateur</MenuItem>
                <MenuItem value={USER_ROLES.ADMIN}>Administrateur</MenuItem>
              </TextField>
              <TextField
                select
                name="status"
                label="Statut"
                fullWidth
                value={formData.status}
                onChange={handleInputChange}
              >
                <MenuItem value={USER_STATUS.ACTIVE}>Actif</MenuItem>
                <MenuItem value={USER_STATUS.INACTIVE}>Inactif</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button type="submit" variant="contained">
              {selectedUser ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement; 