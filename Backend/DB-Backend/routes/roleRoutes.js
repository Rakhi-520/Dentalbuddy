import express from 'express';
import { getRoles, addRole, deleteRole } from '../controllers/roleController.js';

const router = express.Router();

router.get('/', getRoles);
router.post('/add', addRole);
router.delete('/delete/:name', deleteRole); 

export default router;
