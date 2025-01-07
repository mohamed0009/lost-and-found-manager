import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0056b3",
      light: "#3378c1",
      dark: "#003d80",
    },
    secondary: {
      main: "#F44336",
      light: "#f6685e",
      dark: "#aa2e25",
    },
    warning: {
      main: "#FFEB3B",
      light: "#fff176",
      dark: "#b2a429",
    },
    success: {
      main: "#4CAF50",
      light: "#81c784",
      dark: "#357a38",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          transition: "all 0.2s ease",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
        },
      },
    },
  },
});

export default theme;
