import React, { useState, useEffect } from 'react';
import api from './api';

const PairGenerator = () => {
  const [pairs, setPairs] = useState([]);
  const [blueTeam, setBlueTeam] = useState({});
  const [yellowTeam, setYellowTeam] = useState({});
  const [error, setError] = useState(null);

  // Функция для генерации пар
  const generatePairs = async () => {
    try {
      const response = await api.post('/api/participants/generate-pairs');
      const fullPairs = response.data.slice(0, Math.min(response.data.length, Object.keys(blueTeam).length, Object.keys(yellowTeam).length));
      setPairs(fullPairs);  // Устанавливаем только полное количество пар
      setError(null);
    } catch (error) {
      console.error('Error generating pairs:', error);
      setError('Не удалось сгенерировать пары. Пожалуйста, попробуйте снова.');
    }
  };

  // Функция для получения участников команды blue
  const fetchBlueTeam = async () => {
    try {
      const response = await api.get('/api/participants?team=blue');
      const blueMap = response.data.reduce((acc, participant) => {
        acc[participant.id] = participant.name;
        return acc;
      }, {});
      setBlueTeam(blueMap);  // Сохраняем участников команды blue
      setError(null);
    } catch (error) {
      console.error('Error fetching blue team:', error);
      setError('Не удалось загрузить участников команды blue. Пожалуйста, попробуйте снова.');
    }
  };

  // Функция для получения участников команды yellow
  const fetchYellowTeam = async () => {
    try {
      const response = await api.get('/api/participants?team=yellow');
      const yellowMap = response.data.reduce((acc, participant) => {
        acc[participant.id] = participant.name;
        return acc;
      }, {});
      setYellowTeam(yellowMap);  // Сохраняем участников команды yellow
      setError(null);
    } catch (error) {
      console.error('Error fetching yellow team:', error);
      setError('Не удалось загрузить участников команды yellow. Пожалуйста, попробуйте снова.');
    }
  };

  useEffect(() => {
    fetchBlueTeam();
    fetchYellowTeam();
  }, []);

  return (
      <div>
        <h3>Generate Pairs</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-primary mb-3" onClick={generatePairs}>
          Generate Pairs
        </button>

        {pairs.length > 0 ? (
            <table className="table table-striped">
              <thead>
              <tr>
                <th>Blue Participant</th>
                <th>Yellow Participant</th>
              </tr>
              </thead>
              <tbody>
              {pairs.map((pair, index) => (
                  <tr key={index}>
                    <td>{blueTeam[pair.blueParticipantId] || 'Unknown'}</td>
                    <td>{yellowTeam[pair.yellowParticipantId] || 'Unknown'}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        ) : (
            <div>No pairs generated yet.</div>
        )}
      </div>
  );
};

export default PairGenerator;
