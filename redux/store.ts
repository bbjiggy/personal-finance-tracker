import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, createMigrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import UserSlice from '@/redux/userSlice';
import { migrateTransactions } from '@/utils/dataMigration';

const migrations = {
    0: (state: any) => {
        return {
            ...state,
            expense: migrateTransactions(state.expense || []),
            incomes: migrateTransactions(state.incomes || []),
            budgets: state.budgets || []
        };
    }
};

const persistConfig = {
    key: 'expense_root',
    storage,
    version: 0,
    migrate: createMigrate(migrations, { debug: false }),
    whitelist: ['expense', 'incomes', 'budgets', 'username'],
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
