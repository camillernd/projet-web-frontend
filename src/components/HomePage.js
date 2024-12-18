import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import MovieSearch from './MovieSearch';
import './HomePage.css';

function HomePage({ user, onLogout, socket }) {
  const [moviesData, setMoviesData] = useState([]);

  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/api/movie');
        const data = await response.json();
        setMoviesData(data);
      } catch (error) {
        console.error('Error fetching movies data:', error);
      }
    };

    fetchMoviesData();
  }, []);

  return (
    <div className="homepage-container">
      <MovieSearch setMoviesData={setMoviesData} />
      <div className="films-container">
        {moviesData.map(movie => (
          <Link key={movie._id} to={`/movie/${movie._id}`} className="poster-link">
            <div className="poster-item">
              <img src={movie.posterURL} alt={`Poster ${movie.title}`} className="poster-image" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
