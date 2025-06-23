import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Avatar, 
  CircularProgress, 
  Alert, 
  Divider,
  TextField,
  FormControlLabel,
  Switch,
  InputAdornment,
  ListItemButton,
  Chip
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SearchIcon from '@mui/icons-material/Search';
import DevicesIcon from '@mui/icons-material/Devices';

const RestaurantList = ({ onRestaurantClick }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchByID, setSearchByID] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'Restaurants'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (err) {
        setError('Failed to fetch restaurants.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRestaurants(restaurants);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = restaurants.filter(restaurant => {
      if (searchByID) {
        return restaurant.id.toLowerCase().includes(query) || 
               (restaurant.userId && restaurant.userId.toLowerCase().includes(query));
      } else {
        return restaurant.restaurantName.toLowerCase().includes(query);
      }
    });
    setFilteredRestaurants(filtered);
  }, [searchQuery, searchByID, restaurants]);

  const handleRestaurantClick = (restaurant) => {
    if (onRestaurantClick) {
      onRestaurantClick(restaurant);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

  return (
    <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', minHeight: 'calc(100vh - 72px - 56px)' }}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 2, minHeight: '100%' }}>
        <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 2, textAlign: 'center' }}>
          Registered Restaurants
        </Typography>

        {/* Search Bar and Toggle Switch */}
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={searchByID ? "Search by Restaurant ID..." : "Search by Restaurant Name..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#fff',
              }
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={searchByID}
                onChange={(e) => setSearchByID(e.target.checked)}
                color="primary"
              />
            }
            label={searchByID ? "Searching by ID" : "Searching by Name"}
            sx={{ alignSelf: 'flex-end' }}
          />
        </Box>

        {filteredRestaurants.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            {searchQuery ? 'No restaurants found matching your search.' : 'No restaurants found.'}
          </Alert>
        ) : (
          <List>
            {filteredRestaurants.map((r, idx) => (
              <>
                <ListItem
                  key={r.id}
                  alignItems="flex-start"
                  disablePadding
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    boxShadow: 1,
                    background: '#f8f9fa',
                    transition: 'box-shadow 0.2s, background 0.2s',
                    '&:hover': {
                      boxShadow: 4,
                      background: '#fff',
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleRestaurantClick(r)}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <RestaurantIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6" fontWeight={600} color="primary">
                            {r.restaurantName}
                          </Typography>
                          <Chip
                            icon={<DevicesIcon />}
                            label="View Devices"
                            color="secondary"
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Email:</strong> {r.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>City:</strong> {r.city}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Status:</strong> {r.status === true ? 'Active' : 'Inactive'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>User ID:</strong> {r.userId || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            <strong>Created:</strong> {r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A'}
                          </Typography>
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {idx < filteredRestaurants.length - 1 && <Divider variant="inset" component="li" />}
              </>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default RestaurantList; 