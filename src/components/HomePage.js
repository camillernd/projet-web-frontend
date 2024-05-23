import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import './HomePage.css'; // Importer le fichier de style CSS

function HomePage({ user, onLogout, socket}) {
  const [moviesData, setMoviesData] = useState([]); // State to store movie data

  useEffect(() => {
    // Simulate fetching movie data
    const fetchMoviesData = async () => {
      try {
        const response = await fetch('https://aftermovie-backend.cluster-ig3.igpolytech.fr/api/movie');
        const data = await response.json();
        setMoviesData(data);
      } catch (error) {
        console.error('Error fetching movies data:', error);
      }
    };

    fetchMoviesData();
  }, []);

  return (
    <div>
      <div className="band">
        {user ? ( // Vérifie si l'utilisateur est connecté en vérifiant si l'objet user est défini
          <>
            <p className="user-info">{`Bienvenue, ${user.firstName} ! Rôle: ${user.role}`}</p>
            <button className="logout-btn" onClick={onLogout}>Se déconnecter</button>
          </>
        ) : (
          <p className="user-info">Non Connecté</p>
        )}
      </div>
      <div className="films-container">
        {moviesData.map(movie => (
          <Link key={movie._id} to={`/movie/${movie._id}`} className="poster-link">
            <div className="poster-item">
              <p>{movie.title}</p>
              <img src={movie.posterURL} alt={`Poster ${movie.title}`} className="poster-image" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
