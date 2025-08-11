import cloudinary from '../Config/cloudinary.js';

// Handle Media Upload
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = {
      url: req.file.path,
      type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
      public_id: req.file.filename,
    };

    res.status(200).json(result);
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
};
