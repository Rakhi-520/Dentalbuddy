import React, { useState, useEffect } from "react";
import axios from "axios";

const DentalDiary = () => {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editText, setEditText] = useState("");

  const API_URL = "http://localhost:5000/api/diary";

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(API_URL);
      setEntries(res.data);
    } catch (err) {
      console.error("Error fetching entries:", err);
    }
  };

  const handleAddEntry = async () => {
    if (text.trim() === "") return;
    try {
      const res = await axios.post(API_URL, {
        content: text,
        date: new Date().toLocaleString(),
      });
      setEntries([res.data, ...entries]);
      setText("");
    } catch (err) {
      console.error("Error adding entry:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setEntries(entries.filter((entry) => entry._id !== id));
      setSelectedEntry(null);
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${API_URL}/${selectedEntry._id}`, {
        content: editText,
        date: selectedEntry.date,
      });
      setEntries(
        entries.map((entry) =>
          entry._id === res.data._id ? res.data : entry
        )
      );
      setSelectedEntry(null);
      setEditText("");
    } catch (err) {
      console.error("Error saving entry:", err);
    }
  };

  const openModal = (entry) => {
    setSelectedEntry(entry);
    setEditText(entry.content);
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setEditText("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 Admin's Dental Diary</h2>

      <div style={styles.inputCard}>
        <textarea
          style={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your thoughts, daily cases, or notes..."
        />
        <button onClick={handleAddEntry} style={styles.addButton}>
          ➕ Add Entry
        </button>
      </div>

      <div style={styles.cardWrapper}>
        {entries.map((entry) => (
          <div key={entry._id} style={styles.noteCard} onClick={() => openModal(entry)}>
            <p style={styles.date}>{entry.date}</p>
            <p style={styles.preview}>
              {entry.content.slice(0, 60)}{entry.content.length > 60 ? "..." : ""}
            </p>
          </div>
        ))}
      </div>

      {selectedEntry && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>📝 Edit Note</h3>
            <textarea
              style={styles.modalTextarea}
              rows={10}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <p style={styles.date}>{selectedEntry.date}</p>
            <div style={styles.modalActions}>
              <button onClick={handleSave} style={styles.saveButton}>
                💾 Save
              </button>
              <button
                onClick={() => handleDelete(selectedEntry._id)}
                style={styles.deleteButton}
              >
                🗑️ Delete
              </button>
              <button onClick={closeModal} style={styles.cancelButton}>
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "20px",
  },
  heading: {
    textAlign: "center",
    fontSize: "2rem",
    color: "#0077cc",
    marginBottom: "20px",
  },
  inputCard: {
    backgroundColor: "#f5faff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    resize: "vertical",
  },
  addButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#0077cc",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cardWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "flex-start",
  },
  noteCard: {
    backgroundColor: "#fff9c4",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "280px",
    cursor: "pointer",
  },
  date: {
    fontSize: "12px",
    color: "#555",
    marginBottom: "10px",
  },
  preview: {
    fontSize: "14px",
    color: "#333",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "600px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
  },
  modalTitle: {
    fontSize: "1.5rem",
    marginBottom: "15px",
    color: "#333",
  },
  modalTextarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },
  saveButton: {
    backgroundColor: "white",
    border: "2px solid #4caf50",
    padding: "10px 15px",
    color: "#4caf50",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "white",
    border: "2px solid #f44336",
    padding: "10px 15px",
    color: "#f44336",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "white",
    border: "2px solid #999",
    padding: "10px 15px",
    color: "#555",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default DentalDiary;
