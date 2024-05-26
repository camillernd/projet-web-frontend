import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import HomePage from './components/HomePage';
import MovieDetailPage from './components/MovieDetailPage';
import DiscussionPage from './components/DiscussionPage';
import ProfilePage from './components/ProfilePage';
import Header from './components/Header';
import {jwtDecode} from 'jwt-decode';
import socket from './socket';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser({
        userId: decodedToken.userId,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        role: decodedToken.role,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    socket.disconnect();
  };

  const handleLogin = (token) => {
    const decodedToken = jwtDecode(token);
    localStorage.setItem('token', token);
    setUser({
      userId: decodedToken.userId,
      firstName: decodedToken.firstName,
      lastName: decodedToken.lastName,
      role: decodedToken.role,
    });
    socket.connect();
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} socket={socket} />
      <Routes>
        <Route path="/" element={<SignIn onLogin={handleLogin} socket={socket} />} />
        <Route path="/signin" element={<SignIn onLogin={handleLogin} socket={socket} />} />
        <Route path="/signup" element={<SignUp socket={socket} />} />
        <Route path="/home" element={<HomePage user={user} onLogout={handleLogout} socket={socket} />} />
        <Route path="/movie/:id" element={<MovieDetailPage user={user} socket={socket} onLogout={handleLogout} />} />
        <Route path="/discussion/:discussionId" element={<DiscussionPage user={user} socket={socket} onLogout={handleLogout} />} />
        <Route path="/profile" element={<ProfilePage user={user} onLogout={handleLogout} socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
