import React, { useEffect, useState } from 'react';
import api from './api';

const ActivityManagement = () => {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState({});
  const [newActivity, setNewActivity] = useState({ description: '', userId: '' });
  const [chatId, setChatId] = useState('');  // Для отправки отчета в Telegram
  const [email, setEmail] = useState('');    // Для отправки отчета на почту
  const [error, setError] = useState(null);  // Для сообщений об ошибках

  // Функция для получения списка всех пользователей
  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      // Преобразуем массив пользователей в объект для быстрого поиска по userId
      const usersMap = response.data.reduce((acc, user) => {
        acc[user.id] = `${user.firstName} ${user.lastName}`;
        return acc;
      }, {});
      setUsers(usersMap);  // Сохраняем пользователей
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Не удалось загрузить пользователей. Пожалуйста, попробуйте снова.');
    }
  };

  // Функция для получения всех активностей
  const fetchActivities = async () => {
    try {
      const response = await api.get('/api/activities');
      setActivities(response.data);  // Устанавливаем активности в состояние
      setError(null);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Не удалось загрузить активности. Пожалуйста, попробуйте снова.');
    }
  };

  // Загружаем пользователей и активности при первом рендере
  useEffect(() => {
    fetchUsers();
    fetchActivities();
  }, []);

  // Функция для добавления новой активности
  const handleAddActivity = async () => {
    if (!newActivity.description || !newActivity.userId) {
      setError('Описание и User ID обязательны.');
      return;
    }

    const activityToAdd = {
      ...newActivity,
      activityDate: new Date().toISOString()  // Добавляем дату активности, если нужно
    };

    try {
      await api.post('/api/activities', activityToAdd);
      fetchActivities();  // Обновляем список после добавления
      setNewActivity({ description: '', userId: '' });
      setError(null);
    } catch (error) {
      console.error('Error adding activity:', error);
      setError('Не удалось добавить активность. Пожалуйста, попробуйте снова.');
    }
  };

  // Функция для удаления активности
  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту активность?')) return;
    try {
      await api.delete('/api/activities', { params: { id } });
      fetchActivities();  // Обновляем список после удаления
      setError(null);
    } catch (error) {
      console.error('Error deleting activity:', error);
      setError('Не удалось удалить активность. Пожалуйста, попробуйте снова.');
    }
  };

  // Функция для отправки отчета в Telegram
  const handleSendTelegramReport = async () => {
    if (!chatId) {
      setError('Chat ID обязателен для отправки отчета в Telegram.');
      return;
    }
    try {
      await api.post('/api/telegram/send', { chatId });
      alert('Отчет успешно отправлен в Telegram');
      setError(null);
    } catch (error) {
      console.error('Error sending report to Telegram:', error);
      setError('Не удалось отправить отчет в Telegram.');
    }
  };

  // Функция для отправки отчета на email
  const handleSendEmailReport = async () => {
    if (!email) {
      setError('Email обязателен для отправки отчета.');
      return;
    }
    try {
      await api.post('/api/email/send', { email });
      alert('Отчет успешно отправлен на email');
      setError(null);
    } catch (error) {
      console.error('Error sending report to email:', error);
      setError('Не удалось отправить отчет на email.');
    }
  };

  return (
      <div>
        <h3>Add New Activity</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="input-group mb-3">
          <input
              type="text"
              className="form-control"
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              placeholder="Activity Description"
          />
          <input
              type="number"
              className="form-control"
              value={newActivity.userId}
              onChange={(e) => setNewActivity({ ...newActivity, userId: e.target.value })}
              placeholder="User ID"
          />
          <button className="btn btn-primary" onClick={handleAddActivity}>
            Add Activity
          </button>
        </div>

        <h3>Send Report to Telegram</h3>
        <div className="input-group mb-3">
          <input
              type="text"
              className="form-control"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Enter Chat ID"
          />
          <button className="btn btn-info" onClick={handleSendTelegramReport}>
            Send Report to Telegram
          </button>
        </div>

        <h3>Send Report to Email</h3>
        <div className="input-group mb-3">
          <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
          />
          <button className="btn btn-success" onClick={handleSendEmailReport}>
            Send Report to Email
          </button>
        </div>

        <h3>Activities List</h3>
        <table className="table table-striped table-hover">
          <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>User ID</th>
            <th>User Name</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {activities.length > 0 ? (
              activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.id}</td>
                    <td>{activity.description}</td>
                    <td>{activity.userId}</td>
                    <td>{users[activity.userId] || 'Unknown User'}</td> {/* Выводим имя пользователя */}
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteActivity(activity.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
              ))
          ) : (
              <tr>
                <td colSpan="5" className="text-center">No activities found</td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
  );
};

export default ActivityManagement;
