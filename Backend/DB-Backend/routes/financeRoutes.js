import express from 'express';
import FinanceEntry from '../models/FinanceEntry.js';

const router = express.Router();

// Add new entry
router.post('/add', async (req, res) => {
  try {
    const entry = new FinanceEntry(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all entries
router.get('/all', async (req, res) => {
  try {
    const data = await FinanceEntry.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
