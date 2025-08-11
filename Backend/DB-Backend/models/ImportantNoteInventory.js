import mongoose from 'mongoose';

const importantNoteInventorySchema = new mongoose.Schema({
  message: { type: String, required: true },
  author: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ImportantNoteInventory = mongoose.model(
  'ImportantNoteInventory',
  importantNoteInventorySchema
);

export default ImportantNoteInventory;
