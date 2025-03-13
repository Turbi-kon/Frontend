import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice'; // Если у вас есть redux slice для авторизации
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/login/', {
                username,
                password,
            });

            const { access, refresh } = response.data;

            if (!access || !refresh) {
                alert('Ошибка: не получены токены');
                return;
            }

            // Сохраняем токены в localStorage
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);

            // Если используется Redux, можно обновить состояние авторизации
            dispatch(login({ username, role: 'user' }));

            alert('Вы успешно вошли в систему!');
            navigate('/services');
        } catch (error) {
            console.error('Ошибка входа:', error);
            alert('Ошибка входа. Попробуйте снова.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Авторизация</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default Login;
