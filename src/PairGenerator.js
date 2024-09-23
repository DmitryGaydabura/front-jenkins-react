import React, { useState } from 'react';
import api from './api';

const PairGenerator = () => {
  const [pairs, setPairs] = useState([]);

  const handleGeneratePairs = async () => {
    try {
      const response = await api.get('/api/getPairs');
      setPairs(response.data);
    } catch (error) {
      console.error('Error generating pairs:', error);
    }
  };

  return (
      <div>
        <button onClick={handleGeneratePairs} className="btn btn-success mb-3">
          Generate Pairs
        </button>
        {pairs.length > 0 && (
            <ul className="list-group">
              {pairs.map((pair, index) => (
                  <li className="list-group-item" key={index}>
                    {pair.blueParticipant.name} (Blue) - {pair.yellowParticipant.name} (Yellow)
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
};

export default PairGenerator;
