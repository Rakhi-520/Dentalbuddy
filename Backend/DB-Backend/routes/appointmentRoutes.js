import express from 'express';
import Appointment from '../models/appointment.js';

const router = express.Router();

/**
 * @route   GET /api/appointments/today
 * @desc    Fetch today's appointments
 * @access  Public (you can add auth later)
 */
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const appointments = await Appointment.find({ date: today });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching today\'s appointments', error });
  }
});

export default router;
