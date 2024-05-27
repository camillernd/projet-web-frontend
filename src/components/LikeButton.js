import React, { useState, useEffect } from 'react';
import axios from 'axios';
import heartFullIcon from '../assets/full-heart.png';
import heartEmptyIcon from '../assets/empty-heart.png';
import './LikeButton.css';

function LikeButton({ user, messageId, socket, likesCount }) {
  const [liked, setLiked] = useState(false);
  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/like/check?messageId=${messageId}&userId=${user.userId}`);
        setLiked(response.data.liked);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [messageId, user.userId]);

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.delete('http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/like', {
          data: {
            messageId: messageId,
            userId: user.userId
          }
        });
        setLiked(false);
        setCurrentLikesCount(currentLikesCount - 1);
        socket.emit('unlikeMessage', { messageId: messageId, userId: user.userId });
      } else {
        await axios.post(`http://aftermovie-backend.cluster-ig3.igpolytech.fr/api/like`, { messageId, userId: user.userId });
        setLiked(true);
        setCurrentLikesCount(currentLikesCount + 1);
        socket.emit('likeMessage', { messageId: messageId, userId: user.userId });
        
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  return (
    <button onClick={handleLike} className="like-button">
      <img src={liked ? heartFullIcon : heartEmptyIcon} alt="Like" className="like-icon" />
      <span className="likes-count">{currentLikesCount}</span>
    </button>
  );
}

export default LikeButton;
