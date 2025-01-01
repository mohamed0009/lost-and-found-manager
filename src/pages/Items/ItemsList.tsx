import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia as MuiCardMedia,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  styled,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Fab,
  Tooltip,
  useMediaQuery,
  Snackbar
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
import { Item } from '../../types';
import { mockService, mockUsers } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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

const ItemsList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await mockService.getItems();
        setItems(fetchedItems);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des objets');
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lost':
        return {
          bg: theme.palette.error.main,
          color: theme.palette.error.contrastText
        };
      case 'Found':
        return {
          bg: theme.palette.success.main,
          color: theme.palette.success.contrastText
        };
      case 'Claimed':
        return {
          bg: theme.palette.info.main,
          color: theme.palette.info.contrastText
        };
      default:
        return {
          bg: theme.palette.grey[500],
          color: theme.palette.getContrastText(theme.palette.grey[500])
        };
    }
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
  };

  const getReporterInfo = (reportedByUserId: number) => {
    return mockUsers.find(u => u.id === reportedByUserId);
  };

  const handleContact = (item: Item) => {
    const reporter = getReporterInfo(item.reportedByUserId);
    if (!reporter) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    window.location.href = `mailto:${reporter.email}?subject=À propos de l'objet: ${item.description}`;
  };

  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await mockService.searchItems(keyword);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };

  const handleApproveOwnership = async (itemId: number) => {
    if (!user) return;
    
    try {
      await mockService.approveItemOwnership(itemId, user.id);
      // Rafraîchir la liste des items
      const updatedItems = await mockService.getItems();
      setItems(updatedItems);
      showSuccess("Objet réclamé avec succès");
    } catch (error) {
      showError("Erreur lors de la réclamation de l'objet");
    }
  };

  const handleCancelItem = async (itemId: number) => {
    if (!user) return;

    if (window.confirm('Êtes-vous sûr de vouloir annuler cette déclaration ?')) {
      try {
        await mockService.cancelItem(itemId, user.id);
        // Rafraîchir la liste des items
        const updatedItems = await mockService.getItems();
        setItems(updatedItems);
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
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <SearchBar onSearch={handleSearch} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Liste des objets
          </Typography>
          
          {user?.role === 'Admin' && (
            <Tooltip title="Gestion des objets">
              <Button
                variant="contained"
                color="primary"
                startIcon={<SettingsIcon />}
                onClick={() => navigate('/admin/items')}
                sx={{
                  background: theme => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  '&:hover': {
                    background: theme => `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                  }
                }}
              >
                Gestion des objets
              </Button>
            </Tooltip>
          )}
        </Box>

        <Grid container spacing={3}>
          {(isSearching ? searchResults : items).map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <StyledCard onClick={() => handleItemClick(item)}>
                <ImageContainer>
                  <StatusChip
                    label={item.status}
                    sx={{
                      bgcolor: getStatusColor(item.status).bg,
                      color: getStatusColor(item.status).color,
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
  );
};

export default ItemsList;