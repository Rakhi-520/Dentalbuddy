
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../Config/cloudinary.js';
import { uploadMedia } from '../controllers/mediaController.js';

const router = express.Router();

// Configure Multer with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'DentalBuddy',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm'],
  },
});

const upload = multer({ storage });

// POST /api/media/upload
router.post('/upload', upload.single('file'), uploadMedia);

export default router;

