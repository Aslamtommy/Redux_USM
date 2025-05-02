import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import adminReducer from './adminSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedAdminReducer = persistReducer(persistConfig, adminReducer);

const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        admin: persistedAdminReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

const persistor = persistStore(store);

export { store, persistor };
