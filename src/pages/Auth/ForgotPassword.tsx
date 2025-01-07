import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  useTheme,
  styled,
  alpha,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const StyledBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.dark} 0%, 
    ${theme.palette.primary.main} 50%,
    ${theme.palette.primary.light} 100%)`,
  padding: theme.spacing(3),
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'auto',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 480,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.common.white, 0.05) 
      : alpha(theme.palette.common.black, 0.03),
    borderRadius: theme.spacing(1),
  }
}));

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess('Instructions de réinitialisation envoyées à votre email.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledBox>
      <StyledPaper elevation={24}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Mot de passe oublié ?
          </Typography>
          <Typography color="text.secondary">
            Entrez votre email pour réinitialiser votre mot de passe
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <StyledTextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{
              mt: 3,
              mb: 2,
              height: 48,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
          </Button>

          <Button
            component={Link}
            to="/login"
            fullWidth
            startIcon={<ArrowBackIcon />}
            sx={{
              mt: 1,
              textTransform: 'none',
              color: theme.palette.text.secondary,
            }}
          >
            Retour à la connexion
          </Button>
        </form>
      </StyledPaper>
    </StyledBox>
  );
};

export default ForgotPassword; 