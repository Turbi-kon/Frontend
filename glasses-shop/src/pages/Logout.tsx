import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logout());
        alert('Вы успешно вышли из системы!');
        navigate('/'); // Редирект на главную страницу
    };

    return (
        <div>
            <h2>Выход</h2>
            <button onClick={handleLogout}>Выйти</button>
        </div>
    );
};

export default Logout;