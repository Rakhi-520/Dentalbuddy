import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CaseSheetViewer.css';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/${id}`);
        setPatient(response.data);
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (section, value) => {
    setPatient(prev => {
      const list = prev[section] || [];
      return {
        ...prev,
        [section]: list.includes(value)
          ? list.filter(item => item !== value)
          : [...list, value],
      };
    });
  };

  const handleOrthoChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({
      ...prev,
      orthoProfile: {
        ...prev.orthoProfile,
        [name]: value
      }
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/patients/${id}`, patient);
      alert('Patient updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update patient.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!patient) return <div className="details-container">Loading...</div>;

  return (
    <div className="details-container">
      <h2>Patient Details</h2>

      {/* Basic Info */}
      <div className="details-field">
        <label>Name:</label>
        <input type="text" name="name" value={patient.name || ''} onChange={handleChange} disabled={!isEditing} />
      </div>
      <div className="details-field">
        <label>Age:</label>
        <input type="number" name="age" value={patient.age || ''} onChange={handleChange} disabled={!isEditing} />
      </div>
      <div className="details-field">
        <label>Gender:</label>
        <input type="text" name="gender" value={patient.gender || ''} onChange={handleChange} disabled={!isEditing} />
      </div>

      {/* Chief Complaint */}
      <fieldset>
        <legend>Chief Complaint</legend>
        {['Tooth Pain', 'Swelling', 'Bleeding Gums', 'Sensitivity', 'Bad Breath', 'Tooth Missing', 'Cosmetic Issue'].map(cc => (
          <label key={cc}>
            <input
              type="checkbox"
              checked={patient.chiefComplaint?.includes(cc)}
              onChange={() => handleCheckboxChange('chiefComplaint', cc)}
              disabled={!isEditing}
            />
            {cc}
          </label>
        ))}
      </fieldset>

      {/* Medical History */}
      <fieldset>
        <legend>Medical History</legend>
        {['None', 'Diabetes', 'Hypertension', 'Kidney Disease', 'Heart Disease', 'Cancer', 'Asthma', 'Bleeding Disorders'].map(mh => (
          <label key={mh}>
            <input
              type="checkbox"
              checked={patient.medicalHistory?.includes(mh)}
              onChange={() => handleCheckboxChange('medicalHistory', mh)}
              disabled={!isEditing}
            />
            {mh}
          </label>
        ))}
        <label>Allergies:
          <input type="text" name="allergies" value={patient.allergies || ''} onChange={handleChange} disabled={!isEditing} />
        </label>
        <label>Medications:
          <input type="text" name="medications" value={patient.medications || ''} onChange={handleChange} disabled={!isEditing} />
        </label>
      </fieldset>

      {/* Dental History */}
      <fieldset>
        <legend>Dental History</legend>
        {['First Visit', 'RCT', 'Extraction', 'Filling', 'Scaling', 'Crown/Denture'].map(dh => (
          <label key={dh}>
            <input
              type="checkbox"
              checked={patient.dentalHistory?.includes(dh)}
              onChange={() => handleCheckboxChange('dentalHistory', dh)}
              disabled={!isEditing}
            />
            {dh}
          </label>
        ))}
      </fieldset>

      {/* Investigations */}
      <fieldset>
        <legend>Investigations</legend>
        {['IOPA X-Ray', 'OPG', 'CBCT', 'Pulp Vitality Test'].map(test => (
          <label key={test}>
            <input
              type="checkbox"
              checked={patient.investigations?.includes(test)}
              onChange={() => handleCheckboxChange('investigations', test)}
              disabled={!isEditing}
            />
            {test}
          </label>
        ))}
      </fieldset>

      {/* Diagnosis */}
      <fieldset>
        <legend>Diagnosis</legend>
        <textarea
          name="diagnosis"
          value={patient.diagnosis || ''}
          onChange={handleChange}
          disabled={!isEditing}
          rows={3}
        />
      </fieldset>

      {/* Treatment Plan */}
      <fieldset>
        <legend>Treatment Plan</legend>
        {['Scaling', 'Extraction', 'RCT', 'Filling', 'Crown / Bridge', 'Denture', 'Consultation', 'Implant', 'Cosmetic correction'].map(tp => (
          <label key={tp}>
            <input
              type="checkbox"
              checked={patient.treatmentPlan?.includes(tp)}
              onChange={() => handleCheckboxChange('treatmentPlan', tp)}
              disabled={!isEditing}
            />
            {tp}
          </label>
        ))}
      </fieldset>

      {/* Ortho Profile */}
      <fieldset>
        <legend>Ortho Profile</legend>
        <label>Facial Profile:
          <select name="facialProfile" value={patient.orthoProfile?.facialProfile || ''} onChange={handleOrthoChange} disabled={!isEditing}>
            <option value="">--Select--</option>
            <option>Straight</option>
            <option>Convex</option>
            <option>Concave</option>
          </select>
        </label>
        <label>Lip Competency:
          <select name="lipCompetency" value={patient.orthoProfile?.lipCompetency || ''} onChange={handleOrthoChange} disabled={!isEditing}>
            <option value="">--Select--</option>
            <option>Competent</option>
            <option>Incompetent</option>
          </select>
        </label>
        <label>Overjet:
          <input type="text" name="overjet" value={patient.orthoProfile?.overjet || ''} onChange={handleOrthoChange} disabled={!isEditing} />
        </label>
        <label>Overbite:
          <input type="text" name="overbite" value={patient.orthoProfile?.overbite || ''} onChange={handleOrthoChange} disabled={!isEditing} />
        </label>
        <label>Habits:</label>
        {['Thumb Sucking', 'Mouth Breathing', 'None'].map(habit => (
          <label key={habit}>
            <input
              type="checkbox"
              checked={patient.orthoProfile?.habits?.includes(habit)}
              onChange={() => {
                const updatedHabits = patient.orthoProfile?.habits?.includes(habit)
                  ? patient.orthoProfile.habits.filter(h => h !== habit)
                  : [...(patient.orthoProfile?.habits || []), habit];
                setPatient(prev => ({
                  ...prev,
                  orthoProfile: { ...prev.orthoProfile, habits: updatedHabits }
                }));
              }}
              disabled={!isEditing}
            />
            {habit}
          </label>
        ))}
        <label>Molar Relation:
          <select name="molarRelation" value={patient.orthoProfile?.molarRelation || ''} onChange={handleOrthoChange} disabled={!isEditing}>
            <option value="">--Select--</option>
            <option>Class I</option>
            <option>Class II</option>
            <option>Class III</option>
          </select>
        </label>
        <label>Crossbite:
          <select name="crossbite" value={patient.orthoProfile?.crossbite || ''} onChange={handleOrthoChange} disabled={!isEditing}>
            <option value="">--Select--</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </label>
        <label>Openbite:
          <select name="openbite" value={patient.orthoProfile?.openbite || ''} onChange={handleOrthoChange} disabled={!isEditing}>
            <option value="">--Select--</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </label>
      </fieldset>

      {/* Prescription */}
      <fieldset>
        <legend>Prescription</legend>
        {patient.prescriptions?.map((prescription, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Drug Name"
              value={prescription.drugName}
              disabled={!isEditing}
              onChange={(e) => {
                const newList = [...patient.prescriptions];
                newList[index].drugName = e.target.value;
                setPatient(prev => ({ ...prev, prescriptions: newList }));
              }}
            />
            <input
              type="text"
              placeholder="Dosage"
              value={prescription.dosage}
              disabled={!isEditing}
              onChange={(e) => {
                const newList = [...patient.prescriptions];
                newList[index].dosage = e.target.value;
                setPatient(prev => ({ ...prev, prescriptions: newList }));
              }}
            />
            <input
              type="text"
              placeholder="Duration"
              value={prescription.duration}
              disabled={!isEditing}
              onChange={(e) => {
                const newList = [...patient.prescriptions];
                newList[index].duration = e.target.value;
                setPatient(prev => ({ ...prev, prescriptions: newList }));
              }}
            />
          </div>
        ))}
      </fieldset>

      {/* Department & Dentist */}
      <fieldset>
        <legend>Department & Dentist</legend>
        {['Pedodontics', 'Orthodontics', 'Conservative Dentistry', 'Periodontics', 'Oral Surgery', 'Prosthodontics', 'Oral Medicine & Radiology', 'Endodontics'].map(dept => (
          <label key={dept}>
            <input
              type="checkbox"
              checked={patient.department?.includes(dept)}
              onChange={() => handleCheckboxChange('department', dept)}
              disabled={!isEditing}
            />
            {dept}
          </label>
        ))}
        <label>Dentist Name:
          <input type="text" name="dentistName" value={patient.dentistName || ''} onChange={handleChange} disabled={!isEditing} />
        </label>
      </fieldset>

      {/* Buttons */}
      <div className="details-buttons">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        ) : (
          <>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        )}
        <button onClick={() => navigate('/patients')}>Back</button>
      </div>
    </div>
  );
};

export default PatientDetails;
