import React, { useState, useEffect } from "react";

const InventoryNotes = () => {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [showNotes, setShowNotes] = useState(false);


  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/inventory-notes/all");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  };

  const handleSubmit = async () => {
    if (!message) return;
    try {
      const res = await fetch("/api/inventory-notes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, author }),
      });
      if (res.ok) {
        setMessage("");
        setAuthor("");
        fetchNotes(); // Refresh the list
      }
    } catch (err) {
      console.error("Failed to add note", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (noteId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this note?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/inventory-notes/delete/${noteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchNotes(); // Refresh the notes list after deletion
    } else {
      console.error("Failed to delete note");
    }
  } catch (err) {
    console.error("Error deleting note", err);
  }
};



  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📩 Important Notes to Admin </h2>

      <div style={styles.formCard}>
        <input
          style={styles.input}
          placeholder="Your Name (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          style={{ ...styles.input, height: "100px" }}
          placeholder="Write your message to Admin..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSubmit} style={styles.addButton}>
          📤 Submit Note
        </button>
      </div>

    <div>
  <button onClick={() => setShowNotes(!showNotes)} style={styles.dropdownButton}>
    {showNotes ? "🔽 Hide Submitted Notes" : "📝 Show Submitted Notes"}
  </button>

  {showNotes && (
    <>
      <h3 style={styles.subHeading}>Submitted Notes</h3>
      {notes.length === 0 ? (
        <p style={styles.empty}>No notes yet.</p>
      ) : (
        <ul style={styles.notesList}>
          {notes.map((note) => (
            <li key={note._id} style={styles.noteItem}>
              <strong>{note.author || "Anonymous"}:</strong> {note.message}
              <div style={styles.timestamp}>
                {new Date(note.createdAt).toLocaleString()}
              </div>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(note._id)}
              >
                ❌ Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )}
</div>


    </div>
  );
};

const styles = {
  container: { padding: "20px",maxWidth: "800px",margin: "auto",display: "flex",flexDirection: "column",gap: "20px", fontFamily: "Segoe UI, sans-serif" },
  heading: { textAlign: "center", fontSize: "2rem", marginBottom: "20px", color: "#34495e" },
  subHeading: { marginTop: "30px", marginBottom: "10px", color: "#2c3e50" },
  formCard: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" },
  input: { padding: "12px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc", width: "100%", boxSizing: "border-box" },
  addButton: { padding: "10px 20px", backgroundColor: "#2a97c9ff", color: "white", fontSize: "16px", border: "none", borderRadius: "5px", cursor: "pointer" },
  notesList: { listStyle: "none", padding: 0 },
  noteItem: { backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px", marginBottom: "10px" },
  empty: { color: "#888", fontStyle: "italic" },
  timestamp: { fontSize: "0.8rem", color: "#999", marginTop: "5px" },
  dropdownButton: {padding: "10px 20px",backgroundColor: "#2a97c9ff",color: "white",fontSize: "16px",border: "none",borderRadius: "6px",cursor: "pointer",marginBottom: "10px",fontWeight: "500"},
  deleteButton: { marginTop: "10px",backgroundColor: "#2a97c9ff",color: "white",border: "none",padding: "8px 14px",borderRadius: "6px",cursor: "pointer",fontSize: "14px",fontWeight: "500",transition: "background-color 0.3s ease" },

};

export default InventoryNotes;
