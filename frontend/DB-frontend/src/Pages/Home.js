import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../context/UserRoleContext';
import Navbar from '../components/Navbar'; 
import './Home.css';

import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ImageIcon from '@mui/icons-material/Image';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const Home = () => {
  const navigate = useNavigate();
  const { role } = useUserRole();
  const safeRole = role?.toLowerCase() || 'assistant';

  const [showNotifications, setShowNotifications] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [inventoryNotes, setInventoryNotes] = useState([]);
  const [patientNotes, setPatientNotes] = useState([]);

  // Fetch notes from backend (Inventory + Patient)
  useEffect(() => {
    const fetchInventoryNotes = async () => {
      const res = await fetch("/api/inventory-notes/all");
      const data = await res.json();
      setInventoryNotes(data);
    };
    const fetchPatientNotes = async () => {
      const res = await fetch("/api/patient-notes/all");
      const data = await res.json();
      setPatientNotes(data);
    };

    fetchInventoryNotes();
    fetchPatientNotes();
  }, []);

  const toggleSection = (section) => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  const handleClearAll = async () => {
    await fetch("/api/inventory-notes/clear", { method: "DELETE" });
    await fetch("/api/patient-notes/clear", { method: "DELETE" });
    setInventoryNotes([]);
    setPatientNotes([]);
  };

  const sections = [
    {
      key: 'patient-records',
      title: 'Patient Records',
      notes: patientNotes,
      icon: '🦷'
    },
    {
      key: 'inventory',
      title: 'Inventory',
      notes: inventoryNotes,
      icon: '📦'
    }
  ];

  const allLinks = [
    {
      title: 'Patient Records',
      route: '/patient-records',
      icon: <MedicalServicesIcon fontSize="large" style={{ color: '#0077b6' }} />
    },
    {
      title: 'Appointments',
      route: '/appointments',
      icon: <EventAvailableIcon fontSize="large" style={{ color: '#0077b6' }} />
    },
    {
      title: 'Dental Assistant',
      route: '/dental-assistant',
      icon: <SmartToyIcon fontSize="large" style={{ color: '#0077b6' }} />
    },
    {
      title: 'Finance & Billing',
      route: '/finance',
      icon: <AttachMoneyIcon fontSize="large" style={{ color: '#0077b6' }} />
    },
    {
      title: 'Inventory Management',
      route: '/stock',
      icon: <Inventory2Icon fontSize="large" style={{ color: '#0077b6' }} />
    },
    {
      title: 'Lab Records',
      route: '/lab-records',
      icon: (
        <img
          src={require('../assets/tooth-icon.png')}
          alt="Tooth Icon"
          style={{
            width: 40,
            height: 40,
            filter: 'invert(37%) sepia(94%) saturate(506%) hue-rotate(169deg) brightness(96%) contrast(91%)',
          }}
        />
      ),
    },
    {
      title: 'Illustrations',
      route: '/illustrations',
      icon: <ImageIcon fontSize="large" style={{ color: '#0077b6' }} />
    },
    {
      title: 'Dental Diary',
      route: '/notes',
      icon: <MenuBookIcon fontSize="large" style={{ color: '#0077b6' }} />
    },
    {
      title: 'Access Settings',
      route: '/config',
      icon: <SettingsIcon fontSize="large" style={{ color: '#0077b6' }} />
    },
  ];

  return (
    <div className="home-container">
      {/* 🔔 Beautiful Unified Notification Card */}
      {safeRole === 'admin' && (patientNotes.length > 0 || inventoryNotes.length > 0) && (
        <div style={{
          backgroundColor: '#ffffffff',
          border: '1px solid #ffffffff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <h2 style={{ color: '#d35400',fontSize:22, margin: 0 }}>
              🔔 Important Notifications
            </h2>
            {showNotifications ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>

          {showNotifications && (
            <>
              <div style={{ marginTop: '15px' }}>
                {sections.map((section) => (
                  <div key={section.key} style={{ marginBottom: '15px' }}>
                    <div
                      onClick={() => toggleSection(section.key)}
                      style={{
                        backgroundColor: '#cfedefff',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        color: '#6e2c00',
                        cursor: 'pointer',
                      }}
                    >
                      {section.icon} {section.title}
                      {openSection === section.key ? ' ▲' : ' ▼'}
                    </div>

                    {openSection === section.key && section.notes.length > 0 && (
                      <ul style={{
                        listStyle: 'none',
                        paddingLeft: '10px',
                        marginTop: '10px'
                      }}>
                        {section.notes.map((note) => (
                          <li key={note._id} style={{
                            backgroundColor: '#ffffff',
                            borderLeft: '4px solid #0077b6',
                            marginBottom: '10px',
                            padding: '10px',
                            borderRadius: '6px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                          }}>
                            <strong>{note.author || 'Anonymous'}:</strong> {note.message}
                            <br />
                            <small style={{ color: '#888' }}>
                              {new Date(note.createdAt).toLocaleString()}
                            </small>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleClearAll}
                style={{
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                <DeleteSweepIcon style={{ marginRight: '6px' }} />
                Clear All
              </button>
            </>
          )}
        </div>
      )}

     

      {/* Navigation Cards */}
      <div className="quick-links">
        {allLinks.map((link, idx) => (
          <div
            key={idx}
            className="card"
            onClick={() => navigate(link.route)}
          >
            <div style={{ marginBottom: '0.5rem' }}>{link.icon}</div>
            <h3>{link.title}</h3>
            <button
              style={{
                backgroundColor: '#0d8ca6',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '10px',
                width: '90px',
                alignSelf: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'background-color 0.3s ease'
              }}
            >
              Go
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
