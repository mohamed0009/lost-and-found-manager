import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Tooltip,
  Badge,
  InputBase,
  alpha,
  useTheme,
  styled
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationsContext';

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'component'
})(({ theme }) => ({
  color: 'white',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  transition: 'all 0.2s ease',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: <DashboardIcon />, text: 'Dashboard', path: '/dashboard' },
    { icon: <InventoryIcon />, text: 'Objets', path: '/items' },
  ];

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'primary.main',
        borderRadius: '0 0 16px 16px',
        '& .MuiToolbar-root': {
          borderRadius: '0 0 16px 16px'
        },
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            EMSI Lost & Found
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                color="inherit"
                sx={{
                  backgroundColor: location.pathname === item.path ? 
                    alpha(theme.palette.common.white, 0.15) : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.25),
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user?.role === 'Admin' && (
              <Button
                color="inherit"
                component={Link}
                to="/admin/users"
                startIcon={<AdminIcon />}
              >
                Administration
              </Button>
            )}
            
            <Tooltip title="Notifications">
              <IconButton color="inherit" component={Link} to="/notifications">
                <StyledBadge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </StyledBadge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile">
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ p: 0, ml: 2 }}
              >
                <Avatar 
                  alt={user?.name}
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: `2px solid ${alpha(theme.palette.common.white, 0.5)}` 
                  }}
                />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: { mt: 1.5 }
              }}
            >
              <MenuItem component={Link} to="/profile" onClick={() => setAnchorEl(null)}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>

              <MenuItem component={Link} to="/settings" onClick={() => setAnchorEl(null)}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Paramètres
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 