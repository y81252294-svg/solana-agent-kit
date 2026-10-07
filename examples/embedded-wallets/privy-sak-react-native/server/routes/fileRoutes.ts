import express from 'express';
import { upload, uploadFile } from '../controllers/fileController';

const router = express.Router();

// File upload route
router.post('/upload', upload.single('file'), uploadFile);

export default router; 