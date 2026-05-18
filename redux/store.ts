import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import UserSlice from '@/redux/userSlice';

const persistConfig = {
    key: 'expense_root',
    storage,
    whitelist: ['expense', 'incomes'],
};

const persistedReducer = persistReducer(persistConfig, UserSlice);

export const store = configureStore({
    reducer: {
        user: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const persist_store = persistStore(store);
