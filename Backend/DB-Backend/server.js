import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Route imports
import noteRoutesPR from './routes/noteRoutesPR.js';
import userRoutes from './routes/userRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import diaryRoutes from './routes/diaryRoutes.js';
import inventoryNoteRoutes from './routes/inventoryNoteRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import importantNoteRoutes from './routes/importantNoteRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dentalbuddy';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes/patient-records', noteRoutesPR);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/inventory-notes', inventoryNoteRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/important-notes', importantNoteRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('🦷 DentalBuddy backend server is running');
});

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
