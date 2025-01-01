import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Liste des chemins où nous ne voulons pas afficher le navbar et le footer
  const noNavbarFooterPaths = ['/login', '/register', '/forgot-password'];
  const shouldShowNavbarFooter = !noNavbarFooterPaths.includes(location.pathname);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {shouldShowNavbarFooter && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      {shouldShowNavbarFooter && <Footer />}
    </Box>
  );
};

export default Layout; 