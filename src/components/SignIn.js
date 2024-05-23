import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './SignIn.css';

function SignInSide({ onLogin, socket}) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSkip = () => {
    // Passer à la page d'accueil en indiquant que l'utilisateur n'est pas connecté
    navigate('/home', { state: { isAuthenticated: false } });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  
    try {
      const response = await axios.post('http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/user/login', {
        email: data.get('email'),
        password: data.get('password'),
      });

      // Création d'un cookie HTTPOnly pour stocker l'email
      document.cookie = `email=${data.get('email')}; path=/; HttpOnly`;
      
      // Appeler la fonction de gestion de la connexion avec le token JWT
      onLogin(response.data.token);
      
      
      // Redirigez vers la page d'accueil après une connexion réussie
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
        <Grid
          item
          xs={false}
          sx={{
            position: 'relative',
            zIndex: -1,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1614854262318-831574f15f1f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="background"
          />
        </Grid>
        <Box
          className="signInContainer"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1 }}>
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {errorMessage && (
              <Typography variant="body2" color="error" sx={{ mt: 1, mb: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <Box sx={{ width: '100%' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, borderRadius: 20 }}
              >
                Sign In
              </Button>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button
                    onClick={handleSkip}
                    to="/home"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 1, borderRadius: 20 }}
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
                    sx={{ mt: 1, borderRadius: 20 }}
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
