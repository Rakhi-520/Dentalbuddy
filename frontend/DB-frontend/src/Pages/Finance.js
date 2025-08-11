import React, { useState } from "react";

const Finance = () => {
  const [formData, setFormData] = useState({
    date: "",
    patientName: "",
    treatments: [],
    newTreatment: "",
    treatmentCharges: "",
    doctorFee: "",
    labCharges: "",
    otherExpenses: "",
  });

  const [availableTreatments, setAvailableTreatments] = useState([
    "Consultation", "Review", "Scaling", "Extraction", "Surgical Procedure",
    "RCT", "Filling", "Ortho", "FPD", "PD", "CD", "Others"
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const parseCurrency = (val) => Number((val || "").replace(/[^\d]/g, "") || 0);

  const totalExpenses = () =>
    parseCurrency(formData.labCharges) + parseCurrency(formData.otherExpenses);

  const totalProfit = () =>
    parseCurrency(formData.treatmentCharges) +
    parseCurrency(formData.doctorFee) -
    totalExpenses();

  const handleAddTreatment = (value) => {
    if (value === "Others") {
      setShowModal(true);
    } else if (value && !formData.treatments.includes(value)) {
      setFormData({
        ...formData,
        treatments: [...formData.treatments, value],
        newTreatment: "",
      });
    }
  };

  const handleDeleteTreatment = (index) => {
    const updated = [...formData.treatments];
    updated.splice(index, 1);
    setFormData({ ...formData, treatments: updated });
  };

  const handleSave = () => {
    const newRecord = {
      ...formData,
      id: editingId || Date.now(),
      totalExpenses: totalExpenses(),
      totalProfit: totalProfit(),
    };

    if (editingId) {
      setRecords(records.map((rec) => (rec.id === editingId ? newRecord : rec)));
    } else {
      setRecords([newRecord, ...records]);
    }

    setFormData({
      date: "",
      patientName: "",
      treatments: [],
      newTreatment: "",
      treatmentCharges: "",
      doctorFee: "",
      labCharges: "",
      otherExpenses: "",
    });
    setEditingId(null);
  };

  const handleEdit = (record) => {
    setFormData({ ...record });
    setEditingId(record.id);
  };

  const handleDelete = (id) => {
    setRecords(records.filter((rec) => rec.id !== id));
  };

  const handleAddOption = () => {
    if (newOption && !availableTreatments.includes(newOption)) {
      setAvailableTreatments([...availableTreatments, newOption]);
      setNewOption("");
    }
  };

  const handleDeleteOption = (opt) => {
    setAvailableTreatments(availableTreatments.filter((t) => t !== opt));
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "auto", padding: "30px" }}>
      <h2 style={{ textAlign: "center", color: "#0077b6" }}>💰 FINANCE & BILLING</h2>

      <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
        {/* Date */}
        <div style={row}><label style={label}>Date:</label>
          <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} style={input} />
        </div>

        {/* Patient Name */}
        <div style={row}><label style={label}>Patient Name:</label>
          <input value={formData.patientName} onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} style={input} />
        </div>

        {/* Treatment Done + Edit */}
        <div style={row}>
          <label style={label}>Treatment Done:</label>
          <select
            value={formData.newTreatment}
            onChange={(e) => {
              setFormData({ ...formData, newTreatment: e.target.value });
              handleAddTreatment(e.target.value);
            }}
            style={input}
          >
            <option value="">Select Treatment</option>
            {availableTreatments.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>
          <button onClick={() => setShowModal(true)} style={editBtn}>✏️</button>
        </div>

        {/* Selected Treatments */}
        {formData.treatments.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {formData.treatments.map((t, i) => (
              <li key={i} style={pill}>
                {t}
                <button onClick={() => handleDeleteTreatment(i)} style={delBtn}>❌</button>
              </li>
            ))}
          </ul>
        )}

        {/* Charges */}
        <div style={row}>
          <label style={label}>Treatment Charges:</label>
          <input
            type="text"
            placeholder="Rs."
            value={formData.treatmentCharges}
            onChange={(e) => setFormData({ ...formData, treatmentCharges: e.target.value })}
            style={input}
          />
        </div>

        <div style={row}>
          <label style={label}>Doctor's Consultation Fee:</label>
          <input
            type="text"
            placeholder="Rs."
            value={formData.doctorFee}
            onChange={(e) => setFormData({ ...formData, doctorFee: e.target.value })}
            style={input}
          />
        </div>

        <div style={row}>
          <label style={label}>Lab Charges:</label>
          <input
            type="text"
            placeholder="Rs."
            value={formData.labCharges}
            onChange={(e) => setFormData({ ...formData, labCharges: e.target.value })}
            style={input}
          />
        </div>

        <div style={row}>
          <label style={label}>Other Expenses:</label>
          <input
            type="text"
            placeholder="Rs."
            value={formData.otherExpenses}
            onChange={(e) => setFormData({ ...formData, otherExpenses: e.target.value })}
            style={input}
          />
        </div>

        {/* Totals */}
        <div style={{ textAlign: "center", fontWeight: "bold", marginTop: 10 }}>
          Total Expenses: ₹{totalExpenses()} &nbsp;&nbsp;&nbsp; Total Profit: ₹{totalProfit()}
        </div>

        {/* Save Button */}
        <button onClick={handleSave} style={saveBtn}>
          {editingId ? "💾 Update Record" : "💾 Save Record"}
        </button>
      </div>

      {/* Saved Records Table */}
      <hr style={{ margin: "40px 0" }} />
      <h3 style={{ textAlign: "center", color: "#0077cc" }}>📋 Saved Finance Records</h3>

      {records.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>No records yet.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
          <thead style={{ background: "#0077cc", color: "white" }}>
            <tr>
              <th>Date</th><th>Patient</th><th>Treatment</th><th>Treat. ₹</th><th>Doctor ₹</th><th>Lab ₹</th><th>Other ₹</th><th>Expense ₹</th><th>Profit ₹</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                <td>{rec.date}</td>
                <td>{rec.patientName}</td>
                <td>{rec.treatments.join(", ")}</td>
                <td>₹{rec.treatmentCharges}</td>
                <td>₹{rec.doctorFee}</td>
                <td>₹{rec.labCharges}</td>
                <td>₹{rec.otherExpenses}</td>
                <td>₹{rec.totalExpenses}</td>
                <td>₹{rec.totalProfit}</td>
                <td>
                  <button style={editBtn} onClick={() => handleEdit(rec)}>✏️</button>
                  <button style={delBtn} onClick={() => handleDelete(rec.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Editing Treatments */}
      {showModal && (
        <div style={modalBackdrop}>
          <div style={modalBox}>
            <h3>✏️ Edit Treatment Options</h3>
            <input
              style={input}
              placeholder="Enter new treatment"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
            <button style={addBtn} onClick={handleAddOption}>➕ Add</button>

            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {availableTreatments.map((t, i) => (
                <li key={i} style={pill}>
                  {t}
                  <button onClick={() => handleDeleteOption(t)} style={delBtn}>❌</button>
                </li>
              ))}
            </ul>

            <button onClick={() => setShowModal(false)} style={closeBtn}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Styles
const row = { display: "flex", alignItems: "center", gap: 10, marginBottom: 15 };
const label = { minWidth: "200px", fontWeight: "bold" };
const input = { flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" };
const editBtn = { backgroundColor: "#0077b6", color: "white", border: "none", padding: "6px 12px", borderRadius: "5px", cursor: "pointer" };
const delBtn = { backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "5px", padding: "4px 8px", marginLeft: "5px", cursor: "pointer" };
const saveBtn = { width: "100%", padding: "12px", backgroundColor: "#0077cc", color: "white", fontSize: "1rem", borderRadius: "6px", border: "none", cursor: "pointer", marginTop: "20px" };
const pill = { display: "inline-block", background: "#eee", padding: "6px 10px", borderRadius: "20px", margin: "4px" };
const modalBackdrop = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalBox = { background: "#fff", padding: "20px", borderRadius: "10px", width: "400px", maxHeight: "90vh", overflowY: "auto" };
const addBtn = { padding: "8px 12px", backgroundColor: "#0077b6", color: "white", border: "none", borderRadius: "5px", marginTop: "10px", cursor: "pointer" };
const closeBtn = { marginTop: "15px", padding: "8px 12px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" };

export default Finance;
