import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { frFR } from '@mui/material/locale';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#2196f3' : '#0056b3',
        light: darkMode ? '#4dabf5' : '#3378c1',
        dark: darkMode ? '#1976d2' : '#003d80',
      },
      secondary: {
        main: darkMode ? '#66bb6a' : '#28a745',
        light: darkMode ? '#81c784' : '#48c767',
        dark: darkMode ? '#388e3c' : '#1b8b33',
      },
      background: {
        default: darkMode ? '#0a0a0a' : '#f5f5f5',
        paper: darkMode ? '#1a1a1a' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#f8f9fa' : '#000000',
        secondary: darkMode ? '#dee2e6' : 'rgba(0, 0, 0, 0.6)',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: darkMode ? '#0a0a0a' : '#f5f5f5',
            scrollbarColor: darkMode ? '#2f2f2f #121212' : '#c1c1c1 #f5f5f5',
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            backgroundImage: 'none',
            borderRadius: '12px',
            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
            boxShadow: darkMode 
              ? '0 4px 20px rgba(0, 0, 0, 0.35)'
              : '0 4px 20px rgba(0, 0, 0, 0.05)',
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
            transition: 'all 0.3s ease',
            '& .MuiTypography-root': {
              color: '#000000',
            },
            '& .MuiTypography-h6': {
              color: '#000000',
              fontWeight: 600,
            },
            '& .MuiTypography-subtitle1': {
              color: 'rgba(0, 0, 0, 0.87)',
            },
            '& .MuiTypography-body1': {
              color: 'rgba(0, 0, 0, 0.87)',
            },
            '& .MuiTypography-body2': {
              color: 'rgba(0, 0, 0, 0.6)',
            },
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode 
                ? '0 6px 24px rgba(0, 0, 0, 0.45)'
                : '0 6px 24px rgba(0, 0, 0, 0.1)',
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
          },
          containedPrimary: {
            background: darkMode 
              ? 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)'
              : 'linear-gradient(45deg, #0056b3 30%, #0076f3 90%)',
            boxShadow: darkMode 
              ? '0 3px 12px rgba(33, 150, 243, 0.3)'
              : '0 3px 12px rgba(0, 86, 179, 0.2)',
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: darkMode 
              ? 'linear-gradient(90deg, #1565c0 0%, #2196f3 100%)'
              : 'linear-gradient(90deg, #0056b3 0%, #003d80 100%)',
            borderBottom: 'none',
            boxShadow: darkMode 
              ? '0 4px 20px rgba(25, 118, 210, 0.3)'
              : 'none',
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: darkMode ? '#ffffff' : '#000000',
          },
          h1: {
            color: darkMode ? '#ffffff' : '#000000',
            fontWeight: 600,
          },
          h2: {
            color: darkMode ? '#ffffff' : '#000000',
            fontWeight: 600,
          },
          h3: {
            color: darkMode ? '#ffffff' : '#000000',
            fontWeight: 600,
          },
          h4: {
            color: darkMode ? '#ffffff' : '#000000',
            fontWeight: 600,
          },
          h5: {
            color: darkMode ? '#ffffff' : '#000000',
            fontWeight: 600,
          },
          h6: {
            color: darkMode ? '#ffffff' : '#000000',
            fontWeight: 600,
          },
          subtitle1: {
            color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
          },
          subtitle2: {
            color: darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.6)',
          },
          body1: {
            color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
          },
          body2: {
            color: darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.6)',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)',
            }
          }
        }
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            '& .MuiTypography-root': {
              color: '#000000',
            },
            '& .MuiTypography-body1': {
              color: 'rgba(0, 0, 0, 0.87)',
            },
            '& .MuiTypography-body2': {
              color: 'rgba(0, 0, 0, 0.6)',
            },
            '& .MuiTypography-caption': {
              color: 'rgba(0, 0, 0, 0.6)',
            }
          }
        }
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            '& .MuiTypography-root': {
              color: '#000000',
            },
            '& .activity-title': {
              color: '#000000',
              fontWeight: 600,
            }
          }
        }
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            background: 'transparent',
            '& .MuiTypography-root': {
              color: '#ffffff',
              textShadow: darkMode ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none',
            },
            '& .MuiIconButton-root': {
              color: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              }
            },
            '& .MuiButton-root': {
              color: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateY(-1px)',
              },
              '&[data-active="true"]': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                fontWeight: 600,
              }
            }
          }
        }
      }
    }
  }, frFR);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
}; 