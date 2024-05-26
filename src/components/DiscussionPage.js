import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Container, Select, MenuItem, FormControl, InputLabel, TextField, Button, CircularProgress, Box } from '@mui/material';
import MessageItem from './MessageItem';
import Header from './Header'; // Importer le composant Header
import './DiscussionPage.css'; // Importer le fichier CSS

function DiscussionPage({ user, socket, onLogout }) {
  const { discussionId } = useParams();
  const [discussionData, setDiscussionData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [sortOption, setSortOption] = useState('chronological'); // État pour l'option de tri

  useEffect(() => {
    const fetchData = async () => {
      try {
        const discussionResponse = await axios.get(`http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/discussion/${discussionId}`);
        setDiscussionData(discussionResponse.data);

        const userResponse = await axios.get(`http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/user/${discussionResponse.data.userId}`);
        const userData = userResponse.data.data;
        const creatorFullName = `${userData.firstName} ${userData.lastName}`;
        setCreatorName(creatorFullName);

        fetchMessages();
      } catch (error) {
        console.error('Erreur lors de la récupération des données de la discussion :', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const messagesResponse = await axios.get(`http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/message?discussionId=${discussionId}`);
        const messagesData = messagesResponse.data;

        if (messagesData.length > 0) {
          const messagesWithUserData = await Promise.all(messagesData.map(async message => {
            const userResponse = await axios.get(`http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/user/${message.userId}`);
            const userData = userResponse.data.data;

            const likesResponse = await axios.get(`http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/like/count?messageId=${message._id}`);
            const likesCount = likesResponse.data.likesCount;

            return { ...message, userData, likesCount };
          }));

          setMessages(sortMessages(messagesWithUserData, sortOption));
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
      }
    };

    fetchData();

    const handleMessageCreated = (message) => {
      console.log('messageCreated reçu:', message);
      fetchMessages();
    };

    const handleMessageLiked = (message) => {
      console.log('messageLiked reçu:', message);
      fetchMessages();
    };

    const handleMessageUnliked = (message) => {
      console.log('messageUnliked reçu:', message);
      fetchMessages();
    };

    const handleMessageDeleted = (messageId) => {
      console.log('messageDeleted reçu:', messageId);
      fetchMessages();
    };

    socket.on('messageCreated', handleMessageCreated);
    socket.on('messageLiked', handleMessageLiked);
    socket.on('messageUnliked', handleMessageUnliked);
    socket.on('messageDeleted', handleMessageDeleted);

    return () => {
      socket.off('messageCreated', handleMessageCreated);
      socket.off('messageLiked', handleMessageLiked);
      socket.off('messageUnliked', handleMessageUnliked);
      socket.off('messageDeleted', handleMessageDeleted);
    };
  }, [discussionId, socket, sortOption]);

  const sortMessages = (messages, option) => {
    return [...messages].sort((a, b) => {
      if (option === 'chronological') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (option === 'likes') {
        return b.likesCount - a.likesCount;
      }
      return 0;
    });
  };

  const handleNewMessageSubmit = async (event) => {
    event.preventDefault();
    try {
      const newMessage = {
        discussionId: discussionId,
        userId: user.userId,
        content: newMessageContent,
      };
      await axios.post(`http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/message`, newMessage);

      socket.emit('createMessage', newMessage);

      setNewMessageContent('');
    } catch (error) {
      console.error('Erreur lors de la création du nouveau message :', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/message/${messageId}`);
      socket.emit('deleteMessage', messageId);
    } catch (error) {
      console.error('Erreur lors de la suppression du message :', error);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Container maxWidth={false} style={{ padding: 0 }}>
        {discussionData ? (
          <Box className="title-box" padding={2} textAlign="center">
            <Typography style={{ fontWeight: 'bold' }} variant="h2" className="title">
              {discussionData.title}
            </Typography>
            <Typography variant="h6" className="creator">
              Ouvert par: {creatorName}
            </Typography>
          </Box>
        ) : (
          <CircularProgress />
        )}

        <Box padding={2}>
          <Box display="flex" justifyContent="center" alignItems="center" marginY={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" maxWidth="1220px">
              {user ? (
                <form onSubmit={handleNewMessageSubmit} style={{ display: 'flex', width: '100%' }}>
                  <TextField 
                    label="Saisir un nouveau message"
                    variant="outlined"
                    fullWidth
                    value={newMessageContent}
                    onChange={(event) => setNewMessageContent(event.target.value)}
                    style={{ marginRight: '10px', height: '56px' }}
                  />
                  <Button type="submit" variant="contained" color="primary" style={{ height: '56px' }} 
                  sx={{ mx: 1, bgcolor: '#c97bfb', color: '#f1eafe', '&:hover': { bgcolor: '#975fbb' } }}>Envoyer</Button>
                </form>
              ) : null}
              <FormControl variant="outlined" style={{ marginLeft: '10px', height: '56px' }}>
                <InputLabel id="sort-label">Trier par</InputLabel>
                <Select
                  labelId="sort-label"
                  id="sortOption"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  label="Trier par"
                  style={{ height: '56px' }}
                >
                  <MenuItem value="chronological">Chronologique</MenuItem>
                  <MenuItem value="likes">Nombre de likes</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {messages.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {messages.map(message => (
                <MessageItem
                  key={message._id}
                  message={message}
                  user={user}
                  onDelete={() => handleDeleteMessage(message._id)}
                  socket={socket}
                />
              ))}
            </ul>
          ) : (
            <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center', mt: 6, color: '#643e9e'}}>
              Pas encore de messages
            </Typography>
          )}
        </Box>
      </Container>
    </div>
  );
}

export default DiscussionPage;
