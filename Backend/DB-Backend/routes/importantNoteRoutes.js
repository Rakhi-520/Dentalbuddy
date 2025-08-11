import express from 'express';
import {
  saveNote,
  getSavedNotes,
  getNoteByPage,
  deleteNote,
  updateNote
} from '../controllers/importantNotePRController.js';

const router = express.Router();

router.post('/save', saveNote);
router.get('/saved/:page', getSavedNotes);
router.get('/active/:page', getNoteByPage);
router.delete('/delete/:id', deleteNote);
router.put('/edit/:id', updateNote);

export default router;
