import axios from 'axios';

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        return null;
    }

    try {
        const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });
        const { access } = response.data;
        localStorage.setItem('token', access);
        console.log('Токен обновлен');
        return access;
    } catch (error) {
        console.error('Ошибка обновления токена', error);
        return null;
    }
};