import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Container, Select, MenuItem, FormControl, InputLabel, TextField, Button, CircularProgress, Box } from '@mui/material';
import DiscussionItem from './DiscussionItem'; // Importer le composant DiscussionItem
import Header from './Header'; // Importer le composant Header
import './MovieDetailPage.css'; // Importer le fichier CSS

function MovieDetailPage({ user, socket, onLogout }) {
  const { id } = useParams();
  const [movieData, setMovieData] = useState(null);
  const [directorData, setDirectorData] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [sortOption, setSortOption] = useState('chronological'); // État pour l'option de tri

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieResponse = await axios.get(process.env.REACT_APP_API_URL + `/api/movie/${id}`);
        setMovieData(movieResponse.data);

        const directorResponse = await axios.get(process.env.REACT_APP_API_URL + `/api/celeb/${movieResponse.data.director}`);
        setDirectorData(directorResponse.data);

        fetchDiscussions();
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    const fetchDiscussions = async () => {
      try {
        const discussionsResponse = await axios.get(process.env.REACT_APP_API_URL + `/api/discussion?filmId=${id}`);
        const discussionsData = discussionsResponse.data;

        if (discussionsData.length > 0) {
          const discussionsWithDetails = await Promise.all(discussionsData.map(async discussion => {
            const userResponse = await axios.get(process.env.REACT_APP_API_URL + `/api/user/${discussion.userId}`);
            const userData = userResponse.data.data;

            const messagesResponse = await axios.get(process.env.REACT_APP_API_URL + `/api/message?discussionId=${discussion._id}`);
            const messageCount = messagesResponse.data.length;

            return { ...discussion, userData, messageCount };
          }));

          setDiscussions(sortDiscussions(discussionsWithDetails, sortOption));
        } else {
          setDiscussions([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des discussions :', error);
      }
    };

    fetchData();

    // Écouter l'événement de création de discussion
    socket.on('discussionCreated', fetchDiscussions);

    // Écouter l'événement de suppression de discussion
    socket.on('discussionDeleted', fetchDiscussions);

    return () => {
      socket.off('discussionCreated', fetchDiscussions);
      socket.off('discussionDeleted', fetchDiscussions);
    };
  }, [id, socket, sortOption]);

  const sortDiscussions = (discussions, option) => {
    return [...discussions].sort((a, b) => {
      if (option === 'chronological') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (option === 'messageCount') {
        return b.messageCount - a.messageCount;
      }
      return 0;
    });
  };

  const handleNewDiscussionSubmit = async (event) => {
    event.preventDefault();
    try {
      const newDiscussion = {
        filmId: id,
        userId: user.userId,
        title: newDiscussionTitle
      };
      await axios.post(process.env.REACT_APP_API_URL + `/api/discussion`, newDiscussion);
      
      // Émettre l'événement de création de discussion
      socket.emit('createDiscussion', newDiscussion);
      console.log("socket ajout envoyé");

      setNewDiscussionTitle('');

    } catch (error) {
      console.error('Erreur lors de la création de la nouvelle discussion :', error);
    }
  };

  const handleDeleteDiscussion = async (discussionId) => {
    try {
      await axios.delete(process.env.REACT_APP_API_URL + `/api/discussion/${discussionId}`);
      // Émettre l'événement de suppression de discussion
      socket.emit('deleteDiscussion', discussionId);
    } catch (error) {
      console.log("socket suppression envoyé");
      console.error('Erreur lors de la suppression de la discussion :', error);
    }
  };

  return (
    <div className="movie-detail-container">
      <Container maxWidth={false} style={{ padding: 0 }}>
        {movieData && directorData ? (
          <Box padding={2} textAlign="center" className="title-container">
            <Typography variant="h1" gutterBottom className="title" style={{ fontWeight: 'bold' }}>{movieData.title}</Typography>
            <Box padding={2} textAlign="center" className="data-container">
            <Typography variant="body1" className="release-date">
              {directorData.name} ({movieData.releaseYear})
            </Typography>
            </Box>
          </Box>
        ) : (
          <CircularProgress />
        )}

        <Box padding={2}>
          <Box display="flex" justifyContent="center" alignItems="center" marginY={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" maxWidth="920px">
              {user ? (
                <form onSubmit={handleNewDiscussionSubmit} style={{ display: 'flex', width: '100%' }}>
                  <TextField 
                    label="Saisir un titre pour la nouvelle discussion"
                    variant="outlined"
                    fullWidth
                    value={newDiscussionTitle}
                    onChange={(event) => setNewDiscussionTitle(event.target.value)} 
                    style={{ marginRight: '10px', height: '56px' }}
                    className="input-field"
                  />
                  <Button type="submit" variant="contained" className="button" style={{ height: '56px' }}
                  sx={{ mx: 1, bgcolor: '#c97bfb', color: '#f1eafe', '&:hover': { bgcolor: '#975fbb' } }}>Envoyer</Button>
                </form>
              ) : null}
              <FormControl variant="outlined" style={{ marginLeft: '10px', height: '56px' }}>
                <InputLabel id="sort-label" className="select-label">Trier par</InputLabel>
                <Select
                  labelId="sort-label"
                  id="sortOption"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  label="Trier par"
                  className="select"
                  style={{ height: '56px' }}
                >
                  <MenuItem value="chronological">Chronologique</MenuItem>
                  <MenuItem value="messageCount">Les plus populaires</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {discussions.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {discussions.map(discussion => (
                <DiscussionItem
                  key={discussion._id}
                  discussion={discussion}
                  user={user}
                  onDelete={() => handleDeleteDiscussion(discussion._id)}
                />
              ))}
            </ul>
          ) : (
            <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center', mt: 6, color: '#643e9e'}}>
              Pas encore de discussions
            </Typography>
          )}
        </Box>
      </Container>
    </div>
  );
}

export default MovieDetailPage;
