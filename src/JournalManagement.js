import React, { useEffect, useState } from 'react';
import api from './api';  // Импорт axios или другого HTTP-клиента для взаимодействия с сервером

const JournalManagement = () => {
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState({ firstName: '', lastName: '' });
  const [dates, setDates] = useState([]);  // Список дат (столбцы)
  const [scores, setScores] = useState({});  // Оценки участников по датам

  // Получить всех участников
  const fetchParticipants = async () => {
    try {
      const response = await api.get('/api/journal/participants');
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const fetchScores = async () => {
    try {
      const response = await api.get('/api/journal/scores');  // GET-запрос на сервер
      const loadedScores = {};  // Сохранить оценки
      const loadedDates = new Set();  // Для уникальных дат

      response.data.forEach((scoreEntry) => {
        const { participantId, date, score } = scoreEntry;

        // Форматирование даты без сдвигов (например, используя строку, а не объект Date)
        const dateObj = new Date(date);
        const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

        if (!loadedScores[participantId]) {
          loadedScores[participantId] = {};
        }
        loadedScores[participantId][formattedDate] = score;

        loadedDates.add(formattedDate);  // Добавляем форматированную дату
      });

      setScores(loadedScores);
      setDates(Array.from(loadedDates));  // Преобразуем Set в массив и обновляем даты
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };


  // Добавить нового участника
  const handleAddParticipant = async () => {
    if (newParticipant.firstName && newParticipant.lastName) {
      try {
        await api.post('/api/journal/participants', newParticipant);
        fetchParticipants(); // Обновить список участников
        setNewParticipant({ firstName: '', lastName: '' }); // Очистить форму
      } catch (error) {
        console.error('Error adding participant:', error);
      }
    } else {
      alert("Имя и фамилия обязательны для добавления участника.");
    }
  };

  // Добавить новую дату
  const addDate = (newDate) => {
    if (!dates.includes(newDate)) {
      setDates([...dates, newDate]); // Добавить дату в список
    }
  };

  // Удалить дату
  const removeDate = async (dateToRemove) => {
    try {
      const formattedDate = new Date(dateToRemove).toISOString().split('T')[0];

      const response = await api.delete(`http://13.60.104.170:8080/myapp/api/journal/scores/delete`, {
        params: { date: formattedDate }
      });

      if (response.status === 200) {
        setDates(dates.filter(date => date !== dateToRemove));
        const updatedScores = { ...scores };

        participants.forEach((participant) => {
          if (updatedScores[participant.id] && updatedScores[participant.id][dateToRemove]) {
            delete updatedScores[participant.id][dateToRemove];
          }
        });

        setScores(updatedScores);
      } else {
        console.error('Ошибка при удалении даты на сервере', response);
      }
    } catch (error) {
      console.error('Ошибка при удалении даты:', error);
    }
  };

  // Обновить или добавить оценку и автоматически сохранить её
  const handleAddScore = async (participantId, date, score) => {
    try {
      const updatedScores = { ...scores };
      if (!updatedScores[participantId]) {
        updatedScores[participantId] = {};
      }
      updatedScores[participantId][date] = score;
      setScores(updatedScores);  // Обновляем состояние оценок

      // Сразу сохраняем оценку на сервере
      await api.post('http://13.60.104.170:8080/myapp/api/journal/participants/score', {
        participantId,
        score,
        date
      });

    } catch (error) {
      console.error('Ошибка при сохранении оценки:', error);
    }
  };

  useEffect(() => {
    fetchParticipants(); // Получить участников при загрузке компонента
    fetchScores();       // Получить оценки при загрузке компонента
  }, []);

  return (
      <div>
        <h3>Добавить нового участника</h3>
        <div className="input-group mb-3">
          <input
              type="text"
              className="form-control"
              value={newParticipant.firstName}
              onChange={(e) => setNewParticipant({ ...newParticipant, firstName: e.target.value })}
              placeholder="Имя"
          />
          <input
              type="text"
              className="form-control"
              value={newParticipant.lastName}
              onChange={(e) => setNewParticipant({ ...newParticipant, lastName: e.target.value })}
              placeholder="Фамилия"
          />
          <button className="btn btn-primary" onClick={handleAddParticipant}>
            Добавить участника
          </button>
        </div>

        <h3>Добавить новую дату</h3>
        <div className="mb-3">
          <input
              type="date"
              className="form-control"
              onChange={(e) => addDate(e.target.value)}
              placeholder="Введите дату"
          />
        </div>

        <h3>Журнал оценок</h3>
        <table className="table table-striped table-hover">
          <thead>
          <tr>
            <th>Имя</th>
            <th>Фамилия</th>
            {dates.map((date) => (
                <th key={date}>
                  {date}
                  <button
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => removeDate(date)}
                  >
                    Удалить
                  </button>
                </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {participants.map((participant) => (
              <tr key={participant.id}>
                <td>{participant.firstName}</td>
                <td>{participant.lastName}</td>
                {dates.map((date) => (
                    <td key={date}>
                      <input
                          type="number"
                          className="form-control"
                          value={scores[participant.id]?.[date] || ''}
                          onChange={(e) => handleAddScore(participant.id, date, e.target.value)}
                          placeholder="Введите оценку"
                      />
                    </td>
                ))}
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default JournalManagement;
