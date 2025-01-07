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
  CircularProgress,
  Container,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import {
  PhotoCamera,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { itemsApi } from '../../services/api';

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

// Define item types constant
const ITEM_TYPES = {
  LOST: 'Lost',
  FOUND: 'Found'
} as const;

// Update FormData interface to use the literal types
interface FormData {
  description: string;
  location: string;
  type: typeof ITEM_TYPES[keyof typeof ITEM_TYPES];
  category: string;
  imageUrl: string;
  brand: string;
  color: string;
}

const ReportItem = () => {
  const [formData, setFormData] = useState<FormData>({
    description: '',
    location: '',
    type: ITEM_TYPES.LOST,
    imageUrl: '',
    category: 'electronics',
    brand: '',
    color: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch('https://localhost:7186/api/items/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // First check if response is ok
      if (!response.ok) {
        const text = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || `Upload failed: ${response.status}`;
        } catch {
          errorMessage = text || `Upload failed: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      // Parse successful response
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response received');
      }

      const data = JSON.parse(text);
      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      return data.imageUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error instanceof Error ? error : new Error('Upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!user) {
        throw new Error('User must be logged in');
      }

      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const itemData = {
        description: formData.description,
        location: formData.location,
        type: formData.type,
        category: formData.category,
        imageUrl: imageUrl,
        status: 'pending',
        reportedDate: new Date().toISOString(),
        reportedByUserId: user.id,
        brand: formData.brand,
        color: formData.color
      };

      await itemsApi.create(itemData);
      navigate('/items');
    } catch (err) {
      console.error('Error creating item:', err);
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout de l'objet");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ?')) {
      navigate('/items');
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as typeof ITEM_TYPES[keyof typeof ITEM_TYPES];
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Signaler un objet
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
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
                name="location"
                required
                value={formData.location}
                onChange={handleTextFieldChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1" gutterBottom>
                  Type de déclaration
                </Typography>
                <RadioGroup
                  row
                  name="type"
                  value={formData.type}
                  onChange={handleTypeChange}
                >
                  <FormControlLabel
                    value={ITEM_TYPES.LOST}
                    control={<Radio />}
                    label="Objet perdu"
                  />
                  <FormControlLabel
                    value={ITEM_TYPES.FOUND}
                    control={<Radio />}
                    label="Objet trouvé"
                  />
                </RadioGroup>
              </FormControl>
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Signaler l\'objet'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ReportItem; 