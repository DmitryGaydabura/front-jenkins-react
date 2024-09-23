import React, { useState } from 'react';
import TeamList from './TeamList';
import AddParticipant from './AddParticipant';
import PairGenerator from './PairGenerator';

const TeamManagement = () => {
  const [refreshKey, setRefreshKey] = useState(0);  // Для обновления списка участников

  const handleAddParticipant = () => {
    setRefreshKey((oldKey) => oldKey + 1);  // Обновляем список участников
  };

  const handleParticipantDeleted = () => {
    setRefreshKey((oldKey) => oldKey + 1);  // Обновляем список после удаления
  };

  return (
      <div className="row">
        <div className="col-md-6">
          <TeamList team="blue" onParticipantDeleted={handleParticipantDeleted} key={`blue-${refreshKey}`} />
          <AddParticipant team="blue" onAdd={handleAddParticipant} />
        </div>
        <div className="col-md-6">
          <TeamList team="yellow" onParticipantDeleted={handleParticipantDeleted} key={`yellow-${refreshKey}`} />
          <AddParticipant team="yellow" onAdd={handleAddParticipant} />
        </div>
        <div className="mt-4 text-center">
          <PairGenerator />
        </div>
      </div>
  );
};

export default TeamManagement;
