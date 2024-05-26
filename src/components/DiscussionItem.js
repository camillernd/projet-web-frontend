import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Tooltip, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './DiscussionItem.css';

const DiscussionItem = ({ discussion, user, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/discussion/${discussion._id}`);
  };

  return (
    <div className="discussion-item-container">
      <Paper elevation={3} className="discussion-item" style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Box className="discussion-content" onClick={handleNavigate} sx={{ cursor: 'pointer', flex: 1 }}>
          <Typography variant="h6" gutterBottom color="#52126b">{discussion.title}</Typography>
          {discussion.userData && (
            <Typography variant="body2" color="#502552">
              Créé par : {discussion.userData.firstName} {discussion.userData.lastName}
            </Typography>
          )}
        </Box>
        {user && user.userId === discussion.userId && (
          <Tooltip title="Supprimer">
            <IconButton onClick={onDelete} sx={{ marginLeft: '10px' }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Paper>
    </div>
  );
};

export default DiscussionItem;
