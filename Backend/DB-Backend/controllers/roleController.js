import Role from '../models/Role.js';

// GET all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({});
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching roles', error: err.message });
  }
};

// ADD new role
export const addRole = async (req, res) => {
  try {
    const { name } = req.body;
    const exists = await Role.findOne({ name });

    if (exists) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    const role = new Role({ name });
    await role.save();

    res.status(201).json({ message: 'Role added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding role', error: err.message });
  }
};

// DELETE a role
export const deleteRole = async (req, res) => {
  try {
    const roleName = req.params.name;

    const deleted = await Role.findOneAndDelete({ name: roleName });

    if (!deleted) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting role', error: err.message });
  }
};
