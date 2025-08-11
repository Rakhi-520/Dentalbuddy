import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedRole, setEditedRole] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data.map((r) => r.name)))
      .catch((err) => {
        console.error("Error fetching roles:", err);
        alert("⚠️ Could not load roles");
      });
  }, []);

  const handleAddRole = async () => {
    const trimmed = newRole.trim();
    if (!trimmed || roles.includes(trimmed)) {
      alert("Enter a unique role name.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setRoles([...roles, trimmed]);
      setNewRole("");
      alert("✅ Role added successfully");
    } catch (err) {
      alert("❌ Failed to add role: " + err.message);
    }
  };

  const handleDeleteRole = async (roleName) => {
    if (!window.confirm(`Are you sure to delete "${roleName}"?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/roles/${roleName}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setRoles(roles.filter((r) => r !== roleName));
      alert("✅ Role deleted successfully");
    } catch (err) {
      alert("❌ Failed to delete role: " + err.message);
    }
  };

  const handleEditRole = async (oldName) => {
    if (!editedRole.trim() || roles.includes(editedRole.trim())) {
      alert("Enter a unique role name.");
      return;
    }

    try {
      await handleDeleteRole(oldName);
      setNewRole(editedRole);
      await handleAddRole();
      setEditIndex(null);
      setEditedRole("");
    } catch (err) {
      alert("❌ Error updating role: " + err.message);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        🏷️ Role Management
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="New Role"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddRole}>
          Add Role
        </Button>
      </Box>

      <List>
        {roles.map((role, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => setEditIndex(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDeleteRole(role)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </>
            }
          >
            {editIndex === index ? (
              <TextField
                value={editedRole}
                onChange={(e) => setEditedRole(e.target.value)}
                onBlur={() => handleEditRole(role)}
                autoFocus
              />
            ) : (
              <ListItemText primary={role} />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RoleManagement;



