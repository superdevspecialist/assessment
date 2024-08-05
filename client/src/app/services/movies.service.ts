import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../redux/store';

export const moviesAPI = createApi({
  reducerPath: 'moviesAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3100/v1/movie/',
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = (getState() as RootState).authReducer;
      if (access_token) {
        headers.set('Authorization', `Bearer ${access_token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    getMyMovies: build.mutation<any, null>({
      query: () => ({
        url: 'my',
        method: 'GET',
      }),
    }),
    getMovie: build.query<any, string>({
      query: (id) => ({
        url: `${id}`,
        method: 'GET',
      }),
    }),
    updateMovie: build.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${id}`,
        method: 'PUT',
        body: formData,
      }),
    }),
    createMovie: build.mutation<any, FormData>({
      query: (formData) => ({
        url: '',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useGetMyMoviesMutation, useGetMovieQuery, useUpdateMovieMutation, useCreateMovieMutation } = moviesAPI;
