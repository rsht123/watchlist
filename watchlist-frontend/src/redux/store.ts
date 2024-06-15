import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlices/apiSlice';
import userSlice from './slices/userSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import stateSlice from './slices/stateSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userSlice,
    state: stateSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
