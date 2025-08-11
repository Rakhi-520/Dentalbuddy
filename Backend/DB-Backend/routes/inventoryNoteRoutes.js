import express from 'express';
import { addNote, getNotes, deleteNote } from '../controllers/inventoryNoteController.js';

const router = express.Router();

router.post('/add', addNote);
router.get('/all', getNotes);
router.delete('/delete/:id', deleteNote);

export default router;
