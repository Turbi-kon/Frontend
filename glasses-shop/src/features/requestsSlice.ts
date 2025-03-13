import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

interface RequestState {
    requests: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;  // Ошибка может быть строкой или null
}

const initialState: RequestState = {
    requests: [],
    status: 'idle',
    error: null,  // Изначально ошибка равна null
};

export const fetchRequests = createAsyncThunk('requests/fetchRequests', async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };

    try {
        const response = await axios.get('http://localhost:8000/api/requests/', config);
        return response.data;
    } catch (error) {
        // Уточняем тип ошибки, например, как AxiosError
        if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
                // Логика с обновлением токена (например, вызов функции для получения нового токена)
            }
        }
        // В случае ошибки преобразуем ее в строку
        return rejectWithValue((error as Error).message || 'Ошибка запроса');
    }
});

const requestsSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequests.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.requests = action.payload;
            })
            .addCase(fetchRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;  // Если message отсутствует, присваиваем null
            });
    },
});

export default requestsSlice.reducer;
