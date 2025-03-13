import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { apiSlices } from './slices/apiSlice';
import ticketReducer from './slices/ticketSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlices.reducerPath]: apiSlices.reducer,
    ticket : ticketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlices.middleware),
  devTools: true,
});

export default store;
