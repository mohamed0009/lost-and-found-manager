import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  styled,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Fab,
  Tooltip,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  Fade,
  Grow
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  Add as AddIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { itemsApi, usersApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../../components/SearchBar';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '400px',
  width: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(250,251,252,0.8) 100%)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: theme.spacing(1),
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  }
}));

const ImageContainer = styled(Box)({
  position: 'relative',
  height: '250px',
  width: '100%',
  overflow: 'hidden',
});

const StyledCardMedia = styled('img')(({ theme }) => ({
  height: '100%',
  width: '100%',
  objectFit: 'contain',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  transition: 'opacity 0.3s ease',
  '&.loading': {
    opacity: 0.5,
  }
}));

const FALLBACK_IMAGE = '/assets/images/placeholder.jpg';

const ADMIN_EMAIL = 'admin@emsi.com';

const ItemsList: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const theme = useTheme();
  const [loadingImages, setLoadingImages] = useState<{ [key: number]: boolean }>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
        const response = await itemsApi.getAll();
        setItems(response.data);
        setFilteredItems(response.data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des objets');
        console.error('Error fetching items:', err);
      } finally {
                setLoading(false);
            }
        };

        fetchItems();
        setTimeout(() => {
          setPageLoaded(true);
        }, 300);
    }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'lost':
        return {
          bg: theme.palette.error.main,
          color: '#ffffff'
        };
      case 'found':
        return {
          bg: theme.palette.success.main,
          color: '#ffffff'
        };
      case 'claimed':
        return {
          bg: theme.palette.info.main,
          color: '#ffffff'
        };
      case 'pending':
        return {
          bg: theme.palette.warning.main,
          color: theme.palette.warning.contrastText
        };
      case 'returned':
        return {
          bg: theme.palette.primary.main,
          color: '#ffffff'
        };
      default:
        return {
          bg: theme.palette.grey[500],
          color: '#ffffff'
        };
    }
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
  };

  const getReporterInfo = async (reportedByUserId: number) => {
    try {
      const response = await usersApi.getById(reportedByUserId);
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const handleContact = async (item: Item) => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      // Create email content
      const subject = encodeURIComponent(`Demande de contact - ${item.type === 'Lost' ? 'Objet perdu' : 'Objet trouvé'}`);
      const body = encodeURIComponent(
        `Bonjour,\n\n` +
        `Je souhaite contacter le déclarant concernant l'objet suivant :\n\n` +
        `Référence: #${item.id}\n` +
        `Description: ${item.description}\n` +
        `Statut: ${item.type === 'Lost' ? 'Perdu' : 'Trouvé'}\n` +
        `Localisation: ${item.location}\n` +
        `Date de déclaration: ${new Date(item.reportedDate).toLocaleDateString('fr-FR')}\n\n` +
        `Mes informations de contact :\n` +
        `Nom: ${user.name}\n` +
        `Email: ${user.email}\n\n` +
        `Je vous remercie de bien vouloir me mettre en relation avec le déclarant.\n\n` +
        `Cordialement,\n` +
        `${user.name}`
      );

      // Create mailto link with admin email
      const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
      
      // Open default email client
      window.location.href = mailtoLink;

    } catch (error) {
      console.error('Error handling contact:', error);
      showError("Erreur lors de la tentative de contact");
    }
  };

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      setFilteredItems(items);
      return;
    }

    const searchTerm = keyword.toLowerCase();
    const filtered = items.filter(item => 
      item.description.toLowerCase().includes(searchTerm) ||
      item.location.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      item.type.toLowerCase().includes(searchTerm)
    );
    setFilteredItems(filtered);
  };

  const handleApproveOwnership = async (itemId: number) => {
    if (!user) return;
    
    try {
      await itemsApi.update(itemId, { status: 'claimed', claimedByUserId: user.id });
      const response = await itemsApi.getAll();
      setItems(response.data);
      showSuccess("Objet réclamé avec succès");
    } catch (error) {
      showError("Erreur lors de la réclamation de l'objet");
    }
  };

  const handleCancelItem = async (itemId: number) => {
    if (!user) return;

    if (window.confirm('Êtes-vous sûr de vouloir annuler cette déclaration ?')) {
      try {
        await itemsApi.delete(itemId);
        const response = await itemsApi.getAll();
        setItems(response.data);
        showSuccess("Déclaration annulée avec succès");
      } catch (error) {
        showError("Erreur lors de l'annulation");
      }
    }
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Fade in={pageLoaded} timeout={800}>
      <Box>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grow in={pageLoaded} timeout={800}>
            <Box sx={{ 
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    position: 'relative',
                    pb: 2,
                    mb: 2,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    letterSpacing: '-0.5px',
                    backgroundImage: theme => 
                      `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60px',
                      height: '4px',
                      background: theme => 
                        `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      borderRadius: '2px'
                    }
                  }}
                >
                  Objets perdus et trouvés
                </Typography>
                <Typography 
                  color="text.secondary"
                  sx={{
                    fontSize: '1.1rem',
                    maxWidth: '600px',
                    margin: '0 auto',
                    opacity: 0.85,
                    lineHeight: 1.6,
                    mt: 1,
                    fontWeight: 500,
                    letterSpacing: '0.2px',
                    '& span': {
                      color: 'primary.main',
                      fontWeight: 600
                    }
                  }}
                >
                  Parcourez la liste des <span>objets perdus</span> et <span>trouvés</span>
                </Typography>
              </Box>
              {user?.role === 'Admin' && (
                <Tooltip title="Gestion des objets">
                  <Button
                    variant="contained"
                    startIcon={<SettingsIcon />}
                    onClick={() => navigate('/admin/items')}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      background: theme => 
                        `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                      boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                      '&:hover': {
                        background: theme => 
                          `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 15px rgba(0,0,0,0.25)',
                      }
                    }}
                  >
                    Gestion des objets
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Grow>

          <Grow 
            in={pageLoaded} 
            timeout={1000}
            style={{ transitionDelay: '200ms' }}
          >
            <Box sx={{ mb: 4 }}>
              <SearchBar onSearch={handleSearch} />
            </Box>
          </Grow>

          <Grow 
            in={pageLoaded} 
            timeout={1000}
            style={{ transitionDelay: '400ms' }}
          >
            <Grid container spacing={3}>
              {filteredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <StyledCard onClick={() => handleItemClick(item)}>
                    <ImageContainer>
                      <StatusChip
                        label={item.status}
                        sx={{
                          bgcolor: getStatusColor(item.status).bg,
                          color: getStatusColor(item.status).color,
                          '&.MuiChip-root': {
                            fontSize: '0.85rem',
                            height: '28px',
                          }
                        }}
                      />
                      <StyledCardMedia
                        src={item.imageUrl}
                        alt={item.description}
                        className={loadingImages[item.id] ? 'loading' : ''}
                        onLoad={() => {
                          setLoadingImages(prev => ({ ...prev, [item.id]: false }));
                        }}
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          const target = e.target as HTMLImageElement;
                          console.warn(`Failed to load image for ${item.description}, using fallback`);
                          target.src = '/assets/images/placeholder.jpg';
                          setLoadingImages(prev => ({ ...prev, [item.id]: false }));
                        }}
                      />
                    </ImageContainer>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" gutterBottom noWrap>
                          {item.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                          <LocationIcon sx={{ fontSize: 20, mr: 1 }} />
                          <Typography variant="body2" noWrap>
                            {item.location}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mt: 'auto' }}>
                        <ScheduleIcon sx={{ fontSize: 20, mr: 1 }} />
                        <Typography variant="body2">
                          {new Date(item.reportedDate).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Grow>

          {filteredItems.length === 0 && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                mt: 4, 
                p: 4, 
                bgcolor: 'background.paper',
                borderRadius: 2
              }}
            >
              <Typography color="text.secondary">
                Aucun objet trouvé
              </Typography>
            </Box>
          )}

          <Dialog
            open={!!selectedItem}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            {selectedItem && (
              <>
                <DialogTitle sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  pb: 1
                }}>
                  <Typography variant="h6">Détails de l'objet</Typography>
                  <IconButton onClick={handleCloseDialog}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          height: '400px',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={selectedItem.imageUrl || '/assets/images/placeholder.jpg'}
                          alt={selectedItem.description}
                          style={{ 
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            padding: '16px',
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <StatusChip
                          label={selectedItem.status}
                          sx={{
                            bgcolor: getStatusColor(selectedItem.status).bg,
                            color: getStatusColor(selectedItem.status).color,
                          }}
                        />
                      </Box>
                      <Typography variant="h5" gutterBottom>
                        {selectedItem.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                        <LocationIcon sx={{ fontSize: 20, mr: 1 }} />
                        <Typography variant="body1">
                          {selectedItem.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                        <ScheduleIcon sx={{ fontSize: 20, mr: 1 }} />
                        <Typography variant="body1">
                          {new Date(selectedItem.reportedDate).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => selectedItem && handleContact(selectedItem)}
                        startIcon={<EmailIcon />}
                        sx={{ 
                          mt: 2,
                          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0, 86, 179, 0.3)',
                          }
                        }}
                      >
                        Contacter le déclarant
                      </Button>
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                        {user ? 
                          "Cliquez pour envoyer un email au déclarant" :
                          "Connectez-vous pour contacter le déclarant"
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </DialogContent>
              </>
            )}
          </Dialog>
        </Container>

        <Tooltip title="Signaler un objet" placement="left">
          <Fab
            color="primary"
            onClick={() => navigate('/items/new')}
            sx={{
              position: 'fixed',
              bottom: theme.spacing(3),
              right: theme.spacing(3),
              zIndex: theme.zIndex.speedDial,
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>

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
    </Fade>
  );
};

export default ItemsList;