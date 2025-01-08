import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  styled,
  useTheme,
  Paper,
  IconButton,
  Fade,
  Grow,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockItems } from '../../services/mockData';

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, #0056b3 0%, #007bff 100%)',
  color: 'white',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const ItemCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 14px rgba(0, 86, 179, 0.2)',
}));

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);
  const recentLostItems = mockItems
    .filter(item => item.type === 'Lost')
    .slice(0, 3);

  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
    }, 300);
  }, []);

  return (
    <Fade in={pageLoaded} timeout={800}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Grow in={pageLoaded} timeout={800}>
          <Box sx={{ mb: 4 }}>
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
                  left: 0,
                  width: '60px',
                  height: '4px',
                  background: theme => 
                    `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  borderRadius: '2px'
                }
              }}
            >
              Tableau de bord
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{
                fontSize: '1.1rem',
                maxWidth: '600px',
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
              Gérez vos <span>objets perdus</span> et <span>trouvés</span>
            </Typography>
          </Box>
        </Grow>

        {/* Stats Section */}
        <Grow 
          in={pageLoaded} 
          timeout={1000}
          style={{ transitionDelay: '200ms' }}
        >
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={4}>
              <StatsCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SearchIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h4">+2</Typography>
                  </Box>
                  <Typography variant="h6">cette semaine</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Objets trouvés
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>

            <Grid item xs={12} sm={4}>
              <StatsCard sx={{ background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SearchIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h4">+3</Typography>
                  </Box>
                  <Typography variant="h6">cette semaine</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Objets perdus
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>

            <Grid item xs={12} sm={4}>
              <StatsCard sx={{ background: 'linear-gradient(135deg, #ED6C02 0%, #FF9800 100%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h4">4</Typography>
                  </Box>
                  <Typography variant="h6">en attente</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    En Attente
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
          </Grid>
        </Grow>

        {/* Action Button */}
        <Grow 
          in={pageLoaded} 
          timeout={1000}
          style={{ transitionDelay: '400ms' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <ActionButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/items/new')}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              }}
            >
              Signaler un objet
            </ActionButton>
          </Box>
        </Grow>

        {/* Recent Lost Items Section */}
        <Grow 
          in={pageLoaded} 
          timeout={1000}
          style={{ transitionDelay: '600ms' }}
        >
          <Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Derniers objets perdus
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {recentLostItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <ItemCard onClick={() => navigate(`/items/${item.id}`)}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.imageUrl}
                      alt={item.description}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom noWrap>
                        {item.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                        <LocationIcon sx={{ fontSize: 20, mr: 1 }} />
                        <Typography variant="body2" noWrap>
                          {item.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <AccessTimeIcon sx={{ fontSize: 20, mr: 1 }} />
                        <Typography variant="body2">
                          {new Date(item.reportedDate).toLocaleDateString('fr-FR')}
                        </Typography>
                      </Box>
                    </CardContent>
                  </ItemCard>
                </Grid>
              ))}
            </Grid>

            {/* View All Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/items')}
                sx={{ borderRadius: 2 }}
              >
                Voir tous les objets
              </Button>
            </Box>
          </Box>
        </Grow>
      </Container>
    </Fade>
  );
};

export default Dashboard; 