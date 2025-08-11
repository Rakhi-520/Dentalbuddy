import express from 'express';
import {
  getPatients,
  addPatient,
  updatePatient,
  getRecentPatients,
  getTodaysAppointments,
} from '../controllers/patientController.js';

const router = express.Router();

router.get('/', getPatients);
router.post('/', addPatient);
router.put('/:id', updatePatient);
router.get('/recent', getRecentPatients);
router.get('/appointments/today', getTodaysAppointments);

export default router;
