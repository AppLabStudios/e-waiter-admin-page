import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Header = ({ currentView, onChangeView }) => {
  const handleViewChange = (newView) => {
    // If we're in devices view and user clicks "View Accounts", 
    // we need to go back to the restaurant list
    if (currentView === 'devices' && newView === 'view') {
      onChangeView('view');
    } else {
      onChangeView(newView);
    }
  };

  return (
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
            onClick={() => handleViewChange('create')}
          >
            Create Account
          </Button>
          <Button
            color={currentView === 'view' || currentView === 'details' ? 'secondary' : 'inherit'}
            variant={currentView === 'view' || currentView === 'details' ? 'contained' : 'text'}
            sx={{ fontWeight: 600 }}
            onClick={() => handleViewChange('view')}
          >
            View Accounts
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 