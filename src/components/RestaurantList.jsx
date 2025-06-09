import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Box, Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Avatar, CircularProgress, Alert, Divider } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'Restaurants'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRestaurants(data);
      } catch (err) {
        setError('Failed to fetch restaurants.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (restaurants.length === 0) return <Alert severity="info" sx={{ mt: 4 }}>No restaurants found.</Alert>;

  return (
    <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', minHeight: 'calc(100vh - 72px - 56px)' }}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: 2, minHeight: '100%' }}>
        <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 2, textAlign: 'center' }}>
          Registered Restaurants
        </Typography>
        <List>
          {restaurants.map((r, idx) => (
            <>
              <ListItem
                key={r.id}
                alignItems="flex-start"
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
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <RestaurantIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" fontWeight={600} color="primary">
                      {r.restaurantName}
                    </Typography>
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
                        <strong>Status:</strong> {r.status || 'N/A'}
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
              </ListItem>
              {idx < restaurants.length - 1 && <Divider variant="inset" component="li" />}
            </>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default RestaurantList; 