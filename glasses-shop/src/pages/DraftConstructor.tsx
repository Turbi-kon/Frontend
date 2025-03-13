import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface DraftService {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface UserRequest {  // Интерфейс для заявки пользователя
    id: number;
    status: string;
    created_at: string;
}

const DraftConstructor: React.FC = () => {
    const [draftServices, setDraftServices] = useState<DraftService[]>([]);
    const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
    const [showRequests, setShowRequests] = useState(false);  // Контроль показа заявок
    const navigate = useNavigate();


    useEffect(() => {
        const storedDraft = localStorage.getItem('draftServices');
        if (storedDraft) {
            setDraftServices(JSON.parse(storedDraft));
        }
    }, []);


    const handleRemoveService = (serviceId: number) => {
        const updatedServices = draftServices.filter((s) => s.id !== serviceId);
        setDraftServices(updatedServices);
        localStorage.setItem('draftServices', JSON.stringify(updatedServices));
    };


    const handleClearAll = () => {
        setDraftServices([]);
        localStorage.removeItem('draftServices');
    };


    const handleSubmitDraft = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Вы не авторизованы!');
                return;
            }

            await axios.post('/api/draft/submit/', 
                { services: draftServices },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert('Черновик успешно создан!');
            setDraftServices([]);
            localStorage.removeItem('draftServices');
        } catch (error) {
            console.error('Ошибка при отправке черновика:', error);
            alert('Ошибка при отправке черновика.');
        }
    };


    const handleShowRequests = async () => { 
        try { 
          const token = localStorage.getItem('token'); 
          if (!token) { 
            alert('Вы не авторизованы!'); 
            return; 
          } 
      
          const response = await axios.get('/api/requests/', { 
            headers: { Authorization: `Bearer ${token}` }, 
          });
      

          setUserRequests(response.data);
          setShowRequests(!showRequests);
        } catch (error) { 
          console.error('Ошибка при получении заявок:', error); 
          alert('Ошибка при получении заявок.'); 
        } 
      };

    return (
        <div>
            <h1>Конструктор заявки</h1>
            {draftServices.length > 0 ? (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Цена</th>
                                <th>Количество</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {draftServices.map((service) => (
                                <tr key={service.id}>
                                    <td>
                                        {/*Кликабельность*/}
                                        <span
                                            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                                            onClick={() => navigate(`/services/${service.id}`)}
                                        >
                                            {service.name}
                                        </span>
                                    </td>
                                    <td>${service.price}</td>
                                    <td>{service.quantity}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleRemoveService(service.id)}>
                                            Удалить
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="button-container">
                        <Button variant="success" onClick={handleSubmitDraft}>
                            Подтвердить заявку
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleClearAll}
                            className="ms-2 delete-all-btn"
                        >
                            Удалить всё
                        </Button>
                    </div>
                </>
            ) : (
                <p>Черновик пуст. Добавьте услуги.</p>
            )}

            {/*"Посмотреть мои заявки" */}
            <Button variant="info" onClick={handleShowRequests} className="mt-4">
                {showRequests ? "Скрыть заявки" : "Посмотреть мои заявки"}
            </Button>

            {/*Таблица заявок*/}
            {showRequests && (
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>ID заявки</th>
                            <th>Статус</th>
                            <th>Дата создания</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userRequests.length > 0 ? (
                            userRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{request.status}</td>
                                    <td>{new Date(request.created_at).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center">Нет заявок</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default DraftConstructor;
