import { useState } from 'react';
import './PatientList.css';
import { FaSearch } from 'react-icons/fa';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    opNumber: '', name: '', age: '', gender: '', phone: '', address: '',
    date: '', referredBy: '', maritalStatus: '', medicalHistory: '',
    dentistName: '', visitType: 'New'
  });

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewSubmit = (e) => {
    e.preventDefault();
    const saved = { ...newPatient, id: Date.now() };
    setPatients((prev) => [...prev, saved]);
    setNewPatient({
      opNumber: '', name: '', age: '', gender: '', phone: '', address: '',
      date: '', referredBy: '', maritalStatus: '', medicalHistory: '',
      dentistName: '', visitType: 'New'
    });
    setShowForm(false);
  };

  const handleSearchClick = () => {
    setSearchClicked(true);
  };

  const filteredPatients = patients.filter((p) =>
    p.opNumber.includes(searchTerm) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <div className="patient-list-container">
      <h2>Patient List</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by OP No, Name, or Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearchClick}>
          <FaSearch />
        </button>
      </div>

      {/* Toggle Form */}
      <button className="toggle-form-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? '− Close Patient Intake Form' : '+ Add New Patient'}
      </button>

      {/* New Patient Form */}
      {showForm && (
        <form onSubmit={handleNewSubmit} className="new-patient-form">
          <input name="opNumber" placeholder="OP Number" value={newPatient.opNumber} onChange={handleNewChange} required />
          <input name="name" placeholder="Name" value={newPatient.name} onChange={handleNewChange} required />
          <input name="age" placeholder="Age" value={newPatient.age} onChange={handleNewChange} required />
          <select name="gender" value={newPatient.gender} onChange={handleNewChange} required>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input name="phone" placeholder="Phone" value={newPatient.phone} onChange={handleNewChange} required />
          <input name="address" placeholder="Address" value={newPatient.address} onChange={handleNewChange} required />
          <input name="date" type="date" value={newPatient.date} onChange={handleNewChange} required />
          <input name="referredBy" placeholder="Referred By" value={newPatient.referredBy} onChange={handleNewChange} />
          <select name="maritalStatus" value={newPatient.maritalStatus} onChange={handleNewChange}>
            <option value="">Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
          <input name="medicalHistory" placeholder="Medical History" value={newPatient.medicalHistory} onChange={handleNewChange} />
          <input name="dentistName" placeholder="Doctor Name" value={newPatient.dentistName} onChange={handleNewChange} />
          <select name="visitType" value={newPatient.visitType} onChange={handleNewChange}>
            <option value="New">New</option>
            <option value="Revisit">Revisit</option>
          </select>
          <button type="submit">Add Patient</button>
        </form>
      )}

      {/* Patient Table */}
    
      <table className="patient-table">
        <thead>
          <tr>
            <th>OP No</th><th>Name</th><th>Age</th><th>Phone</th><th>Visit</th><th>Doctor</th><th>Details</th>
          </tr>
        </thead>
        <tbody>
          {(searchClicked ? filteredPatients : patients).map((p) => (
            <tr key={p.id}>
              <td>{p.opNumber}</td>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.phone}</td>
              <td>{p.visitType}</td>
              <td>{p.dentistName}</td>
              <td><button onClick={() => alert('Go to PatientForm with ID: ' + p.id)}>Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
