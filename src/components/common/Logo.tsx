import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Search } from '@mui/icons-material';

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(1),
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.primary.main,
  borderRadius: '12px',
  padding: theme.spacing(1),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  },
}));

const SearchIcon = styled(Search)({
  fontSize: 32,
  color: '#fff',
});

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  letterSpacing: '-0.5px',
  '& span': {
    color: theme.palette.primary.main,
    fontWeight: 800,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

const Logo = () => {
  return (
    <LogoWrapper>
      <LogoIcon>
        <SearchIcon />
      </LogoIcon>
      <LogoText variant="h4">
        <span>EMSI</span> Lost & Found
      </LogoText>
    </LogoWrapper>
  );
};

export default Logo; 