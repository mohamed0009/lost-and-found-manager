import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  styled
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#0d47a1' : '#0056b3',
  padding: theme.spacing(6, 0),
  color: '#ffffff',
  '& .MuiTypography-root': {
    color: '#ffffff',
  },
  '& .MuiLink-root': {
    color: '#ffffff',
    opacity: 0.9,
    '&:hover': {
      opacity: 1,
      textDecoration: 'underline',
    }
  },
  '& .footer-title': {
    color: '#ffffff',
    fontWeight: 600,
  },
  '& .footer-text': {
    color: '#ffffff',
  },
  '& .footer-contact': {
    color: '#ffffff',
  },
  '& .footer-social a': {
    color: '#ffffff',
    '&:hover': {
      opacity: 0.8,
    }
  },
  '& .footer-copyright': {
    color: '#ffffff',
    opacity: 0.9,
  }
}));

const FooterSection = styled(Box)({
  position: 'relative',
  zIndex: 1,
});

const SocialButton = styled(Link)(({ theme }) => ({
  color: '#fff',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  marginRight: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <FooterSection>
          <Grid container spacing={4}>
            {/* About Section */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                EMSI Lost & Found
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                Plateforme de gestion des objets perdus et trouvés à l'EMSI. 
                Nous aidons les étudiants à retrouver leurs objets perdus.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <SocialButton 
                  href="https://facebook.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon />
                </SocialButton>
                <SocialButton 
                  href="https://twitter.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterIcon />
                </SocialButton>
                <SocialButton 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon />
                </SocialButton>
                <SocialButton 
                  href="https://linkedin.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon />
                </SocialButton>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Liens Rapides
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link
                  component={RouterLink}
                  to="/dashboard"
                  color="inherit"
                  sx={{ opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}
                >
                  Dashboard
                </Link>
                <Link
                  component={RouterLink}
                  to="/items"
                  color="inherit"
                  sx={{ opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}
                >
                  Objets
                </Link>
                <Link
                  component={RouterLink}
                  to="/items/new"
                  color="inherit"
                  sx={{ opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}
                >
                  Signaler un objet
                </Link>
                <Link
                  component={RouterLink}
                  to="/about"
                  color="inherit"
                  sx={{ opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}
                >
                  À propos
                </Link>
              </Box>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Contact
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon sx={{ opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    123 Rue EMSI, Maroc
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    contact@emsi-lost.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +212 5XX-XXXXXX
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Copyright */}
          <Box sx={{ textAlign: 'center', opacity: 0.8 }}>
            <Typography variant="body2">
              © {currentYear} EMSI Lost & Found. Tous droits réservés.
            </Typography>
          </Box>
        </FooterSection>
      </Container>
    </StyledFooter>
  );
};

export default Footer; 