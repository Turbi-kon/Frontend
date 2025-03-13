import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import requestsReducer from './features/requestsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        requests: requestsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;