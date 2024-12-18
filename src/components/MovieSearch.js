import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

function MovieSearch({ setMoviesData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent form submission default behavior
    console.log(`Searching for movies with title: ${searchQuery}`);
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + `/api/movie/search/title`, {
        params: { title: searchQuery }
      });
      console.log('Response data:', response.data);
      if (response.data.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
      setMoviesData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Erreur lors de la recherche de films');
      setNoResults(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', maxWidth: '600px' }}>
        <TextField 
          label="Rechercher des films"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginRight: '10px', height: '45px' }}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '45px',
              '& fieldset': {
                borderColor: '#7569e9', // Change border color
              },
              '&:hover fieldset': {
                borderColor: '#7569e9', // Change border color on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: '#7569e9', // Change border color when focused
              },
              backgroundColor: '#e9ddfe', // Change input background color
            },
            '& .MuiInputBase-input': {
              color: '#7569e9', // Change text color
              height: '45px',
              padding: '0 14px', // Adjust padding for proper alignment
            },
            '& .MuiInputLabel-root': {
              color: '#7569e9', // Change label color
              top: '-6px', // Adjust label position to center vertically
            },
          }}
        />
        <Button 
          type="submit"
          variant="contained"
          color="primary"
          style={{ height: '45px' }}
          sx={{ mx: 1, bgcolor: '#a851ad', color: '#f1eafe', '&:hover': { bgcolor: '#79227e' } }}
        >
          Rechercher
        </Button>
      </form>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {noResults && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Aucun résultat pour cette recherche
        </Typography>
      )}
    </Box>
  );
}

export default MovieSearch;
