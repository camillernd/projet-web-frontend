import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './SignUp.css';

function SignUp({ socket }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(process.env.REACT_APP_API_URL + '/api/user/signup', formData);
      console.log('Données envoyées avec succès !');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données :', error);
    }
  };

  const theme = createTheme({
    typography: {
      fontFamily: 'Reddit Sans, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="signUpBackground">
        <CssBaseline />
        <Box
          className="signUpContainer"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#a851ad',
                '&:hover': {
                  backgroundColor: '#8f3e91',
                },
                borderRadius: 20,
              }}
            >
              Sign Up
            </Button>
            
              <Grid item>
              <Button
                  component={Link}
                  to="/signin"
                  fullWidth
                  variant="outlined"
                  sx={{
                    mt: 1,
                    borderRadius: 20,
                    color: '#a851ad',
                    borderColor: '#a851ad',
                    '&:hover': {
                      backgroundColor: 'rgba(168, 81, 173, 0.1)',
                      borderColor: '#8f3e91',
                    },
                  }}
                >
                  Already have an account? Sign In
                </Button>
              </Grid>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default SignUp;
