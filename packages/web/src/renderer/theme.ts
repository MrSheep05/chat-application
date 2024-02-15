import { createTheme } from '@mui/material';

export const theme = createTheme({
  spacing: 12,
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          ':hover': {
            textDecoration: 'underline',
            cursor: 'pointer',
          },
        },
      },
    },
  },
  typography: {
    messageDate: {
      color: '#828A92',
      fontSize: 12,
    },
  },
});
