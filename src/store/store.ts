import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import lessonsReducer from './slices/lessonsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessons: lessonsReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;