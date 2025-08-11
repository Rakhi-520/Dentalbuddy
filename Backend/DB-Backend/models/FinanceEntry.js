import mongoose from 'mongoose';

const financeEntrySchema = new mongoose.Schema({
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  category: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const FinanceEntry = mongoose.model('FinanceEntry', financeEntrySchema);

export default FinanceEntry;
