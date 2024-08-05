import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setMovies as setReducerMovies } from '../../redux/slices/movies.slice';
import { useGetMyMoviesMutation } from '../../services/movies.service';
import { resetState } from '../../redux/slices/auth.slice';
import MovieCard from '../../components/MovieCard';
import { IMovie } from '../../interfaces/movies.interface';
import { AiOutlinePlus, AiOutlineLogout } from 'react-icons/ai';
import './homePage.css';

const HomePage = () => {
  const [getMyMovies, { data, error }] = useGetMyMoviesMutation();
  const dispatch = useAppDispatch();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const { access_token } = useAppSelector(state => state.authReducer);
  const navigate = useNavigate();

  useEffect(() => {
    if (access_token) {
      getMyMovies(null);
    } else {
      navigate('/');
    }
  }, [access_token, getMyMovies, navigate]);

  useEffect(() => {
    if (data && !error) {
      dispatch(setReducerMovies(data));
      setMovies(data);
    } else if (error) {
      console.log(`HomePage:: Error getting movies`, error);
    }
  }, [data, error, dispatch]);

  // Handle screen size changes and update items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerPage(8); // xl: 4 columns, 2 rows
      } else if (window.innerWidth >= 1024) {
        setItemsPerPage(6); // lg: 3 columns, 2 rows
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(4); // md: 2 columns, 2 rows
      } else {
        setItemsPerPage(2); // sm: 1 column, 2 rows
      }
    };

    updateItemsPerPage(); // Set items per page on initial load

    // Add event listener to update items per page on resize
    window.addEventListener('resize', updateItemsPerPage);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Calculate pagination
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / itemsPerPage);

  const handleCreateMovie = () => {
    navigate('/create-movie');
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const logout = () => {
    dispatch(resetState());
  };

  return (
    <div className='bg-bg-main flex justify-center h-screen bg-cover pt-[120px]'>
      <div className='w-[90%] h-full flex flex-col'>
        <div className="flex justify-between items-center px-4">
          <h1 className='text-white text-[48px] font-semibold my-3'>
            My movies
            <AiOutlinePlus
              className='inline ml-2 cursor-pointer border border-3 border-white rounded-full'
              size={24}
              onClick={handleCreateMovie}
            />
          </h1>
          <div className="flex items-center text-white cursor-pointer">
            <span className="mr-2 text-[16px] font-bold">Logout</span>
            <AiOutlineLogout onClick={logout} size={24} />
          </div>
        </div>
        {currentMovies.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 h-[calc(100%-180px)] grid-rows-2">
              {currentMovies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))}
            </div>
            <div className="flex justify-center items-center px-4 h-[100px]">
              <Button
                className="bg-transparent border-none text-white font-semibold"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <div className="flex gap-2 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded-md font-semibold ${currentPage === page ? 'bg-green-500 text-white' : 'bg-[#1E293B] text-white'}`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <Button
                className="bg-transparent border-none text-white font-semibold"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center flex-1 gap-12">
            <h2 className="text-[48px] font-semibold text-white">Your movie list is empty</h2>
            <Button
              className='bg-green-500 p-3 rounded-md border-none text-[16px] font-bold'
              onClick={handleCreateMovie}
            >
              Add a new movie
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
