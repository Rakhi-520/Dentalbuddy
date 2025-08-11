import React, { useState } from 'react';
import '../App.css';

const defaultAccess = {
    nurse: {
    patientRecords: true,
    appointments: true,
    aiAssistant: false,
    finance: false,
    inventory: false,
    lab: false,
    illustrations: false,
    notes: false,
  },
  front: {
    appointments: true,
    patientRecords: false,
    aiAssistant: false,
    finance: false,
    inventory: false,
    lab: false,
    illustrations: false,
    notes: false,
  },
  accountant: {
    finance: true,
    patientRecords: false,
    appointments: false,
    inventory: false,
    lab: false,
    aiAssistant: false,
    illustrations: false,
    notes: false,
  },
  lab: {
    lab: true,
    illustrations: true,
    patientRecords: false,
    appointments: false,
    finance: false,
    aiAssistant: false,
    inventory: false,
    notes: false,
  },
  manager: {
    appointments: true,
    finance: true,
    inventory: true,
    patientRecords: false,
    lab: false,
    aiAssistant: false,
    illustrations: false,
    notes: false,
  },
};

const PageAccessConfig = () => {
  const [access, setAccess] = useState(
    JSON.parse(localStorage.getItem('pageAccess')) || defaultAccess
  );

  const handleToggle = (role, page) => {
    const updated = {
      ...access,
      [role]: {
        ...access[role],
        [page]: !access[role][page],
      },
    };
    setAccess(updated);
    localStorage.setItem('pageAccess', JSON.stringify(updated));
  };

  const renderToggles = (role) => (
    <div className="role-section">
      <h3>{role.toUpperCase()}</h3>
      {Object.keys(access[role]).map((page) => (
        <label key={page}>
          <input
            type="checkbox"
            checked={access[role][page]}
            onChange={() => handleToggle(role, page)}
          />
          {page}
        </label>
      ))}
    </div>
  );

  return (
    <div className="page-access-container">
      <h2>🔐 Page Access Configuration</h2>
      <p>Select which pages should be accessible for each role</p>
      <div className="roles-wrapper">
        {renderToggles('assistant')}
        {renderToggles('lab')}
      </div>
    </div>
  );
};

export default PageAccessConfig;
