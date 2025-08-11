import mongoose from 'mongoose';

// Sub-schema for individual tooth condition
const toothConditionSchema = new mongoose.Schema({
  toothNumber: String,
  condition: {
    cavity: Boolean,
    mobility: Boolean,
    missing: Boolean,
    filling: Boolean,
  },
}, { _id: false });

// Main patient schema
const patientSchema = new mongoose.Schema({
  serialNumber: Number,
  date: String,
  name: String,
  age: Number,
  gender: String,
  phone: String,
  address: String,
  maritalStatus: String,
  referredBy: String,
  chiefComplaint: String,
  medicalHistory: {
    conditions: [String],
    allergies: String,
    medications: String,
  },
  dentalHistory: String,
  clinicalFindings: {
    first: [toothConditionSchema],
    second: [toothConditionSchema],
    third: [toothConditionSchema],
    fourth: [toothConditionSchema],
  },
  investigations: String,
  diagnosis: String,
  treatmentPlan: String,
  orthoProfile: {
    facialProfile: String,
    lipCompetency: String,
    overjet: String,
    overbite: String,
    habits: String,
    molarRelation: String,
    crossbite: String,
    openbite: String,
  },
  prescriptions: [{
    drugName: String,
    dosage: String,
    duration: String,
  }],
  department: String,
  dentistName: String,
  profileImage: String, // optional path to image
}, {
  timestamps: true // includes createdAt and updatedAt
});

// Export model using ES module syntax
const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
