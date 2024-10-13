import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
// Import other reducers as needed

const store = configureStore({
    reducer: {
        user: userReducer,
        // Add more reducers here if needed
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable if you need to handle non-serializable data
        }),
  
});

export { store };
