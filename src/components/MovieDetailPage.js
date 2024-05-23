import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DiscussionItem from './DiscussionItem'; // Importer le composant DiscussionItem

function MovieDetailPage({ user, socket }) {
  const { id } = useParams();
  const [movieData, setMovieData] = useState(null);
  const [directorData, setDirectorData] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieResponse = await axios.get(`https://aftermovie-backend.cluster-ig3.igpolytech.fr/api/movie/${id}`);
        setMovieData(movieResponse.data);

        const directorResponse = await axios.get(`https://aftermovie-backend.cluster-ig3.igpolytech.fr/api/celeb/${movieResponse.data.director}`);
        setDirectorData(directorResponse.data);

        fetchDiscussions();
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    const fetchDiscussions = async () => {
      try {
        const discussionsResponse = await axios.get(`https://aftermovie-backend.cluster-ig3.igpolytech.fr/api/discussion?filmId=${id}`);
        const discussionsData = discussionsResponse.data;

        if (discussionsData.length > 0) {
          const discussionsWithUserData = await Promise.all(discussionsData.map(async discussion => {
            const userResponse = await axios.get(`https://aftermovie-backend.cluster-ig3.igpolytech.fr/api/user/${discussion.userId}`);
            const userData = userResponse.data.data;
            return { ...discussion, userData };
          }));

          setDiscussions(discussionsWithUserData);
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
  }, [id, socket]);

  const handleNewDiscussionSubmit = async (event) => {
    event.preventDefault();
    try {
      const newDiscussion = {
        filmId: id,
        userId: user.userId,
        title: newDiscussionTitle
      };
      await axios.post(`https://aftermovie-backend.cluster-ig3.igpolytech.fr/api/discussion`, newDiscussion);
      
      // Émettre l'événement de création de discussion
      socket.emit('createDiscussion', newDiscussion);

      setNewDiscussionTitle('');
    } catch (error) {
      console.error('Erreur lors de la création de la nouvelle discussion :', error);
    }
  };

  const handleDeleteDiscussion = async (discussionId) => {
    try {
      await axios.delete(`https://aftermovie-backend.cluster-ig3.igpolytech.fr/api/discussion/${discussionId}`);
      // Émettre l'événement de suppression de discussion
      socket.emit('deleteDiscussion', discussionId);
    } catch (error) {
      console.error('Erreur lors de la suppression de la discussion :', error);
    }
  };

  return (
    <div>
      {movieData && directorData ? (
        <div>
          <h2>{movieData.title}</h2>
          <p>Date de sortie : {movieData.releaseYear}</p>
          <p>Réalisateur/Réalisatrice : {directorData.name}</p>
          <img src={movieData.posterURL} alt={`Poster ${movieData.title}`} style={{ width: '200px' }} />
        </div>
      ) : (
        <p>Chargement en cours...</p>
      )}

      <h3>Discussions associées :</h3>
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
        <p>Pas encore de discussions</p>
      )}

      <form onSubmit={handleNewDiscussionSubmit}>
        <input 
          type="text" 
          placeholder="Saisir un titre pour la nouvelle discussion" 
          value={newDiscussionTitle}
          onChange={(event) => setNewDiscussionTitle(event.target.value)} 
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default MovieDetailPage;
