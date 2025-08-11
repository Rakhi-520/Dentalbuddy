import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  password: { type: String, default: '' }, 
  role: { type: String, required: true }, 
  permissions: { type: [String], default: [] },
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);
