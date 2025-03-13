import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequests } from '../features/requestsSlice';
import { AppDispatch } from '../store';

const RequestsList: React.FC = () => {
    const { requests, status, error } = useSelector((state: any) => state.requests);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchRequests());
    }, [dispatch]);

    if (status === 'loading') return <p>Загрузка...</p>;
    if (status === 'failed') return <p>Ошибка: {error}</p>;

    return (
        <div>
            <h2>Мои заявки</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Статус</th>
                        <th>Дата создания</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req: any) => (
                        <tr key={req.id}>
                            <td>{req.id}</td>
                            <td>{req.status}</td>
                            <td>{req.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RequestsList;
