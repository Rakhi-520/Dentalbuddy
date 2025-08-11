import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// REGISTER user
export const registerUser = async (req, res) => {
  try {
    const { name, password = '', role, idNumber, permissions } = req.body;

    console.log('📩 Received registration data:', req.body);

    const existingUser = await User.findOne({ idNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this ID number' });
    }

    const newUser = new User({
      name,
      password,
      role,
      idNumber,
      permissions,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('❌ Error during user registration:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};
// Login User
export const loginUser = async (req, res) => {
  try {
    const { role, password, idNumber } = req.body;
    if (role.toLowerCase() === 'admin') {
      const admin = await User.findOne({ role: 'admin' });
      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: 'Wrong password' });
      }
      const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '2h',
      });
      return res.json({
        token,
        name: admin.name,
        role: admin.role,
        idNumber: admin.idNumber,
        permissions: admin.permissions,
      });
    }

    const user = await User.findOne({
      idNumber: idNumber?.trim(),
      role: { $regex: new RegExp(`^${role?.trim()}$`, 'i') },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found or role mismatch' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret123', {
      expiresIn: '2h',
    });

    res.json({
      token,
      name: user.name,
      role: user.role,
      idNumber: user.idNumber,
      permissions: user.permissions,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// DELETE USER BY ID
export const deleteUser = async (req, res) => {
  try {
    const { idNumber } = req.params;
    const deleted = await User.findOneAndDelete({ idNumber });

    if (!deleted) {
      return res.status(404).json({ message: 'User not found to delete' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    res.status(500).json({ message: 'Server error while deleting', error: err.message });
  }
};
