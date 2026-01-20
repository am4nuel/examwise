const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and add timestamp
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    cb(null, `${timestamp}_${sanitized}`);
  }
});

// File filter - only allow PDFs and images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * Upload file to local server
 * @param {Object} file - Multer file object
 * @returns {String} - Full URL to the uploaded file
 */
const uploadToLocal = (file) => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}/uploads/${file.filename}`;
};

/**
 * Upload file to GitHub repository
 * @param {Buffer} fileBuffer - File content as buffer
 * @param {String} filename - Original filename
 * @param {String} repo - Repository name (e.g., "am4nuel/store1")
 * @returns {Promise<String>} - Raw GitHub URL to the file
 */
const uploadToGitHub = async (fileBuffer, filename, repo) => {
  const { GITHUB_TOKEN, GITHUB_USERNAME } = process.env;
  
  if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
    throw new Error('GitHub credentials not configured');
  }

  // Sanitize filename
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const finalFilename = `${timestamp}_${sanitizedFilename}`;

  // Convert buffer to base64
  const content = fileBuffer.toString('base64');

  // GitHub API endpoint
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${finalFilename}`;

  try {
    // Create file in repository
    const response = await axios.put(
      apiUrl,
      {
        message: `Upload ${finalFilename}`,
        content: content,
        branch: 'main'
      },
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      }
    );

    // Return raw GitHub URL
    return `https://raw.githubusercontent.com/${repo}/main/${finalFilename}`;
  } catch (error) {
    if (error.response) {
      throw new Error(`GitHub upload failed: ${error.response.data.message}`);
    }
    throw error;
  }
};

/**
 * Get list of available GitHub repositories
 * @returns {Array<String>} - Array of repository names
 */
const getGitHubRepos = () => {
  const repos = process.env.GITHUB_REPOS;
  if (!repos) return [];
  return repos.split(',').map(r => r.trim());
};

module.exports = {
  upload,
  uploadToLocal,
  uploadToGitHub,
  getGitHubRepos
};
