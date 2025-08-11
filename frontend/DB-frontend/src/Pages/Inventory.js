import React, { useState } from "react";
import InventoryNotes from "../components/InventoryNotes";


const Inventory = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("");
  const [minQty, setMinQty] = useState("");

  const handleAddItem = () => {
    if (!name || !quantity || !type || !minQty) return;
    const newItem = {
      id: Date.now(),
      name,
      quantity: parseInt(quantity),
      type,
      minQty: parseInt(minQty),
    };
    setItems([newItem, ...items]);
    setName("");
    setQuantity("");
    setType("");
    setMinQty("");
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📦 Inventory Management</h2>

      <div style={styles.formCard}>
        <input
          style={styles.input}
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Minimum Required Quantity"
          value={minQty}
          onChange={(e) => setMinQty(e.target.value)}
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Available Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Type (e.g., Medicine, Material)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        <button onClick={handleAddItem} style={styles.addButton}>
          ➕ Add Item
        </button>
      </div>

      <div style={styles.tableWrapper}>
        {items.length === 0 ? (
          <p style={styles.empty}>No items in inventory. Add something!</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Type</th>
                <th>Req Qty</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.type}</td>
                  <td>{item.minQty}</td>
                  <td>
                    {item.quantity < item.minQty ? (
                      <span style={styles.lowStock}>⚠️ Low Stock</span>
                    ) : (
                      <span style={styles.okStock}>✔️ OK</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={styles.deleteButton}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Inventory Notes Component here */}
      <InventoryNotes />
    </div>
  );
};

const styles = {
  container: { padding: "30px", maxWidth: "1000px", margin: "auto" },
  heading: {
    textAlign: "center",
    fontSize: "2rem",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  formCard: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "30px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    flex: "1",
    minWidth: "200px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#2a97c9ff",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  empty: { textAlign: "center", color: "#888" },
  lowStock: { color: "red", fontWeight: "bold" },
  okStock: { color: "green" },
  deleteButton: {
    backgroundColor: "#f44336",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
};

export default Inventory;
