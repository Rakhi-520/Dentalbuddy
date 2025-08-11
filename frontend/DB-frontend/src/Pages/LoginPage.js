import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [role, setRole] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [showAdminBox, setShowAdminBox] = useState(false);
  const [showUserBox, setShowUserBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (!role) {
      alert('Please select a role');
      return;
    }

    if (role.toLowerCase() === 'admin') {
      setShowAdminBox(true);
    } else {
      setShowUserBox(true);
    }
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok || data.role?.toLowerCase() !== role.toLowerCase()) {
        alert(data.message || 'Invalid credentials or role mismatch');
        return;
      }

      // Store user in localStorage
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({
          token: data.token,
          name: data.name,
          role: data.role,
          idNumber: data.idNumber,
          permissions: data.permissions,
        })
      );

      navigate('/home');
    } catch (error) {
      setLoading(false);
      alert('Server error during login.');
    }
  };

  const handleAdminLogin = () => {
    if (!adminPassword) {
      alert('Please enter admin password');
      return;
    }

    handleLogin({ role: 'admin', password: adminPassword });
  };

  const handleUserLogin = () => {
    if (!idNumber) {
      alert('Please enter your ID number');
      return;
    }

    handleLogin({ role, idNumber });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Select Your Role</h2>

      <div className="login-box">
        <select
          className="login-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">-- Choose Role --</option>
          <option value="Admin">Admin</option>
          <option value="Doctor">Doctor</option>
          <option value="Dental Assistant">Dental Assistant</option>
          <option value="Office Staff">Office Staff</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Manager">Manager</option>
          <option value="Lab Worker">Lab Worker</option>
          <option value="Finance Manager">Finance Manager</option>
        </select>

        <button
          onClick={handleLoginClick}
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Please wait...' : 'Login'}
        </button>
      </div>

      {/* Admin Login Modal */}
      {showAdminBox && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>🔐 Admin Login</h3>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="password-input"
            />
            <div className="modal-actions">
              <button onClick={handleAdminLogin} className="login-button">
                Login
              </button>
              <button
                onClick={() => setShowAdminBox(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Login Modal */}
      {showUserBox && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>👤 Login with ID Number</h3>
            <input
              type="text"
              placeholder="Enter ID Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="password-input"
            />
            <div className="modal-actions">
              <button onClick={handleUserLogin} className="login-button">
                Login
              </button>
              <button
                onClick={() => setShowUserBox(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
