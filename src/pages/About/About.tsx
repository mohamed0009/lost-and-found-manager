import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  styled,
  Divider
} from '@mui/material';
import {
  School as SchoolIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  EmojiObjects as IdeaIcon
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  '& svg': {
    fontSize: '40px',
    color: '#ffffff',
  }
}));

const features = [
  {
    icon: <SchoolIcon />,
    title: "Service Étudiant",
    description: "Une plateforme dédiée aux étudiants de l'EMSI pour retrouver leurs objets perdus."
  },
  {
    icon: <SecurityIcon />,
    title: "Sécurisé",
    description: "Système sécurisé pour la déclaration et la récupération des objets perdus."
  },
  {
    icon: <SpeedIcon />,
    title: "Efficace",
    description: "Processus rapide et simple pour signaler ou retrouver un objet perdu."
  },
  {
    icon: <IdeaIcon />,
    title: "Innovant",
    description: "Solution moderne utilisant les dernières technologies pour une meilleure expérience."
  }
];

const About: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          À Propos de EMSI Lost & Found
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          Une solution innovante pour aider les étudiants de l'EMSI à retrouver leurs objets perdus
          et à signaler les objets trouvés sur le campus.
        </Typography>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledCard>
              <IconWrapper>
                {feature.icon}
              </IconWrapper>
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Mission Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Notre Mission
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Objectifs
                </Typography>
                <Typography paragraph>
                  Faciliter la récupération des objets perdus au sein de l'EMSI en offrant une
                  plateforme centralisée et efficace.
                </Typography>
                <Typography paragraph>
                  Réduire le stress et les désagréments causés par la perte d'objets personnels
                  en proposant une solution rapide et fiable.
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Engagement
                </Typography>
                <Typography paragraph>
                  Assurer un service de qualité et une expérience utilisateur optimale pour tous
                  les étudiants de l'EMSI.
                </Typography>
                <Typography paragraph>
                  Maintenir un système sécurisé et transparent pour la gestion des objets perdus
                  et trouvés.
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'background.paper', borderRadius: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" color="primary" gutterBottom>
              500+
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Objets Retrouvés
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" color="primary" gutterBottom>
              1000+
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Utilisateurs Actifs
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" color="primary" gutterBottom>
              95%
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Taux de Satisfaction
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default About; 