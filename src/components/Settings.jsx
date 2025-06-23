import { Box, Typography, Paper, Alert } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const Settings = ({ restaurant }) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'background.default'
      }}
    >
      <SettingsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
      <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
        Restaurant Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
        This section will contain all the settings for {restaurant.restaurantName}, such as business hours, contact information, and payment options.
      </Typography>
      <Alert severity="info" sx={{ width: '100%', maxWidth: 'sm' }}>
        Settings functionality is coming soon!
      </Alert>
    </Paper>
  );
};

export default Settings; 