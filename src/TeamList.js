import React, { useEffect, useState } from 'react';
import api from './api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Используем крестик для удаления

const TeamList = ({ team, onParticipantDeleted }) => {
  const [participants, setParticipants] = useState([]);

  const fetchParticipants = async () => {
    try {
      const response = await api.get(`/api/teams/${team}`);
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [team]);

  const handleDeleteParticipant = async (id) => {
    try {
      await api.delete(`/api/participants?id=${id}`);
      setParticipants(participants.filter((participant) => participant.id !== id));
      onParticipantDeleted();
    } catch (error) {
      console.error('Error deleting participant:', error);
    }
  };

  return (
      <div className="card mb-3 shadow">
        <div className={`card-header bg-${team === 'blue' ? 'primary' : 'warning'} text-white`}>
          <h3>{team.charAt(0).toUpperCase() + team.slice(1)} Team</h3>
        </div>
        <ul className="list-group list-group-flush">
          {participants.length > 0 ? participants.map((participant) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={participant.id}>
                {participant.name}
                <FontAwesomeIcon
                    icon={faTimes}
                    className="text-muted"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDeleteParticipant(participant.id)}
                />
              </li>
          )) : <li className="list-group-item">No participants found</li>}
        </ul>
      </div>
  );
};

export default TeamList;
