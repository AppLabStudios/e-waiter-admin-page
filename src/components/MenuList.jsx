import { Box, Typography, Paper, Alert } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const MenuList = ({ restaurantId }) => {
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
      <RestaurantMenuIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
      <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
        Menu Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
        This section will display all the menu items for this restaurant. You'll be able to add, edit, and manage categories and items here.
      </Typography>
      <Alert severity="info" sx={{ width: '100%', maxWidth: 'sm' }}>
        Menu functionality is coming soon! Restaurant ID: {restaurantId}
      </Alert>
    </Paper>
  );
};

export default MenuList; 