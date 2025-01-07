import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  useTheme,
  Divider,
  Avatar,
  Card,
  CardContent,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  AssignmentReturned as AssignmentReturnedIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { grey } from '@mui/material/colors';
import { contactService } from '../../services/contactService';

type StatusType = 'pending' | 'approved' | 'claimed' | 'returned';

interface StatusConfig {
  label: string;
  color: string;
  icon: React.ReactElement;
}

interface ItemType {
  id: number;
  description: string;
  location: string;
  reportedDate: string;
  updatedAt: string;
  status: StatusType;
  type: 'Lost' | 'Found';
  category: string;
  imageUrl?: string;
  reportedByUser?: {
    id: number;
    name: string;
    email: string;
  };
}

const STATUS_MAP: Record<StatusType, StatusConfig> = {
  pending: {
    label: 'En attente de validation',
    color: '#ed6c02',
    icon: <InfoIcon />
  },
  approved: {
    label: 'Validé',
    color: '#2e7d32',
    icon: <CheckCircleIcon />
  },
  claimed: {
    label: 'Réclamé',
    color: '#0288d1',
    icon: <PersonIcon />
  },
  returned: {
    label: 'Retourné',
    color: '#1b5e20',
    icon: <AssignmentReturnedIcon />
  }
};

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<ItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!id) return;
        const response = await itemsApi.getById(Number(id));
        console.log('Item data:', response.data); // For debugging
        setItem(response.data);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Erreur lors du chargement de l\'objet');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleContact = async () => {
    if (!user || !item?.reportedByUser) {
      return;
    }

    try {
      await contactService.sendMessage({
        itemId: item.id,
        recipientId: item.reportedByUser.id,
        message: `Intéressé par : ${item.description}`
      });
      // Gérer le succès
    } catch (error) {
      console.error('Error sending message:', error);
      // Gérer l'erreur
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !item) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Objet non trouvé'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/items')}
        sx={{ mb: 3 }}
      >
        Retour à la liste
      </Button>

      <Grid container spacing={4}>
        {/* Left Column - Image and Status */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Chip
                label={item.type === 'Lost' ? 'Perdu' : 'Trouvé'}
                color={item.type === 'Lost' ? 'error' : 'success'}
                sx={{ 
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: '1rem',
                  px: 2,
                  py: 1
                }}
              />
              <Box
                component="img"
                src={item.imageUrl || '/placeholder.png'}
                alt={item.description}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
            </Box>

            {/* Status Timeline */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Statut de l'objet
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    p: 2,
                    bgcolor: alpha(STATUS_MAP[item.status]?.color || '#9e9e9e', 0.1),
                    borderRadius: 1,
                  }}>
                    {STATUS_MAP[item.status]?.icon}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1" color={STATUS_MAP[item.status]?.color}>
                        {STATUS_MAP[item.status]?.label || 'Statut inconnu'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Dernière mise à jour: {new Date(item.updatedAt).toLocaleDateString('fr-FR')}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              height: '100%',
              background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
            }}
          >
            <Typography variant="h4" gutterBottom fontWeight="500">
              {item.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Details Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Localisation
                    </Typography>
                    <Typography variant="body1">
                      {item.location}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date de signalement
                    </Typography>
                    <Typography variant="body1">
                      {new Date(item.reportedDate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CategoryIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Catégorie
                    </Typography>
                    <Typography variant="body1">
                      {item.category}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Reporter Info */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      Déclaré par
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.reportedByUser?.name || 'Utilisateur anonyme'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Contact Button */}
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              fullWidth
              onClick={handleContact}
              sx={{
                mt: 2,
                py: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(0, 86, 179, 0.3)',
                }
              }}
            >
              Contacter le déclarant
            </Button>

            {!user && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                align="center" 
                sx={{ mt: 1 }}
              >
                Connectez-vous pour contacter le déclarant
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ItemDetail; 