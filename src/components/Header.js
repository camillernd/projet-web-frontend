import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import './Header.css'; // Assurez-vous de créer un fichier CSS pour le style du bandeau
import backgroundImage from '../assets/banniere5.jpg'; // Importer l'image ici

function Header({ user, onLogout, socket }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    if (socket) {
      socket.disconnect();
    }
    navigate('/signin');
  };

  const handleSignInClick = () => {
    if (socket) {
      socket.disconnect();
    }
    navigate('/signin');
  };

  // Ne pas afficher le Header sur les pages /signin et /signup
  if (location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/') {
    return null;
  }

  return (
    <Box
      className="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        backgroundImage: `url(${backgroundImage})`, // Utiliser l'image importée ici
        backgroundSize: 'cover', // Assure que l'image couvre toute la bannière
        backgroundPosition: 'center', // Centre l'image dans la bannière
      }}
    >
      {user ? (
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <Button variant="contained" onClick={handleLogout} sx={{ mx: 1, bgcolor: '#c97bfb', color: '#f1eafe', '&:hover': { bgcolor: '#975fbb' } }}>
            Se déconnecter
          </Button>
          {location.pathname !== '/home' && (
            <Button
              component={RouterLink}
              to="/home"
              variant="contained"
              sx={{ mx: 1, bgcolor: '#9158e9', color: '#f1eafe', '&:hover': { bgcolor: '#643e9e' } }}
              startIcon={<HomeRoundedIcon />}
            >
              Home
            </Button>
          )}
          <Button
            component={RouterLink}
            to="/profile"
            variant="contained"
            sx={{ mx: 1, bgcolor: '#6e25f5', color: '#f1eafe', '&:hover': { bgcolor: '#4315ab' } }}
            startIcon={<AccountBoxRoundedIcon />}
          >
            {user.firstName}
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          {location.pathname !== '/home' && (
            <Button
              component={RouterLink}
              to="/home"
              variant="contained"
              sx={{ mx: 1, bgcolor: '#9158e9', color: '#f1eafe', '&:hover': { bgcolor: '#643e9e' } }}
              startIcon={<HomeRoundedIcon />}
            >
              Home
            </Button>
          )}
          <Button
            onClick={handleSignInClick}
            variant="contained"
            sx={{ mx: 1, bgcolor: '#6e25f5', color: '#f1eafe', '&:hover': { bgcolor: '#4315ab' } }}
          >
            Sign In
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Header;
