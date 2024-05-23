import React from 'react';
import LikeButton from './LikeButton';
import './MessageItem.css';
import trashIcon from '../assets/trash-icon.png';

const MessageItem = ({ message, user, onDelete, socket }) => {
  return (
    <li className="message-item">
      <div className="message-content">
        <p>{message.content}</p>
        <p className="message-creator">Créé par : {message.userData.firstName} {message.userData.lastName}</p>
      </div>
      <div className="message-actions">
        {user.userId === message.userId && (
          <button onClick={onDelete} className="delete-button">
            <img src={trashIcon} alt="Delete" className="delete-icon" />
          </button>
        )}
        <LikeButton user={user} messageId={message._id} socket={socket} likesCount={message.likesCount} />
      </div>
    </li>
  );
};

export default MessageItem;
