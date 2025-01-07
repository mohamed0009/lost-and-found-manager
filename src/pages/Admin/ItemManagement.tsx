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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Person as PersonIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import axios from 'axios';
import TokenService from '../../services/tokenService';

interface Item {
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

const ItemManagement = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <Typography>Chargement...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold',
          mb: 4,
          color: 'primary.main'
        }}
      >
        Gestion des Objets
      </Typography>

      <Grid container spacing={3}>
        {items.map((item) => (
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
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ItemManagement; 