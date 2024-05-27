import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './SignIn.css';

function SignInSide({ onLogin, socket }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSkip = () => {
    socket.connect();
    navigate('/home');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const response = await axios.post('http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/user/login', {
        email: data.get('email'),
        password: data.get('password'),
      });

      document.cookie = `email=${data.get('email')}; path=/; HttpOnly`;
      onLogin(response.data.token);
      navigate('/home');
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Incorrect email or password');
    }
  };

  const theme = createTheme({
    typography: {
      fontFamily: 'Reddit Sans, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="signInBackground">
        <CssBaseline />
        <Box
          className="signInContainer"
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
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <Box sx={{ width: '100%' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  borderRadius: 20,
                  backgroundColor: '#a851ad',
                  '&:hover': {
                    backgroundColor: '#8f3e91',
                  },
                }}
              >
                Sign In
              </Button>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button
                    onClick={handleSkip}
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
                    Skip for now
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    component={Link}
                    to="/signup"
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
                    Don't have an account? Sign Up
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default SignInSide;
