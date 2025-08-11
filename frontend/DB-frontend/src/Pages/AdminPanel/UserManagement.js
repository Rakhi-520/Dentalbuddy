import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const allPermissions = [
  "patient-records",
  "appointments",
  "finance",
  "billing",
  "lab-records",
  "inventory",
  "admin-panel",
];

const UserManagement = () => {
  const dropdownRefs = useRef({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/roles")
    .then((res) => res.json())
    .then((data) => {
      const roleNames = data.map((r) => r.name);
      setRoles(roleNames);
    })
    .catch((err) => {
      console.error("Failed to load roles:", err);
      alert("⚠️ Could not load roles from backend.");
    });
}, []);

  const [newRole, setNewRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        const mappedUsers = data.map((user) => ({
          empId: user.idNumber,
          name: user.name,
          role: user.role,
          permissions: user.permissions,
          showDropdown: false,
          isEditing: false,
        }));

        mappedUsers.sort((a, b) => a.empId.localeCompare(b.empId, undefined, { numeric: true }));

        const finalUsers = mappedUsers.map((user, index) => ({
          ...user,
          id: index + 1,
        }));

        setUsers(finalUsers);
        localStorage.setItem("userList", JSON.stringify(finalUsers));
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        alert("⚠️ Could not load users from backend.");
      });

    const handleClickOutside = (e) => {
      setUsers((prev) =>
        prev.map((user) => {
          const ref = dropdownRefs.current[user.id];
          if (ref && !ref.contains(e.target)) {
            return { ...user, showDropdown: false };
          }
          return user;
        })
      );
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / rowsPerPage);

  const handleChange = (id, field, value) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, [field]: value } : user))
    );
  };

  const handleTogglePermission = (id, perm) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== id) return user;
        const updated = user.permissions.includes(perm)
          ? user.permissions.filter((p) => p !== perm)
          : [...user.permissions, perm];
        return { ...user, permissions: updated };
      })
    );
  };

  const handleSave = async (user) => {
    if (!user.empId || !user.name || !user.role) {
      alert("Please complete all fields before saving.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          role: user.role,
          idNumber: user.empId,
          permissions: user.permissions,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Saved to database: ${user.name}`);
      } else {
        alert(`❌ Failed to save: ${data.message}`);
      }
    } catch (error) {
      alert("❌ Server error while saving user");
    }

    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, isEditing: false, showDropdown: false } : u
    );

    setUsers(updatedUsers);
    localStorage.setItem("userList", JSON.stringify(updatedUsers));

    const allAccess = JSON.parse(localStorage.getItem("pageAccess")) || {};
    allAccess[user.role.toLowerCase()] = user.permissions.reduce((acc, perm) => {
      acc[perm] = true;
      return acc;
    }, {});
    localStorage.setItem("pageAccess", JSON.stringify(allAccess));
  };

  const handleAddRow = () => {
    const newUser = {
      id: Date.now(),
      empId: "",
      name: "",
      role: "",
      permissions: [],
      showDropdown: false,
      isEditing: true,
    };
    setUsers([...users, newUser]);
  };

  const toggleDropdown = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, showDropdown: !u.showDropdown }
          : { ...u, showDropdown: false }
      )
    );
  };

  const toggleEdit = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, isEditing: true } : { ...u, showDropdown: false }
      )
    );
  };

  const handleDelete = async (id) => {
    const userToDelete = users.find((u) => u.id === id);
    if (!userToDelete) return;

    if (window.confirm(`Are you sure you want to delete ${userToDelete.name}?`)) {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/users/delete/${userToDelete.empId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          alert(`❌ Failed to delete from server: ${data.message}`);
          setLoading(false);
          return;
        }

        alert("✅ User deleted successfully");

        const res = await fetch("http://localhost:5000/api/users");
        const usersData = await res.json();

        const refreshed = usersData.map((user, index) => ({
          id: index + 1,
          empId: user.idNumber,
          name: user.name,
          role: user.role,
          permissions: user.permissions,
          showDropdown: false,
          isEditing: false,
        }));

        setUsers(refreshed);
        localStorage.setItem("userList", JSON.stringify(refreshed));
        setLoading(false);
      } catch (error) {
        alert("❌ Server error while deleting");
        console.error(error);
        setLoading(false);
      }
    }
  };

  const handleAddRole = () => {
    const trimmed = newRole.trim();
    if (trimmed && !roles.includes(trimmed)) {
      const updated = [...roles, trimmed];
      setRoles(updated);
      localStorage.setItem("roleList", JSON.stringify(updated));
      setNewRole("");
    } else {
      alert("Enter a unique role name.");
    }
  };

  const handleDeleteRole = async (roleToDelete) => {
  if (!window.confirm(`Delete the role "${roleToDelete}"?`)) return;

  try {
    const res = await fetch(`http://localhost:5000/api/roles/${roleToDelete}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(`❌ Failed to delete role: ${data.message}`);
      return;
    }

    // Refresh roles after deletion
    const updated = roles.filter((r) => r !== roleToDelete);
    setRoles(updated);
    alert("✅ Role deleted successfully");
  } catch (err) {
    console.error("Error deleting role:", err);
    alert("❌ Server error while deleting role");
  }
};


  return (
    <Box p={3}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        👥 User Management
      </Typography>
      
      <Box display="flex" justifyContent="flex-end" mb={2}>
  <Link to="/admin-panel/roles" style={{ textDecoration: 'none' }}>
    <Button variant="outlined" sx={{ borderRadius: 2 }}>➕ Manage Roles</Button>
  </Link>
</Box>


      {loading && <p style={{ color: "blue" }}>⏳ Loading...</p>}

      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.isEditing ? (
                  <input
                    type="text"
                    placeholder="Employee ID"
                    value={user.empId}
                    onChange={(e) => handleChange(user.id, "empId", e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  user.empId
                )}</TableCell>
                <TableCell>{user.isEditing ? (
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={user.name}
                    onChange={(e) => handleChange(user.id, "name", e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  user.name
                )}</TableCell>
                <TableCell>{user.isEditing ? (
                  <select
                    value={user.role}
                    onChange={(e) => handleChange(user.id, "role", e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                ) : (
                  user.role
                )}</TableCell>
                <TableCell>{user.isEditing ? (
                  <div style={{ position: "relative" }} ref={(el) => (dropdownRefs.current[user.id] = el)}>
                    <input
                      type="text"
                      readOnly
                      value={user.permissions.join(", ")}
                      placeholder="Select permissions"
                      onClick={() => toggleDropdown(user.id)}
                      style={{ ...inputStyle, cursor: "pointer" }}
                    />
                    {user.showDropdown && (
                      <div style={dropdownStyle}>
                        {allPermissions.map((perm) => (
                          <label key={perm} style={{ display: "block", fontSize: "13px", marginBottom: "5px" }}>
                            <input
                              type="checkbox"
                              checked={user.permissions.includes(perm)}
                              onChange={() => handleTogglePermission(user.id, perm)}
                              style={{ marginRight: "6px" }}
                            />
                            {perm}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  user.permissions.join(", ")
                )}</TableCell>
                <TableCell>{user.isEditing ? (
                  <Box display="flex" gap={1}>
                    <Button variant="contained" size="small" onClick={() => handleSave(user)}>Save</Button>
                    <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(user.id)}>Delete</Button>
                  </Box>
                ) : (
                  <IconButton onClick={() => toggleEdit(user.id)}>
                    <EditIcon />
                  </IconButton>
                )}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box mt={2} display="flex" justifyContent="center" gap={1}>
          <Button variant="outlined" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Prev</Button>
          <Typography variant="body2" sx={{ mt: 1 }}>Page {currentPage} of {totalPages}</Typography>
          <Button variant="outlined" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
        </Box>

      </Paper>
    </Box>
  );
};

const inputStyle = {
  padding: "10px",
  width: "100%",
  fontSize: "14px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  lineHeight: "1.5",
  fontFamily: "inherit",
};

const dropdownStyle = {
  position: "absolute",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  padding: "10px",
  zIndex: 10,
  width: "100%",
  maxHeight: "160px",
  overflowY: "auto",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  borderRadius: "6px",
};

export default UserManagement;
