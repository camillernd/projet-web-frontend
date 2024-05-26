import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './LikeButton.css';

function LikeButton({ user, messageId, socket, likesCount }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchLikeStatus = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/like/check?messageId=${messageId}&userId=${user.userId}`);
          setLiked(response.data.liked);
        } catch (error) {
          console.error('Error fetching like status:', error);
        }
      };

      fetchLikeStatus();
    }
  }, [messageId, user]);

  const handleLike = async () => {
    if (!user) return;

    try {
      if (liked) {
        await axios.delete('http://localhost:3000/api/like', {
          data: {
            messageId: messageId,
            userId: user.userId
          }
        });
        setLiked(false);
        socket.emit('unlikeMessage', { messageId: messageId, userId: user.userId });
      } else {
        await axios.post(`http://localhost:3000/api/like`, { messageId, userId: user.userId });
        setLiked(true);
        socket.emit('likeMessage', { messageId: messageId, userId: user.userId });
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  return (
    <div className="like-button">
      <Tooltip title={liked ? "Unlike" : "Like"}>
        <span>
          <IconButton onClick={handleLike} disabled={!user}>
            {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </span>
      </Tooltip>
      <span className="likes-count">{likesCount}</span>
    </div>
  );
}

export default LikeButton;
