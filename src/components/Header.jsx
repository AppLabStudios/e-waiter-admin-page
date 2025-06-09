import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Header = ({ currentView, onChangeView }) => (
  <AppBar position="fixed" color="primary" elevation={2} sx={{ zIndex: 1201 }}>
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
        E-Waiter Admin Dashboard
      </Typography>
      <Box>
        <Button
          color={currentView === 'create' ? 'secondary' : 'inherit'}
          variant={currentView === 'create' ? 'contained' : 'text'}
          sx={{ mr: 2, fontWeight: 600 }}
          onClick={() => onChangeView('create')}
        >
          Create Account
        </Button>
        <Button
          color={currentView === 'view' ? 'secondary' : 'inherit'}
          variant={currentView === 'view' ? 'contained' : 'text'}
          sx={{ fontWeight: 600 }}
          onClick={() => onChangeView('view')}
        >
          View Accounts
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header; 