// src/app/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authAPI } from '../services/auth.service';
import { moviesAPI } from '../services/movies.service';
import { moviesReducer } from './slices/movies.slice';
import { authReducer } from './slices/auth.slice';
import { generalReducer } from './slices/general.slice';
import { userReducer } from './slices/user.slice';

export const store = configureStore({
  reducer: {
    authReducer,
    userReducer,
    moviesReducer,
    generalReducer,

    [authAPI.reducerPath]: authAPI.reducer,
    [moviesAPI.reducerPath]: moviesAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([authAPI.middleware, moviesAPI.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
