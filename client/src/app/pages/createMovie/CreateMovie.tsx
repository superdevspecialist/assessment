import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateMovieMutation } from '../../services/movies.service';
import { useAppSelector } from '../../redux/hooks';
import { AiOutlineDownload } from 'react-icons/ai';

const CreateMovie = () => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const { access_token } = useAppSelector(state => state.authReducer);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createMovie, { isLoading, isError, isSuccess }] = useCreateMovieMutation();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setPoster(file);
      setPosterPreview(URL.createObjectURL(file));
      // Reset the file input value to allow re-selection of the same file
      event.target.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) {
      setPoster(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (poster && title && year) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('year', year.toString());
      formData.append('poster', poster);

      try {
        await createMovie(formData).unwrap();
        navigate('/home'); // Redirect to home page after successful creation
      } catch (error) {
        console.error('Failed to create movie', error);
      }
    }
  };

  useEffect(() => {
    if (!access_token) {
      navigate('/');
    }
  }, [access_token, navigate]);

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main bg-cover p-8">
      <h1 className="text-4xl font-semibold text-white mb-8">Create a new movie</h1>
      <div className="flex flex-col md:flex-row w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-4">
          <div
            className="bg-input w-full h-96 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            {posterPreview ? (
              <img src={posterPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <AiOutlineDownload className='text-white text-[25px]' />
                <p className="mb-2 text-md text-gray-200 dark:text-gray-400">
                  Drop an image here
                </p>
                <p className="text-xs text-gray-200 dark:text-gray-400">or click to select</p>
              </div>
            )}
            <input
              id="posterInput"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
              required
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 rounded-md bg-input text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="Publishing year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
              className="w-full p-2 rounded-md bg-input text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="w-1/2 p-2 rounded-md border border-gray-500 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-1/2 p-2 rounded-md border border-gray-500 bg-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {isError && <p className="text-red-500">There was an error creating the movie. Please try again.</p>}
      {isSuccess && <p className="text-green-500">Movie created successfully!</p>}
    </div>
  );
};

export default CreateMovie;
