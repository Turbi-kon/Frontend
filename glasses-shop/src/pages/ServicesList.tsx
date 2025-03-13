import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Breadcrumbs from '../components/Breadcrumbs';



interface Service {
    id: number;
    name: string;
    price: number;
    image?: string;
}

interface DraftService {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const ServicesList: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [filters, setFilters] = useState({ name: '', minPrice: '', maxPrice: '' });
    const navigate = useNavigate(); // Хук для навигации

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async (query = '') => {
        try {
            const response = await fetch(`/api/services/${query}`);
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Ошибка при получении услуг:', error);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Обновляем фильтры
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const applyFilters = async () => {
        // Формируем строку запроса на основе фильтров
        const query = new URLSearchParams(
            Object.entries(filters).filter(([_, value]) => value !== '')
        ).toString();

        // Выполняем запрос с фильтрами
        fetchServices(query ? `?${query}` : '');
    };

    const handleCardClick = (id: number) => {
        navigate(`/services/${id}`); // Переход на страницу деталей услуги
    };

    const handleAddToDraft = (service: Service) => {
        const storedDraft = localStorage.getItem('draftServices');
        const draftServices: DraftService[] = storedDraft ? JSON.parse(storedDraft) : [];
    
        const existing = draftServices.find((s) => s.id === service.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            draftServices.push({ ...service, quantity: 1 });
        }
    
        localStorage.setItem('draftServices', JSON.stringify(draftServices));
    
        console.log("Сохранённые услуги в localStorage:", JSON.parse(localStorage.getItem('draftServices') || '[]'));  // 🔍 Логируем сохранённые данные
        alert('Услуга добавлена в черновик!');
    };

    return (
        <Container>
            <h1 className="text-center">Список услуг</h1>
            {/* Фильтры */}
            <Form className="search-form">
                <Row>
                    <Col>
                        <Form.Control
                            className="filter-input search"  // Класс для поиска
                            type="text"
                            placeholder="Поиск по названию"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            className="filter-input price"  // Класс для цен
                            type="number"
                            placeholder="Минимальная цена"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            className="filter-input price"  // Класс для цен
                            type="number"
                            placeholder="Максимальная цена"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                        />
                    </Col>
                    <Col>
                        <Button onClick={applyFilters}>Применить</Button>
                    </Col>
                </Row>
            </Form>


            {/* Список карточек */}
            <Row className="card-container">
                {services.map((service) => (
                    <Col key={service.id} md={4}>
                        <Card
                            className="card"
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Img
                                variant="top"
                                src={
                                    service.image
                                        ? `http://localhost:8000/${service.image}`
                                        : 'https://via.placeholder.com/150'
                                }
                                alt={service.name}
                                className="card-img-top"
                            />
                            <Card.Body className="card-body">
                                <Card.Title className="card-title">{service.name}</Card.Title>
                                <Card.Text className="card-text">Цена: ₽{service.price}</Card.Text>
                                <div className="d-flex justify-content-between">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleCardClick(service.id)}
                                    >
                                        Подробнее
                                    </Button>
                                    <Button
                                        variant="success"
                                        onClick={() => handleAddToDraft(service)}
                                    >
                                        Добавить в черновик
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ServicesList;