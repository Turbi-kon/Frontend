import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.183:8000/api';

export const fetchServices = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/services`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении услуг:', error);
        return [];
    }
};
