import { useState } from 'react';
import { Box, Typography, IconButton, Tabs, Tab, Paper, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DevicesIcon from '@mui/icons-material/Devices';
import SettingsIcon from '@mui/icons-material/Settings';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DeviceList from './DeviceList';
import MenuList from './MenuList';
import Settings from './Settings';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`restaurant-tabpanel-${index}`}
      aria-labelledby={`restaurant-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `restaurant-tab-${index}`,
    'aria-controls': `restaurant-tabpanel-${index}`,
  };
}

const RestaurantDetails = ({ restaurant, onBack }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 1200, 
      mx: 'auto', 
      minHeight: 'calc(100vh - 72px - 56px)',
      p: { xs: 2, md: 3 }
    }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            p: 3,
            color: 'white',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
          }}>
            <IconButton 
              onClick={onBack}
              sx={{ 
                mr: 3, 
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                {restaurant.restaurantName}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Restaurant Management
              </Typography>
            </Box>
          </Box>
        </Box>

        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Tabs 
                    value={tabIndex} 
                    onChange={handleTabChange} 
                    aria-label="restaurant details tabs"
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab icon={<DevicesIcon />} iconPosition="start" label="Devices" {...a11yProps(0)} />
                    <Tab icon={<RestaurantMenuIcon />} iconPosition="start" label="Menu" {...a11yProps(1)} />
                    <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                <DeviceList restaurantId={restaurant.id} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <MenuList restaurantId={restaurant.id} />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <Settings restaurant={restaurant} />
            </TabPanel>
        </Paper>
    </Box>
  );
};

export default RestaurantDetails; 