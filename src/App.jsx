import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import SignUp from './components/SignUp';
import Header from './components/Header';
import RestaurantList from './components/RestaurantList';
import Footer from './components/Footer';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [view, setView] = useState('create');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header currentView={view} onChangeView={setView} />
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        pt: '72px', // header height
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
        <Box sx={{ flex: 1, width: '100%' }}>
          {view === 'create' ? <SignUp /> : <RestaurantList />}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
