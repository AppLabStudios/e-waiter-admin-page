import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress, 
  Alert, 
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GroupIcon from '@mui/icons-material/Group';

const DeviceList = ({ restaurantId }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [editForm, setEditForm] = useState({
    deviceRole: '',
    tableNumber: '',
    activated: false
  });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Device role options
  const deviceRoleOptions = [
    { value: 'Table', label: 'Table', icon: <TableRestaurantIcon /> },
    { value: 'Owner', label: 'Owner', icon: <RestaurantIcon /> },
    { value: 'Staff', label: 'Staff', icon: <GroupIcon /> }
  ];

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const devicesRef = collection(db, 'Restaurants', restaurantId, 'Devices');
        const q = query(devicesRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDevices(data);
      } catch (err) {
        setError('Failed to fetch devices.');
        console.error('Error fetching devices:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (restaurantId) {
      fetchDevices();
    }
  }, [restaurantId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp.toDate ? timestamp.toDate() : timestamp).toLocaleString();
    } catch (err) {
      return 'Invalid Date';
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Never';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch (err) {
      return 'Unknown';
    }
  };

  const getDeviceRoleIcon = (role) => {
    const option = deviceRoleOptions.find(opt => opt.value === role);
    return option ? option.icon : <PersonIcon />;
  };

  const getDeviceRoleColor = (role) => {
    switch (role) {
      case 'Table':
        return 'primary';
      case 'Owner':
        return 'secondary';
      case 'Staff':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleEditDevice = (device) => {
    setEditingDevice(device);
    setEditForm({
      deviceRole: device.deviceRole || 'Table',
      tableNumber: device.tableNumber || '',
      activated: device.activated || false
    });
    setEditDialogOpen(true);
  };

  const handleSaveDevice = async () => {
    if (!editingDevice) return;

    try {
      setSaving(true);
      const deviceRef = doc(db, 'Restaurants', restaurantId, 'Devices', editingDevice.id);
      
      await updateDoc(deviceRef, {
        deviceRole: editForm.deviceRole,
        tableNumber: editForm.tableNumber,
        activated: editForm.activated
      });

      // Update local state
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === editingDevice.id 
            ? { ...device, ...editForm }
            : device
        )
      );

      setSnackbar({
        open: true,
        message: 'Device updated successfully!',
        severity: 'success'
      });

      setEditDialogOpen(false);
      setEditingDevice(null);
    } catch (err) {
      console.error('Error updating device:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update device. Please try again.',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingDevice(null);
    setEditForm({
      deviceRole: 'Table',
      tableNumber: '',
      activated: false
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="calc(100vh - 200px)"
    >
      <Box textAlign="center">
        <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading devices...
        </Typography>
      </Box>
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" mt={6}>
      <Alert severity="error" sx={{ maxWidth: 600, width: '100%' }}>
        {error}
      </Alert>
    </Box>
  );

  return (
    <Box>
      {devices.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <Box textAlign="center" sx={{ maxWidth: 500 }}>
            <DeviceHubIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              No Devices Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This restaurant doesn't have any devices registered yet.
            </Typography>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {devices.map((device, idx) => (
            <Grid item xs={12} md={6} lg={4} key={device.id}>
              <Fade in timeout={300 + (idx * 100)}>
                <Card 
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  {/* Status Badge */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: 20,
                    zIndex: 1
                  }}>
                    <Badge
                      badgeContent={device.activated ? 'ONLINE' : 'OFFLINE'}
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: device.activated ? '#4caf50' : '#f44336',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '4px 8px',
                          borderRadius: '12px',
                          minWidth: '60px'
                        }
                      }}
                    >
                      <Avatar sx={{ 
                        bgcolor: device.activated ? '#4caf50' : '#f44336',
                        width: 24,
                        height: 24
                      }}>
                        {device.activated ? <WifiIcon sx={{ fontSize: 16 }} /> : <WifiOffIcon sx={{ fontSize: 16 }} />}
                      </Avatar>
                    </Badge>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    {/* Device Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.main', 
                        mr: 2,
                        width: 56,
                        height: 56,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}>
                        <DeviceHubIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 0.5 }}>
                          {device.deviceId || `Device ${device.id.slice(-6)}`}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            icon={getDeviceRoleIcon(device.deviceRole)}
                            label={device.deviceRole || 'Table'}
                            size="small"
                            color={getDeviceRoleColor(device.deviceRole)}
                            sx={{ 
                              fontWeight: 600,
                              color: 'white'
                            }}
                          />
                          {device.deviceRole === 'Table' && device.tableNumber && (
                            <Chip
                              icon={<TableRestaurantIcon />}
                              label={`Table ${device.tableNumber}`}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontWeight: 600,
                                borderColor: 'primary.main',
                                color: 'primary.main'
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Device Details */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Device Role */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ color: 'text.secondary', mr: 2, fontSize: 20 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Device Role
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {device.deviceRole || 'Table'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Created Date */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon sx={{ color: 'text.secondary', mr: 2, fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Created
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {formatTimestamp(device.createdAt)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Last Login */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ color: 'text.secondary', mr: 2, fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Last Activity
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {getTimeAgo(device.lastLogin)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(device.lastLogin)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                          icon={device.activated ? <CheckCircleIcon /> : <CancelIcon />}
                          label={device.activated ? 'Active' : 'Inactive'}
                          color={device.activated ? 'success' : 'error'}
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                        <Box sx={{ flex: 1 }} />
                        <Tooltip title="Edit Device">
                          <IconButton 
                            size="small" 
                            sx={{ color: 'primary.main' }}
                            onClick={() => handleEditDevice(device)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Device Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700
        }}>
          Edit Device
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 3 }}>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Device Role</InputLabel>
              <Select
                value={editForm.deviceRole}
                label="Device Role"
                onChange={(e) => setEditForm(prev => ({ ...prev, deviceRole: e.target.value }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              >
                {deviceRoleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.icon}
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Table Number"
              value={editForm.tableNumber}
              onChange={(e) => setEditForm(prev => ({ ...prev, tableNumber: e.target.value }))}
              fullWidth
              placeholder="e.g., 1, 2, 3, etc."
              disabled={editForm.deviceRole !== 'Table'}
              helperText={editForm.deviceRole !== 'Table' ? 'Table number is only applicable for Table devices' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={editForm.activated}
                  onChange={(e) => setEditForm(prev => ({ ...prev, activated: e.target.checked }))}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    Device Status
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {editForm.activated ? 'Device is active and online' : 'Device is inactive and offline'}
                  </Typography>
                </Box>
              }
              sx={{ 
                alignItems: 'flex-start',
                '& .MuiFormControlLabel-label': {
                  mt: 0.5
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseEditDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDevice}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
              }
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeviceList; 