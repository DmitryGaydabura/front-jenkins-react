import React, { useEffect, useState } from 'react';
import api from './api';

const JournalManagement = () => {
  const [participants, setParticipants] = useState([]);
  const [dates, setDates] = useState([]);  // Список дат (столбцы)
  const [scores, setScores] = useState({});  // Оценки участников по датам
  const [error, setError] = useState(null); // Для сообщений об ошибках

  // Создаем массив вариантов для выпадающего списка (0, 0.5, ..., 6, 'N')
  const scoreOptions = [...Array(13).keys()].map(i => (i * 0.5).toString());
  scoreOptions.push('N');

  // Получить участников команд Blue и Yellow
  const fetchParticipants = async () => {
    try {
      const blueResponse = await api.get('/api/participants?team=blue');
      const yellowResponse = await api.get('/api/participants?team=yellow');
      setParticipants([...blueResponse.data, ...yellowResponse.data]);
      setError(null);
    } catch (error) {
      console.error('Error fetching participants:', error);
      setError('Не удалось загрузить участников. Пожалуйста, попробуйте снова.');
    }
  };

  // Получить все оценки
  const fetchScores = async () => {
    try {
      const response = await api.get('/api/journal/scores');
      const loadedScores = {};
      const loadedDates = new Set();

      response.data.forEach((scoreEntry) => {
        const { participantId, date, score } = scoreEntry;
        const formattedDate = formatDateToYYYYMMDD(date);

        if (!loadedScores[participantId]) {
          loadedScores[participantId] = {};
        }
        loadedScores[participantId][formattedDate] = {
          value: score.toString(),
          isSaved: true
        };
        loadedDates.add(formattedDate);
      });

      setScores(loadedScores);
      setDates(Array.from(loadedDates));
      setError(null);
    } catch (error) {
      console.error('Error fetching scores:', error);
      setError('Не удалось загрузить оценки. Пожалуйста, попробуйте снова.');
    }
  };

  const addDate = (newDate) => {
    if (!newDate) return;
    const formattedDate = formatDateToYYYYMMDD(newDate);

    if (dates.includes(formattedDate)) return;
    setDates([...dates, formattedDate]);
  };

  // Удалить дату и связанные с ней оценки
  const removeDate = async (dateToRemove) => {
    const formattedDate = formatDateToYYYYMMDD(dateToRemove);

    if (!window.confirm(`Вы уверены, что хотите удалить оценки за ${formattedDate}?`)) return;

    try {
      const response = await api.delete(`/api/journal/scores/delete?date=${formattedDate}`);

      if (response.status === 200) {
        setDates(dates.filter(date => date !== dateToRemove));
        const updatedScores = { ...scores };
        participants.forEach(participant => {
          if (updatedScores[participant.id]) {
            delete updatedScores[participant.id][formattedDate];
          }
        });
        setScores(updatedScores);
        setError(null);
      } else {
        console.error('Ошибка при удалении даты на сервере', response);
        setError('Не удалось удалить дату. Пожалуйста, попробуйте снова.');
      }
    } catch (error) {
      console.error('Ошибка при удалении даты:', error);
      setError('Не удалось удалить дату. Пожалуйста, попробуйте снова.');
    }
  };

  // Обновить или добавить оценку локально
  const handleScoreChange = (participantId, date, score) => {
    setScores(prevScores => ({
      ...prevScores,
      [participantId]: {
        ...prevScores[participantId],
        [date]: {
          value: score,
          isSaved: false
        }
      }
    }));
  };

  // Функция для преобразования даты в формат YYYY-MM-DD
  const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Месяцы начинаются с 0, добавляем 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;  // Возвращаем дату в формате YYYY-MM-DD
  };

  const handleSaveScore = async (participantId, date) => {
    try {
      let scoreObj = scores[participantId][date];
      let score = scoreObj.value;

      if (score === null || score === undefined || score === '') {
        setError('Оценка не может быть пустой.');
        return;
      }

      // Если score не "N", пытаемся преобразовать в число
      if (score !== 'N') {
        score = parseFloat(score);
        if (isNaN(score)) {
          setError('Некорректное значение оценки.');
          return;
        }
      }

      // Сохранение на сервере
      await api.post('/api/journal/scores', {
        participantId: parseInt(participantId, 10),
        score: score,
        date: date
      });

      // Обновляем состояние, помечая оценку как сохраненную
      setScores(prevScores => ({
        ...prevScores,
        [participantId]: {
          ...prevScores[participantId],
          [date]: {
            ...prevScores[participantId][date],
            isSaved: true
          }
        }
      }));

      setError(null);
    } catch (error) {
      console.error('Ошибка при сохранении оценки:', error);
      setError('Не удалось сохранить оценку. Пожалуйста, попробуйте снова.');
    }
  };

  // Проверка, нужно ли блокировать поле для редактирования
  const isFieldDisabled = (participantId, date) => {
    return scores[participantId]?.[date]?.isSaved || false;
  };

  useEffect(() => {
    fetchParticipants(); // Получаем участников при загрузке компонента
    fetchScores();       // Получаем оценки при загрузке компонента
  }, []);

  // Вычисляем сумму баллов для каждого участника
  const totalScores = participants.reduce((totals, participant) => {
    let total = 0;
    const participantScores = scores[participant.id];
    if (participantScores) {
      Object.values(participantScores).forEach(scoreObj => {
        let score = scoreObj.value;
        if (score === 'N') {
          score = 0;
        } else {
          score = parseFloat(score);
          if (isNaN(score)) {
            score = 0;
          }
        }
        total += score;
      });
    }
    totals[participant.id] = total;
    return totals;
  }, {});

  return (
      <div>
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
        {error && <div className="alert alert-danger">{error}</div>}
        <table className="table table-striped table-hover">
          <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Команда</th>
            <th>Сумма баллов</th> {/* Новый столбец */}
            {dates.map(date => (
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
          {participants.map(participant => (
              <tr key={participant.id}>
                <td>{participant.id}</td>
                <td>{participant.name}</td>
                <td>
                <span
                    style={{
                      backgroundColor: participant.team === 'blue' ? '#1E90FF' : '#FFD700',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px'
                    }}
                >
                  {participant.team.charAt(0).toUpperCase() + participant.team.slice(1)}
                </span>
                </td>
                <td>{totalScores[participant.id]}</td> {/* Отображаем сумму баллов */}
                {dates.map(date => (
                    <td key={date}>
                      <div className="input-group">
                        <select
                            className="form-select"
                            value={scores[participant.id]?.[date]?.value || ''}
                            onChange={(e) => handleScoreChange(participant.id, date, e.target.value)}
                            disabled={isFieldDisabled(participant.id, date)}
                        >
                          <option value="" disabled>Выберите оценку</option>
                          {scoreOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                          ))}
                        </select>

                        {/* Кнопка "Save" отображается, только если поле не заблокировано и оценка не сохранена */}
                        {!isFieldDisabled(participant.id, date) && (
                            <button
                                className="btn btn-primary"
                                onClick={() => handleSaveScore(participant.id, date)}
                            >
                              Save
                            </button>
                        )}
                      </div>
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
