import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      width: '100%',
      py: 2,
      px: 2,
      background: '#1976d2',
      color: 'white',
      textAlign: 'center',
      mt: 6,
      boxShadow: '0 -2px 8px rgba(25, 118, 210, 0.08)',
      minHeight: 56,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Typography variant="body2">
      E-Waiter Admin Dashboard &copy; {new Date().getFullYear()} | All rights reserved.
    </Typography>
    <Typography variant="caption" sx={{ opacity: 0.8 }}>
      Powered by Applab Studios
    </Typography>
  </Box>
);

export default Footer; 