import express from 'express';
import ImportantNotePR from '../models/importantNotePRModel.js';

const router = express.Router();

// GET the latest note for Patient Records
router.get('/', async (req, res) => {
  try {
    const note = await ImportantNotePR.findOne().sort({ createdAt: -1 });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch the note' });
  }
});

// GET all saved notes for archive (future feature)
router.get('/saved', async (req, res) => {
  try {
    const savedNotes = await ImportantNotePR.find({ isSaved: true }).sort({ createdAt: -1 });
    res.json(savedNotes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch saved notes' });
  }
});

// POST a new or unsaved note
router.post('/', async (req, res) => {
  try {
    const { message, author, isSaved = false } = req.body;
    const note = new ImportantNotePR({ message, author, isSaved });
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save note' });
  }
});

// PUT to update existing note
router.put('/:id', async (req, res) => {
  try {
    const { message, author, isSaved = false } = req.body;
    const updated = await ImportantNotePR.findByIdAndUpdate(
      req.params.id,
      { message, author, isSaved },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note' });
  }
});

// DELETE a note
router.delete('/:id', async (req, res) => {
  try {
    await ImportantNotePR.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note' });
  }
});

export default router;
