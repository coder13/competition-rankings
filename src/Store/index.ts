import { configureStore } from '@reduxjs/toolkit';
import { wcaAPI } from 'Services';

export * from './hooks';
export * from './types';

export const store = configureStore({
  reducer: {
    [wcaAPI.reducerPath]: wcaAPI.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(wcaAPI.middleware),
});

export * from './tmp';
