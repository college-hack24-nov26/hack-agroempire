import { Router } from 'express';
import multer from 'multer';
import { cropDoctorService } from '../services/cropDoctorService.js';
import { plantNetService } from '../services/plantNetService.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// GET Pl@ntNet API status & remaining request quota
router.get('/plantnet-status', async (req, res, next) => {
  try {
    const status = await plantNetService.getStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (err) {
    next(err);
  }
});

// POST Run Crop Diagnostics (Supports Multipart Image File Upload or JSON)
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    let imageBuffer = null;
    let mimeType = 'image/jpeg';
    let filename = 'leaf.jpg';

    // Check if multipart file was uploaded
    if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
      filename = req.file.originalname;
    } else if (req.body.imageBase64) {
      // Check if base64 image data was sent
      const matches = req.body.imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        imageBuffer = Buffer.from(matches[2], 'base64');
      } else {
        imageBuffer = Buffer.from(req.body.imageBase64, 'base64');
      }
    }

    const {
      farmerId,
      crop,
      symptomsText,
      organ = 'leaf',
      project = 'all',
      language = 'mr',
      imageUri
    } = req.body;

    const diagnosis = await cropDoctorService.diagnoseCrop({
      farmerId,
      crop,
      symptomsText,
      imageBuffer,
      mimeType,
      filename,
      organ,
      project,
      imageUri,
      language
    });

    res.status(201).json({
      success: true,
      data: diagnosis
    });
  } catch (err) {
    next(err);
  }
});

// Diagnostic history
router.get('/history', async (req, res, next) => {
  try {
    const { farmerId } = req.query;
    const history = await cropDoctorService.getDiagnosticHistory(farmerId);
    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (err) {
    next(err);
  }
});

export default router;
