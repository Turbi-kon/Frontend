import React from 'react';
import { useSelector } from 'react-redux';
import { Navbar as NavBar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavigationBar: React.FC = () => {
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const user = useSelector((state: any) => state.auth.user);

    return (
        <NavBar bg="dark" variant="dark">
            <NavBar.Brand href="/">Онлайн-магазин очков</NavBar.Brand>
            <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Главная</Nav.Link>
                <Nav.Link as={Link} to="/services">Услуги</Nav.Link>
                {isAuthenticated && <Nav.Link as={Link} to="/draft">Конструктор заявки</Nav.Link>}
                {!isAuthenticated ? (
                    <>
                        <Nav.Link as={Link} to="/login">Вход</Nav.Link>
                        <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
                    </>
                ) : (
                    <>
                        <Nav.Link disabled>{user?.username}</Nav.Link>
                        <Nav.Link as={Link} to="/logout">Выход</Nav.Link>
                    </>
                )}
            </Nav>
        </NavBar>
    );
};

export default NavigationBar;