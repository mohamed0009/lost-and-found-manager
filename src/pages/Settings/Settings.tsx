import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  useTheme,
  styled,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../../contexts/ThemeContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
}));

const SettingSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
}));

const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode } = useThemeMode();
  const theme = useTheme();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    language: 'fr',
    privacyMode: false,
    twoFactorAuth: false,
  });

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (name === 'darkMode') {
      toggleDarkMode();
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Add your save logic here
    setShowSnackbar(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: 4,
          textAlign: 'center',
          color: theme.palette.primary.main,
        }}
      >
        Paramètres
      </Typography>

      <Grid container spacing={3}>
        {/* Notifications Section */}
        <Grid item xs={12}>
          <StyledPaper>
            <SettingSection>
              <IconWrapper>
                <NotificationsIcon />
              </IconWrapper>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">Notifications</Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérer vos préférences de notifications
                </Typography>
              </Box>
            </SettingSection>
            <Box sx={{ pl: 7 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleSwitchChange}
                    name="emailNotifications"
                  />
                }
                label="Notifications par email"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={handleSwitchChange}
                    name="pushNotifications"
                  />
                }
                label="Notifications push"
              />
            </Box>
          </StyledPaper>
        </Grid>

        {/* Appearance Section */}
        <Grid item xs={12}>
          <StyledPaper>
            <SettingSection>
              <IconWrapper>
                <PaletteIcon />
              </IconWrapper>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">Apparence</Typography>
                <Typography variant="body2" color="text.secondary">
                  Personnaliser l'interface
                </Typography>
              </Box>
            </SettingSection>
            <Box sx={{ pl: 7 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleSwitchChange}
                    name="darkMode"
                  />
                }
                label="Mode sombre"
              />
            </Box>
          </StyledPaper>
        </Grid>

        {/* Language Section */}
        <Grid item xs={12}>
          <StyledPaper>
            <SettingSection>
              <IconWrapper>
                <LanguageIcon />
              </IconWrapper>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">Langue</Typography>
                <Typography variant="body2" color="text.secondary">
                  Choisir la langue de l'interface
                </Typography>
              </Box>
            </SettingSection>
            <Box sx={{ pl: 7 }}>
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  value={settings.language}
                  onChange={handleSelectChange}
                  name="language"
                >
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="ar">العربية</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Privacy & Security Section */}
        <Grid item xs={12}>
          <StyledPaper>
            <SettingSection>
              <IconWrapper>
                <SecurityIcon />
              </IconWrapper>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">Confidentialité et Sécurité</Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérer vos paramètres de sécurité
                </Typography>
              </Box>
            </SettingSection>
            <Box sx={{ pl: 7 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacyMode}
                    onChange={handleSwitchChange}
                    name="privacyMode"
                  />
                }
                label="Mode privé"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={handleSwitchChange}
                    name="twoFactorAuth"
                  />
                }
                label="Authentification à deux facteurs"
              />
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          }}
        >
          Sauvegarder les modifications
        </Button>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Paramètres mis à jour avec succès
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings; 