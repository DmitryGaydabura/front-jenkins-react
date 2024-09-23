import React, { useState } from 'react';
import api from './api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddParticipant = ({ team, onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/participants', { name, team });
      onAdd(response.data.participant);
      setName('');
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="input-group">
          <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Add participant to ${team}`}
              required
          />
          <button type="submit" className={`btn btn-${team === 'blue' ? 'primary' : 'warning'} ml-2`}>
            <FontAwesomeIcon icon={faPlus} /> Add
          </button>
        </div>
      </form>
  );
};

export default AddParticipant
