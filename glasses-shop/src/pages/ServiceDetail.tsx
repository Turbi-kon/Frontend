import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';

interface Service {
    id: number;
    name: string;
    price: number;
    image?: string;
    description?: string;
}

const ServiceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [service, setService] = useState<Service | null>(null);

    useEffect(() => {
        fetchService();
    }, []);

    const fetchService = async () => {
        try {
            const response = await fetch(`/api/services/${id}/`);
            const data = await response.json();
            setService(data);
        } catch (error) {
            console.error('Ошибка при получении услуги:', error);
        }
    };

    if (!service) return <div>Загрузка...</div>;

    return (
        <Container>
            {/* Навигационная цепочка */}
            <Breadcrumbs
                paths={[
                    { label: 'Главная', url: '/' },
                    { label: 'Услуги', url: '/services' },
                    { label: service.name },
                ]}
            />

            {/* Карточка с деталями услуги */}
            <Card>
                <Card.Img
                    variant="top"
                    src={service.image ? `http://localhost:8000/${service.image}` : 'https://via.placeholder.com/150'}
                    alt={service.name}
                />
                <Card.Body>
                    <Card.Title>{service.name}</Card.Title>
                    <Card.Text>Цена: ₽{service.price}</Card.Text>
                    <Card.Text>{service.description || 'Описание отсутствует'}</Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ServiceDetail;