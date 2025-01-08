import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Person as PersonIcon, LocationOn as LocationIcon, Add as AddIcon, Search as SearchIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';
import TokenService from '../../services/tokenService';

interface ItemResponse {
  id: number;
  description: string;
  location: string;
  type: string;
  status: string;
  category: string;
  imageUrl: string;
  reportedDate: string;
  reportedByUserId: number;
  reportedByUserName: string;
}

interface Item extends ItemResponse {
  // Ajoutez ici des propriétés supplémentaires si nécessaire
}

interface ItemFormData {
  description: string;
  location: string;
  type: 'Lost' | 'Found';
  category: string;
  imageUrl: string;
  imageFile?: File;
  imagePreview?: string;
}

interface FormErrors {
  description?: string;
  location?: string;
  category?: string;
}

const ItemManagement = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<ItemFormData>({
    description: '',
    location: '',
    type: 'Lost',
    category: '',
    imageUrl: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = TokenService.getToken();
      if (!token) {
        setError('Token d\'authentification manquant');
        setLoading(false);
        return;
      }

      const response = await axios.get('https://localhost:7186/api/Admin/items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response data:', response.data);

      if (Array.isArray(response.data)) {
        setItems(response.data);
      } else {
        setError('Format de données invalide');
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Error details:', error.response || error);
      setError(
        error.response?.data || 
        'Erreur lors du chargement des objets. Vérifiez votre connexion et vos permissions.'
      );
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) {
      return;
    }

    try {
      const token = TokenService.getToken();
      await axios.delete(`https://localhost:7186/api/Admin/items/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Erreur lors de la suppression de l\'objet');
    }
  };

  const handleStatusChange = async (itemId: number, newStatus: string) => {
    try {
      const token = TokenService.getToken();
      await axios.put(
        `https://localhost:7186/api/Admin/items/${itemId}/status`,
        JSON.stringify(newStatus),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setItems(items.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      ));
    } catch (error) {
      console.error('Error updating item status:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const filteredItems = items.filter(item =>
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (item?: Item) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        description: item.description,
        location: item.location,
        type: item.type as 'Lost' | 'Found',
        category: item.category,
        imageUrl: item.imageUrl
      });
      setEditMode(true);
    } else {
      setSelectedItem(null);
      setFormData({
        description: '',
        location: '',
        type: 'Lost',
        category: '',
        imageUrl: ''
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.description.trim()) {
      errors.description = 'La description est requise';
    }
    if (!formData.location.trim()) {
      errors.location = 'La localisation est requise';
    }
    if (!formData.category.trim()) {
      errors.category = 'La catégorie est requise';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          imagePreview: reader.result as string,
          imageUrl: ''
    });
  };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const token = TokenService.getToken();
      const formDataToSend = new FormData();
      
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', selectedItem?.status || 'pending');

      if (formData.imageFile) {
        formDataToSend.append('Image', formData.imageFile);
      } else {
        formDataToSend.append('ImageUrl', formData.imageUrl);
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      };

      let response: { data: Item };
      
      if (editMode && selectedItem) {
        response = await axios.put<Item>(
          `https://localhost:7186/api/Admin/items/${selectedItem.id}`,
          formDataToSend,
          config
        );

      setItems(prevItems => 
        prevItems.map(item => 
            item.id === selectedItem.id 
              ? {
                  ...response.data,
                  imageUrl: response.data.imageUrl || item.imageUrl
                }
              : item
          )
        );

        setSnackbar({
          open: true,
          message: 'Item modifié avec succès',
          severity: 'success'
        });
      } else {
        response = await axios.post<Item>(
          'https://localhost:7186/api/Admin/items',
          formDataToSend,
          config
        );

        setItems(prevItems => [...prevItems, response.data]);
        
        setSnackbar({
          open: true,
          message: 'Item ajouté avec succès',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      await fetchItems();

    } catch (error: any) {
      console.error('Error saving item:', error);
      console.error('Error details:', error.response?.data);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erreur lors de la sauvegarde de l\'objet',
        severity: 'error'
      });
    }
  };

  if (loading) return <Typography>Chargement...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Gestion des Objets
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
          placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                  <SearchIcon />
              </InputAdornment>
            ),
          }}
            sx={{ width: 300 }}
          />
          
          <Fab
            color="primary"
            onClick={() => handleOpenDialog()}
            sx={{
              boxShadow: 3,
              '&:hover': { transform: 'scale(1.05)' }
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.imageUrl || '/placeholder-image.jpg'}
                alt={item.description}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={item.type}
                    color={item.type === 'Lost' ? 'error' : 'success'}
                    size="small"
                  />
                  <Chip 
                    label={item.status}
                    color={
                      item.status === 'pending' ? 'warning' :
                      item.status === 'found' ? 'success' :
                      item.status === 'claimed' ? 'info' : 'default'
                    }
                    size="small"
                  />
                  <Chip 
                    label={item.category}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {item.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {item.location}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {item.reportedByUserName}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {new Date(item.reportedDate).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  size="small"
                  color={item.status === 'pending' ? 'success' : 'warning'}
                  onClick={() => handleStatusChange(
                    item.id,
                    item.status === 'pending' ? 'found' : 'pending'
                  )}
                  sx={{ flexGrow: 1 }}
                >
                  {item.status === 'pending' ? 'Marquer trouvé' : 'Marquer en attente'}
                </Button>
                <IconButton 
                  color="error"
                  size="small"
                  onClick={() => handleDelete(item.id)}
                  sx={{
                    ml: 1,
                    bgcolor: 'error.light',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'error.main',
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  color="primary"
                  onClick={() => handleOpenDialog(item)}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, primary.dark, primary.main)',
          color: 'white',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            {editMode ? 'Modifier l\'objet' : 'Ajouter un objet'}
          </Typography>
          {editMode && (
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
              {formData.description}
            </Typography>
          )}
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
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
            gap: 3,
            mt: 1
          }}>
            <TextField
              label="Description"
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={!!formErrors.description}
              helperText={formErrors.description}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.2)',
                  }
                }
              }}
            />
            
            <TextField
              label="Localisation"
              fullWidth
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={!!formErrors.location}
              helperText={formErrors.location}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',
                  }
                }
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Lost' | 'Found' })}
                label="Type"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    transition: 'all 0.2s',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',
                  }
                }}
              >
                <MenuItem value="Lost" sx={{ py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label="Perdu" 
                      size="small" 
                      color="error"
                      sx={{ minWidth: 60 }}
                    />
                    <Typography>Objet perdu</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Found" sx={{ py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label="Trouvé" 
                      size="small" 
                      color="success"
                      sx={{ minWidth: 60 }}
                    />
                    <Typography>Objet trouvé</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Catégorie"
              fullWidth
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              error={!!formErrors.category}
              helperText={formErrors.category}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',
                  }
                }
              }}
            />
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Image de l'objet
              </Typography>
              
                <Box sx={{ 
                  display: 'flex', 
                gap: 2, 
                alignItems: 'flex-start'
              }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    bgcolor: 'background.default'
                  }}
                >
                  {(formData.imagePreview || formData.imageUrl) ? (
                    <img
                      src={formData.imagePreview || formData.imageUrl}
                      alt="Aperçu"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      align="center"
                      sx={{ p: 1 }}
                    >
                      Aucune image
                    </Typography>
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  
                  <label htmlFor="image-upload">
                    <Button
                      component="span"
                    variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{
                        mb: 1,
                        py: 1,
                        borderStyle: 'dashed'
                      }}
                    >
                      Choisir une image
                    </Button>
                  </label>

                  <TextField
                    label="ou URL de l'image"
                    fullWidth
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        imageUrl: e.target.value,
                        imageFile: undefined,
                        imagePreview: undefined
                      });
                    }}
                    disabled={!!formData.imageFile}
                    size="small"
                    sx={{
                      opacity: formData.imageFile ? 0.5 : 1,
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.38)',
                      }
                    }}
                    helperText={formData.imageFile ? "Upload local sélectionné" : ""}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          p: 3,
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
          borderTop: '1px solid',
          borderColor: 'divider',
          gap: 2
        }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontSize: '0.95rem',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',
              }
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
          sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontSize: '0.95rem',
              background: 'linear-gradient(45deg, primary.dark, primary.main)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            {editMode ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
            Annuler
          </Button>
          <Button 
            onClick={() => {
              confirmDialog.onConfirm();
              setConfirmDialog({ ...confirmDialog, open: false });
            }}
            color="error"
            variant="contained"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemManagement; 