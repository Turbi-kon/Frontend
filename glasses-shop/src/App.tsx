import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import ServicesList from './pages/ServicesList';
import ServiceDetail from './pages/ServiceDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import DraftConstructor from './pages/DraftConstructor';
import RequestsList from './pages/RequestsList';
import './App.css';

import { refreshAccessToken } from './features/tokenUtils';

const App: React.FC = () => {
    useEffect(() => {
        const intervalId = setInterval(() => {
            refreshAccessToken();
        }, 240000); // 4 минуты

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Router>
            <NavigationBar />
            <div className="container">
                <Routes>
                    {/* Главная страница */}
                    <Route path="/" element={<h1>Добро пожаловать!</h1>} />

                    {/* Услуги */}
                    <Route path="/services" element={<ServicesList />} />
                    <Route path="/services/:id" element={<ServiceDetail />} />
                    <Route path="/draft/" element={<DraftConstructor />} />

                    {/* Авторизация и регистрация */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;
