import React from 'react';
import { Link } from 'react-router-dom'; // Importer Link depuis react-router-dom
import './DiscussionItem.css';
import trashIcon from '../assets/trash-icon.png';

const DiscussionItem = ({ discussion, user, onDelete }) => {
  return (
    <li className="discussion-item">
      <div className="discussion-content">
        {/* Utiliser Link autour du titre pour créer un lien vers la page de discussion */}
        <Link to={`/discussion/${discussion._id}`} className="discussion-title">
          <h4>{discussion.title}</h4>
        </Link>
        {discussion.userData && (
          <p className="discussion-creator">Créé par : {discussion.userData.firstName} {discussion.userData.lastName}</p>
        )}
      </div>
      {user.userId === discussion.userId && (
        <button onClick={onDelete} className="delete-button">
          <img src={trashIcon} alt="Delete" className="delete-icon" />
        </button>
      )}
    </li>
  );
};

export default DiscussionItem;
