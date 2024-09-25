import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import TeamManagement from './TeamManagement';
import UserManagement from './UserManagement';
import ActivityManagement from './ActivityManagement';
import JournalManagement from './JournalManagement';  // Импортируем компонент JournalManagement

const App = () => {
  return (
      <div className="container mt-5">
        <h1 className="text-center mb-5">Management Dashboard</h1>
        <Tabs defaultActiveKey="journal" id="management-tabs" className="mb-3">
          <Tab eventKey="journal" title="Journal Management">
            <JournalManagement />
          </Tab>
          <Tab eventKey="team" title="Team Management">
            <TeamManagement />
          </Tab>
          <Tab eventKey="user" title="User Management">
            <UserManagement />
          </Tab>
          <Tab eventKey="activity" title="Activity Management">
            <ActivityManagement />
          </Tab>
        </Tabs>
      </div>
  );
};

export default App;
