import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Grid,
  Alert,
  styled,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  PhotoCamera,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockService, ITEM_TYPE } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Item } from '../../types';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '& fieldset': {
      borderColor: theme.palette.divider,
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    }
  },
  '& .MuiInputLabel-root': {
    backgroundColor: theme.palette.background.paper,
    padding: '0 4px',
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    }
  }
}));

type FormData = {
  description: string;
  location: string;
  type: 'Lost' | 'Found';
  imageUrl: string;
  category: string;
  brand: string;
  color: string;
};

const ReportItem = () => {
  const [formData, setFormData] = useState<FormData>({
    description: '',
    location: '',
    type: 'Lost' as const,
    imageUrl: '',
    category: 'electronics',
    brand: '',
    color: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await mockService.createItem({
        ...formData,
        status: 'pending' as const,
        reportedDate: new Date().toISOString(),
        reportedByUserId: user?.id || 0,
      } as Omit<Item, "id">);
      navigate('/items');
    } catch (err) {
      setError("Erreur lors de l'ajout de l'objet");
    }
  };

  const handleCancel = () => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ?')) {
      navigate('/items');
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as 'Lost' | 'Found';
    setFormData({ ...formData, type: value });
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <StyledPaper>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Signaler un objet
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                required
                multiline
                rows={3}
                value={formData.description}
                onChange={handleTextFieldChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lieu"
                required
                value={formData.location}
                onChange={handleTextFieldChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Type"
                required
                value={formData.type}
                onChange={handleTypeChange}
              >
                {Object.entries(ITEM_TYPE).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <input
                accept="image/*"
                type="file"
                id="image-input"
                hidden
                onChange={handleImageChange}
              />
              <label htmlFor="image-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  fullWidth
                >
                  Ajouter une photo
                </Button>
              </label>
            </Grid>

            {imagePreview && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    backgroundImage: `url(${imagePreview})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: 1,
                    border: '1px solid #ddd',
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <StyledFormControl fullWidth>
                <InputLabel id="category-label">Catégorie</InputLabel>
                <Select
                  labelId="category-label"
                  value={formData.category}
                  onChange={handleSelectChange}
                  name="category"
                  required
                  label="Catégorie"
                >
                  <MenuItem value="electronics">Électronique</MenuItem>
                  <MenuItem value="documents">Documents</MenuItem>
                  <MenuItem value="accessories">Accessoires</MenuItem>
                  <MenuItem value="clothing">Vêtements</MenuItem>
                  <MenuItem value="other">Autres</MenuItem>
                </Select>
              </StyledFormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Marque/Modèle"
                name="brand"
                value={formData.brand}
                onChange={handleTextFieldChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Couleur"
                name="color"
                value={formData.color}
                onChange={handleTextFieldChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<CancelIcon />}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    background: theme =>
                      `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  }}
                >
                  Enregistrer
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>
    </Box>
  );
};

export default ReportItem; 