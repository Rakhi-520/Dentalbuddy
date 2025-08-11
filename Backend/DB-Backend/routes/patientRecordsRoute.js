// routes/patientRecordsRoute.js
import express from 'express';
import PatientFormA from '../models/patientFormAModel.js';
import PatientFormB from '../models/patientFormBModel.js';

const router = express.Router();

// GET FormA and FormB for a specific patient/user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const formA = await PatientFormA.findOne({ userId }).sort({ createdAt: -1 });
    const formB = await PatientFormB.findOne({ userId }).sort({ createdAt: -1 });

    res.json({ formA, formB });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch forms', error });
  }
});

export default router;
