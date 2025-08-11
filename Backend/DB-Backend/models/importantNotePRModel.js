import mongoose from 'mongoose';

const importantNotePRSchema = new mongoose.Schema({
  page: { type: String, required: true },
  content: { type: String, required: true },            
  author: { type: String, default: 'Anonymous' },
  isSaved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const ImportantNote = mongoose.model('ImportantNote', importantNotePRSchema);
export default ImportantNote;
