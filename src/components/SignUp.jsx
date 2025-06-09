import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { alpha } from '@mui/material/styles';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  restaurantName: yup.string().required('Restaurant name is required'),
  city: yup.string().required('City is required'),
});

const autofillStyles = `
input:-webkit-autofill,
input:-webkit-autofill:focus,
input:-webkit-autofill:hover,
input:-webkit-autofill:active {
  box-shadow: 0 0 0 100px #fff inset !important;
  -webkit-box-shadow: 0 0 0 100px #fff inset !important;
  background-color: #fff !important;
  -webkit-text-fill-color: #222 !important;
  caret-color: #1976d2 !important;
}
`;

const SignUp = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Save additional restaurant data to Firestore
      await setDoc(doc(db, 'Restaurants', userCredential.user.uid), {
        email: data.email,
        restaurantName: data.restaurantName,
        city: data.city,
        createdAt: new Date().toISOString(),
        userId: userCredential.user.uid,
        status: 'active'
      });

      setSuccess(true);
      reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Inject autofill styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = autofillStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Container component="main" maxWidth="md" sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      py: 4
    }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '800px',
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography 
            component="h1" 
            variant="h3" 
            sx={{ 
              mb: 4, 
              color: '#1976d2',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Create Restaurant Account
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                width: '100%', 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
            >
              Account created successfully! You can now log in.
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit(onSubmit)} 
            sx={{ 
              mt: 2, 
              width: '100%',
              '& .MuiTextField-root': {
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8f9fa',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                      borderWidth: '2px',
                    }
                  },
                  '&.Mui-focused, &.MuiInputBase-adornedEnd, &.MuiInputBase-adornedStart, &.MuiInputBase-root.Mui-focused': {
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                      borderWidth: '2px',
                    }
                  },
                  '&.MuiInputBase-root.Mui-focused label': {
                    color: '#1976d2',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                    transition: 'all 0.2s ease-in-out',
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                  background: 'transparent',
                  '&.Mui-focused': {
                    color: '#1976d2',
                    fontWeight: 500
                  },
                  '&.MuiInputLabel-shrink': {
                    color: '#1976d2',
                    fontWeight: 500,
                    background: '#fff',
                    padding: '0 4px',
                  }
                },
                '& .MuiInputBase-input': {
                  padding: '16px 14px',
                  fontSize: '1rem',
                  '&::placeholder': {
                    color: '#999',
                    opacity: 1
                  }
                }
              }
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              size="large"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                '& .MuiFormHelperText-root': {
                  marginLeft: 1,
                  fontSize: '0.875rem'
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              size="large"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{
                '& .MuiFormHelperText-root': {
                  marginLeft: 1,
                  fontSize: '0.875rem'
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="restaurantName"
              label="Restaurant Name"
              size="large"
              {...register('restaurantName')}
              error={!!errors.restaurantName}
              helperText={errors.restaurantName?.message}
              sx={{
                '& .MuiFormHelperText-root': {
                  marginLeft: 1,
                  fontSize: '0.875rem'
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="city"
              label="City"
              size="large"
              {...register('city')}
              error={!!errors.city}
              helperText={errors.city?.message}
              sx={{
                '& .MuiFormHelperText-root': {
                  marginLeft: 1,
                  fontSize: '0.875rem'
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                mb: 2,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                backgroundColor: '#1976d2',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={28} sx={{ color: 'white' }} /> : 'Create Account'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp; 