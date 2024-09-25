import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import TeamManagement from './TeamManagement';
import UserManagement from './UserManagement';
import ActivityManagement from './ActivityManagement';
import JournalManagement from './JournalManagement';
import './App.css'; // Убедитесь, что стили подключены

const App = () => {
  return (
      <>
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

        {/* Footer находится за пределами контейнера */}
        <footer className="footer">
          <div className="footer-links">
            <a href="https://github.com/DmitryGaydabura/JenkinsTest" target="_blank" rel="noopener noreferrer">
              Backend GitHub Repository
            </a>
            <a href="https://github.com/DmitryGaydabura/front-jenkins-react" target="_blank" rel="noopener noreferrer">
              Frontend GitHub Repository
            </a>
          </div>
        </footer>
      </>
  );
};

export default App;
