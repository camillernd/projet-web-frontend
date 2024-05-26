import React from 'react';
import { Paper, Typography, Tooltip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LikeButton from './LikeButton';
import './MessageItem.css';

const MessageItem = ({ message, user, onDelete, socket }) => {
  return (
    <div className="message-item-container">
      <Paper className="message-item" style={{ padding: '10px' }}>
        <div className="message-content">
          <Typography variant="body1">{message.content}</Typography>
          <Typography variant="body2" color="textSecondary">
            {message.userData.firstName} {message.userData.lastName}
          </Typography>
        </div>
        <div className="message-actions">
          {user && user.userId === message.userId && (
            <Tooltip title="Supprimer">
              <IconButton onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          <LikeButton 
            user={user} 
            messageId={message._id} 
            socket={socket} 
            likesCount={message.likesCount} 
          />
        </div>
      </Paper>
    </div>
  );
};

export default MessageItem;
