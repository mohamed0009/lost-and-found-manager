import React, { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User';
}

interface UserFormProps {
  user: User | null;
  onSubmit: (userData: Partial<User>) => void;
  onCancel: () => void;
}

const UserForm = ({ user, onSubmit, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User' as 'Admin' | 'User'
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
    };

    // Validation du nom
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Validation du mot de passe
    if (!user) {  // Uniquement pour la création
      if (!formData.password) {
        newErrors.password = 'Le mot de passe est requis';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir au moins une majuscule';
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir au moins un chiffre';
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {user ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Nom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!user}
            fullWidth
            error={!!errors.password}
            helperText={errors.password}
          />
          <FormControl fullWidth>
            <InputLabel>Rôle</InputLabel>
            <Select
              value={formData.role}
              label="Rôle"
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Admin' | 'User' })}
            >
              <MenuItem value="User">Utilisateur</MenuItem>
              <MenuItem value="Admin">Administrateur</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="contained">
          {user ? 'Modifier' : 'Ajouter'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default UserForm; 