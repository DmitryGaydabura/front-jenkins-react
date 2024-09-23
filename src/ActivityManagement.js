import React, { useEffect, useState } from 'react';
import api from './api';

const ActivityManagement = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ description: '', userId: '' });
  const [chatId, setChatId] = useState('');  // Для отправки отчета в Telegram
  const [email, setEmail] = useState('');    // Для отправки отчета на почту

  const fetchActivities = async () => {
    try {
      const response = await api.get('/api/activities/');
      setActivities(response.data);  // Устанавливаем активность в состояние
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    fetchActivities();  // Загружаем данные при первом рендере
  }, []);

  // Функция для добавления новой активности
  const handleAddActivity = async () => {
    try {
      await api.post('/api/activities/', newActivity);
      fetchActivities();  // Обновляем список после добавления
      setNewActivity({ description: '', userId: '' });
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  // Функция для удаления активности
  const handleDeleteActivity = async (id) => {
    try {
      await api.delete(`/api/activities/${id}`);
      fetchActivities();  // Обновляем список после удаления
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  // Функция для отправки отчета в Telegram
  const handleSendTelegramReport = async () => {
    try {
      await api.post('/api/telegram/send', { chatId });
      alert('Report sent to Telegram successfully');
    } catch (error) {
      console.error('Error sending report to Telegram:', error);
      alert('Failed to send report to Telegram');
    }
  };

  // Функция для отправки отчета на email
  const handleSendEmailReport = async () => {
    try {
      await api.post('/api/email/send', { email });
      alert('Report sent to email successfully');
    } catch (error) {
      console.error('Error sending report to email:', error);
      alert('Failed to send report to email');
    }
  };

  return (
      <div>
        <h3>Add New Activity</h3>
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
                    <td>{activity.firstName} {activity.lastName}</td>
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
