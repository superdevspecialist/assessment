import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IMovie } from '../interfaces/movies.interface';

interface MovieCardProps {
  movie: IMovie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full p-2 rounded-lg">
      <Card className="bg-card w-full h-full p-2" onClick={() => navigate(`/edit-movie/${movie._id}`)}>
        <Card.Img variant="top" className='w-full h-[80%] object-cover rounded-lg' src={`http://localhost:3100/${movie.poster}`} />
        <Card.Body className="text-white h-[20%]">
          <Card.Title>{movie.title}</Card.Title>
          <Card.Subtitle className="home-owner">{movie.ownerName}</Card.Subtitle>
          <Card.Text className="home-year">{movie.year}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MovieCard;
