import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  useTheme,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Fab,
  Tooltip,
  useMediaQuery,
  styled,
  FormControl,
  Select,
  InputAdornment,
  SelectChangeEvent,
  SelectProps,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Search as SearchIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { mockService, ITEM_STATUS, ITEM_TYPE } from '../../services/mockData';
import { Item } from '../../types';
import ItemDialog from '../../components/Admin/ItemDialog';

// Définir les types plus précisément
type ItemStatus = 'lost' | 'found' | 'claimed' | 'pending' | 'approved' | 'rejected' | 'returned' | 'all';
type ItemType = 'Lost' | 'Found' | 'all';

interface ItemFilters {
  status: ItemStatus;
  type: ItemType;
  search: string;
}

// Mise à jour du MainContainer pour un fond blanc simple
const MainContainer = styled(Box)({
  backgroundColor: '#fff',
  minHeight: '100vh',
  padding: '24px',
});

// Style pour le titre
const Title = styled(Typography)({
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '24px',
  color: '#0056b3', // Couleur bleue pour le titre
});

// Style pour la barre de recherche et filtres
const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: theme.spacing(2),
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
}));

// Style amélioré pour la barre de recherche
const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    height: '40px',
    borderRadius: '4px',
    backgroundColor: '#fff',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#0056b3',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0056b3',
    },
  },
  flex: 1,
});

// Style pour les selects
const StyledSelect = styled(Select)<SelectProps<string>>({
  height: '40px',
  minWidth: '200px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#0056b3',
  },
  '& .MuiSelect-select': {
    paddingTop: '8px',
    paddingBottom: '8px',
  },
});

// Style pour la grille des cartes
const ItemsGrid = styled(Grid)({
  marginTop: '24px',
});

// Style pour les cartes
const StyledCard = styled(Card)({
  height: '100%',
  maxWidth: '100%',
  borderRadius: '12px',
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  backgroundColor: '#ffffff',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },
});

// Style pour le contenu de la carte
const StyledCardContent = styled(CardContent)({
  padding: '16px',
  '&:last-child': {
    paddingBottom: '16px',
  },
});

// Style pour le titre de la carte
const CardTitle = styled(Typography)({
  fontSize: '1rem',
  fontWeight: 600,
  marginBottom: '12px',
  color: '#333',
});

// Style pour les puces (chips)
const StyledChip = styled(Chip)({
  borderRadius: '6px',
  height: '24px',
  fontSize: '0.75rem',
  fontWeight: 600,
  position: 'absolute',
  top: '12px',
  right: '12px',
  zIndex: 1,
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  '& .MuiChip-label': {
    padding: '0 10px',
  },
});

// Style pour les boutons d'action
const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.75rem',
  padding: '6px 12px',
  minWidth: '80px',
  borderRadius: '6px',
  fontWeight: 500,
  '&.MuiButton-containedSuccess': {
    backgroundColor: '#4caf50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#43a047',
    },
  },
  '&.MuiButton-containedError': {
    backgroundColor: '#ef5350',
    color: 'white',
    '&:hover': {
      backgroundColor: '#e53935',
    },
  },
  '&.MuiButton-outlined': {
    borderWidth: '1.5px',
    '&:hover': {
      borderWidth: '1.5px',
    },
  },
  '&.MuiButton-outlinedPrimary': {
    borderColor: '#1976d2',
    color: '#1976d2',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
  },
  '&.MuiButton-outlinedError': {
    borderColor: '#ef5350',
    color: '#ef5350',
    '&:hover': {
      backgroundColor: 'rgba(239, 83, 80, 0.04)',
    },
  },
}));

const ItemManagement = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filters, setFilters] = useState<ItemFilters>({
    status: 'all',
    type: 'all',
    search: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const theme = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const fetchedItems = await mockService.getItems();
      setItems(fetchedItems);
    } catch (error) {
      showError("Erreur lors du chargement des objets");
    }
  };

  // Gestionnaires d'événements typés
  const handleStatusChange = (event: SelectChangeEvent<unknown>) => {
    setFilters({ 
      ...filters, 
      status: event.target.value as ItemStatus 
    });
  };

  const handleTypeChange = (event: SelectChangeEvent<unknown>) => {
    setFilters({ 
      ...filters, 
      type: event.target.value as ItemType 
    });
  };

  const handleItemStatusUpdate = async (itemId: number, newStatus: Exclude<ItemStatus, 'all'>) => {
    try {
      const updatedItem = await mockService.updateItemStatus(itemId, newStatus);
      setItems(items.map(item => 
        item.id === itemId ? updatedItem : item
      ));
      showSuccess(`Statut mis à jour avec succès`);
    } catch (error) {
      showError("Erreur lors de la mise à jour du statut");
    }
  };

  const handleApprove = async (itemId: number) => {
    await handleItemStatusUpdate(itemId, ITEM_STATUS.APPROVED as Exclude<ItemStatus, 'all'>);
  };

  const handleReject = async (itemId: number) => {
    await handleItemStatusUpdate(itemId, ITEM_STATUS.REJECTED as Exclude<ItemStatus, 'all'>);
  };

  const handleDelete = async (itemId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) {
      try {
        await mockService.deleteItem(itemId);
        setItems(items.filter(item => item.id !== itemId));
        showSuccess("Objet supprimé avec succès");
      } catch (error) {
        showError("Erreur lors de la suppression");
      }
    }
  };

  const getStatusColor = (status: Exclude<ItemStatus, 'all'>) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      case 'found': return 'success';
      case 'claimed': return 'info';
      default: return 'default';
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                         item.location.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    const matchesType = filters.type === 'all' || item.type === filters.type;
    return matchesSearch && matchesStatus && matchesType;
  });

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

  const handleCreateItem = async (itemData: Partial<Item>) => {
    try {
      await mockService.createItem(itemData as Omit<Item, "id">);
      loadItems();
      setEditDialogOpen(false);
      showSuccess("Objet ajouté avec succès");
    } catch (error) {
      showError("Erreur lors de la création de l'objet");
    }
  };

  const handleUpdateItem = async (itemData: Partial<Item>) => {
    if (!selectedItem) return;
    try {
      await mockService.updateItem(selectedItem.id, itemData);
      loadItems();
      setEditDialogOpen(false);
      showSuccess("Objet mis à jour avec succès");
    } catch (error) {
      showError("Erreur lors de la mise à jour de l'objet");
    }
  };

  return (
    <MainContainer>
      <Title>Gestion des Objets</Title>
      
      <FiltersContainer>
        <SearchField
          placeholder="Rechercher..."
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        
        <FormControl>
          <StyledSelect
            value={filters.status}
            onChange={handleStatusChange}
            displayEmpty
            renderValue={(value: unknown) => (value === 'all' ? 'Tous les statuts' : String(value))}
          >
            <MenuItem value="all">Tous les statuts</MenuItem>
            <MenuItem value="lost">Perdus</MenuItem>
            <MenuItem value="found">Trouvés</MenuItem>
            <MenuItem value="claimed">Réclamés</MenuItem>
            <MenuItem value="pending">En attente</MenuItem>
          </StyledSelect>
        </FormControl>

        <FormControl>
          <StyledSelect
            value={filters.type}
            onChange={handleTypeChange}
            displayEmpty
            renderValue={(value: unknown) => (value === 'all' ? 'Tous les types' : String(value))}
          >
            <MenuItem value="all">Tous les types</MenuItem>
            <MenuItem value="Lost">Perdu</MenuItem>
            <MenuItem value="Found">Trouvé</MenuItem>
          </StyledSelect>
        </FormControl>
      </FiltersContainer>

      <ItemsGrid container spacing={2}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <StyledCard>
              <Box sx={{ position: 'relative' }}>
                <StyledChip
                  label={item.status.toUpperCase()}
                  size="small"
                  color={getStatusColor(item.status as Exclude<ItemStatus, 'all'>)}
                  sx={{
                    backgroundColor: item.type === 'Lost' ? '#ef5350' : '#4caf50',
                    color: 'white',
                  }}
                />
                {item.imageUrl && (
                  <CardMedia
                    component="img"
                    height="220"
                    image={item.imageUrl}
                    alt={item.description}
                    sx={{ 
                      objectFit: 'contain',
                      backgroundColor: '#f8f9fa',
                      padding: '20px',
                    }}
                  />
                )}
              </Box>
              <StyledCardContent>
                <CardTitle noWrap>
                  {item.description}
                </CardTitle>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {item.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(item.reportedDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  gap: 1,
                  borderTop: '1px solid #eee',
                  paddingTop: '12px',
                }}>
                  {item.status === ITEM_STATUS.PENDING && (
                    <>
                      <ActionButton
                        variant="contained"
                        color="success"
                        onClick={() => handleApprove(item.id)}
                        sx={{ boxShadow: 'none' }}
                      >
                        Approuver
                      </ActionButton>
                      <ActionButton
                        variant="contained"
                        color="error"
                        onClick={() => handleReject(item.id)}
                        sx={{ boxShadow: 'none' }}
                      >
                        Rejeter
                      </ActionButton>
                    </>
                  )}
                  <ActionButton
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setSelectedItem(item);
                      setEditDialogOpen(true);
                    }}
                  >
                    Modifier
                  </ActionButton>
                  <ActionButton
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Supprimer
                  </ActionButton>
                </Box>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </ItemsGrid>

      <ItemDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedItem(null);
        }}
        onSave={selectedItem ? handleUpdateItem : handleCreateItem}
        item={selectedItem}
        title={selectedItem ? "Modifier l'objet" : "Ajouter un objet"}
      />

      <Tooltip title="Signaler un objet" placement="left">
        <Fab
          color="primary"
          onClick={() => setEditDialogOpen(true)}
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
    </MainContainer>
  );
};

export default ItemManagement; 