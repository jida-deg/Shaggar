import express from 'express';
import upload from '../config/multer.js';
import { uploadToCloudinary } from '../config/cloudnery.js';

const router = express.Router();
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await uploadToCloudinary(req.file.buffer, 'documents');
    return res.status(201).json({ url: result.secure_url, public_id: result.public_id, raw: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


export default router;
