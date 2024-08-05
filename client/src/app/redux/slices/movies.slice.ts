import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MovieState {
  email: string;
  name: string;
}

const initialState: MovieState = {
  email: '',
  name: '',
};

export const moviesSlice = createSlice({
  name: 'moviesSlice',
  initialState,
  reducers: {
    setMovies(state: MovieState, { payload }: PayloadAction<MovieState>) {
      state.email = payload.email;
      state.name = payload.name;
    },
  },
});

export const { setMovies } = moviesSlice.actions;
export const moviesReducer = moviesSlice.reducer;
