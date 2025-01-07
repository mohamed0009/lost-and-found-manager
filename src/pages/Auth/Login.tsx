import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Container,
  useTheme,
  styled,
  alpha,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';

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
  '&:before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 50% 50%, 
      rgba(255, 255, 255, 0.1) 0%, 
      rgba(255, 255, 255, 0.05) 50%, 
      transparent 100%)`,
    opacity: 0.4,
    zIndex: 0,
  },
  '&:after': {
    content: '""',
    position: 'fixed',
    top: '-50%',
    left: '-50%',
    right: '-50%',
    bottom: '-50%',
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'pulse 15s infinite',
    zIndex: 0,
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.5)' },
    '100%': { transform: 'scale(1)' },
  }
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
  backdropFilter: 'blur(10px)',
}));

const ImageSection = styled(Box)(({ theme }) => ({
  flex: 1,
  background: 'linear-gradient(135deg, #6B46C1 0%, #483285 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(/assets/images/auth-bg.jpg)',
    backgroundSize: 'cover',
    opacity: 0.2,
  }
}));

const FormSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.03),
    borderRadius: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.common.black, 0.05),
    }
  }
}));

const SocialButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.03),
  }
}));

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledBox>
      <StyledPaper elevation={24}>
        <Box sx={{ textAlign: 'center' }}>
          <Logo />
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Connexion
          </Typography>
          <Typography color="text.secondary">
            Connectez-vous à votre compte
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <StyledTextField
            fullWidth
            label="Email"
            margin="normal"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <StyledTextField
            fullWidth
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
            <FormControlLabel
              control={<Checkbox />}
              label="Se souvenir de moi"
            />
            <Link to="/forgot-password" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
              Mot de passe oublié ?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              mb: 3,
              height: 48,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            Se connecter
          </Button>

          <Box sx={{ textAlign: 'center', my: 3 }}>
            <Typography color="text.secondary" sx={{ position: 'relative', '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              width: '20%',
              height: '1px',
              backgroundColor: theme.palette.divider,
            }, '&::before': { left: '15%' }, '&::after': { right: '15%' } }}>
              Ou continuer avec
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <SocialButton fullWidth startIcon={<GoogleIcon />}>
              Google
            </SocialButton>
            <SocialButton fullWidth startIcon={<GitHubIcon />}>
              GitHub
            </SocialButton>
          </Box>

          <Typography align="center" sx={{ mt: 3 }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 500 }}>
              S'inscrire
            </Link>
          </Typography>
        </form>
      </StyledPaper>
    </StyledBox>
  );
};

export default Login;