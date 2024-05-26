import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Header from './Header'; // Importer le Header

function ProfilePage({ user, onLogout }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [open, setOpen] = useState(false);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/user/${user.userId}`, { firstName, lastName });
      alert('Informations mises à jour avec succès. Veuillez vous reconnecter pour voir les modifications');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/user/${user.userId}`);
      onLogout();
      navigate('/signin');
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', paddingTop: '70px' }}>
        {user ? (
          <Box sx={{ width: '100%', maxWidth: 600, textAlign: 'center', p: 3, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>Mon profil</Typography>
            <Box sx={{ my: 2 }}>
              <TextField
                label="Prénom"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Nom"
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleUpdate} sx={{ mx: 1, bgcolor: '#c97bfb', color: '#f1eafe', '&:hover': { bgcolor: '#975fbb' } }}>
                Mettre à jour
              </Button>
              <Button variant="contained" onClick={handleClickOpen} sx={{ mx: 1, bgcolor: '#9158e9', color: '#f1eafe', '&:hover': { bgcolor: '#643e9e' } }}>
                Supprimer le compte
              </Button>
            </Box>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Supprimer le compte</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Annuler
                </Button>
                <Button onClick={handleDeleteAccount} color="secondary">
                  Supprimer
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        ) : (
          <Typography>Veuillez vous connecter pour voir votre profil.</Typography>
        )}
      </Box>
    </Box>
  );
}

export default ProfilePage;
