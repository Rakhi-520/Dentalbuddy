import { useState } from 'react';
// import { useUserRole } from '../../context/UserRoleContext';
import './PatientForm.css';

const PatientFormA = () => {
  // const { role } = useUserRole();

  const [formData, setFormData] = useState({
    opNumber: '',
    name: '',
    age: '',
    gender: '',
    maritalStatus: '',
    phone: '',
    address: '',
    referredBy: '',
    date: '',
    dentistName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Section A Submitted:', formData);
    // Add axios POST here if needed
  };

  return (
    <div className="form-container">
      <h1>Dental OP Case Sheet</h1>
        <h2>SECTION - A</h2>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="form-row">
            <label>OP Number:
              <input
                type="text"
                name="opNumber"
                value={formData.opNumber}
                onChange={handleChange}
              />
            </label>
            <label>Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-row">
            <label>Age:
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </label>
            <label>Gender:
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">--Select--</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <label>Marital Status:
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
            >
              <option value="">--Select--</option>
              <option>Single</option>
              <option>Married</option>
            </select>
          </label>

          <div className="form-row">
            <label>Phone:
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </label>
            <label>Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-row">
            <label>Referred By:
              <select
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
              >
                <option value="">--Select--</option>
                <option>Self</option>
                <option>Doctor</option>
                <option>Family/Friend</option>
                <option>Online</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </label>

            <label>Dentist Name:
              <input
                type="text"
                name="dentistName"
                value={formData.dentistName}
                onChange={handleChange}
              />
            </label>
          </div>
        </fieldset>

        <div className="button-align-right">
          <button type="submit">Save Patient Record</button>
        </div>
      </form>
    </div>
  );
};

export default PatientFormA;
