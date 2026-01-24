const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const authenticateToken = require('../middleware/auth');

// Configure Multer for temporary local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/receipts');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Helper to get platform config from Firestore
const getPlatformConfig = async () => {
  try {
    const doc = await admin.firestore().collection('settings').doc('platform').get();
    return doc.exists ? doc.data() : { bankReceiptUploadPath: 'server' };
  } catch (e) {
    return { bankReceiptUploadPath: 'server' };
  }
};

router.post('/upload', authenticateToken, upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const config = await getPlatformConfig();
    const uploadPath = config.bankReceiptUploadPath || 'server';

    if (uploadPath === 'github') {
      // GitHub Upload Logic
      const fileContent = fs.readFileSync(req.file.path);
      const base64Content = fileContent.toString('base64');
      const fileName = `receipts/${req.file.filename}`;
      
      const githubToken = process.env.GITHUB_TOKEN;
      const repos = (process.env.GITHUB_REPOS || '').split(',');
      const repo = repos[0]; // Use first repo for receipts for now

      if (!githubToken || !repo) {
        throw new Error('GitHub configuration missing in server environment');
      }

      const url = `https://api.github.com/repos/${repo}/contents/${fileName}`;
      
      await axios.put(url, {
        message: `Upload bank receipt: ${req.file.filename}`,
        content: base64Content
      }, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      // Clean up local temp file
      fs.unlinkSync(req.file.path);

      const imageUrl = `https://raw.githubusercontent.com/${repo}/master/${fileName}`;
      return res.status(201).json({ imageUrl });
    } else {
      // Server Upload Logic
      const imageUrl = `/uploads/receipts/${req.file.filename}`;
      return res.status(201).json({ imageUrl });
    }

  } catch (error) {
    console.error('Receipt upload error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error uploading receipt', error: error.message });
  }
});

module.exports = router;
