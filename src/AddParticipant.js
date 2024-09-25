import React, { useState } from 'react';
import api from './api';

const AddParticipant = ({ team, onAdd }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleAddParticipant = async () => {
    if (!name) {
      setError('Имя участника обязательно.');
      return;
    }

    try {
      await api.post('/api/participants', { name, team });
      setName('');  // Очищаем поле после успешного добавления
      onAdd();  // Сообщаем родителю об обновлении
      setError(null);
    } catch (error) {
      console.error('Error adding participant:', error);
      setError('Не удалось добавить участника. Пожалуйста, попробуйте снова.');
    }
  };

  return (
      <div className="input-group mb-3">
        <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Participant Name"
        />
        <button className="btn btn-primary" onClick={handleAddParticipant}>
          Add Participant
        </button>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>
  );
};

export default AddParticipant;
