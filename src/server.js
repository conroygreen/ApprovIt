const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Load municipalities data
const municipalitiesData = require('../data/municipalities.json');

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Sanitize filename to prevent path traversal and special characters
function sanitizeFilename(filename) {
  // Get only the base name, removing any path components
  const baseName = path.basename(filename);
  // Replace any non-alphanumeric characters (except dots and hyphens) with underscores
  // This prevents path traversal and special character issues
  return baseName.replace(/[^a-zA-Z0-9.-]/g, '_');
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = sanitizeFilename(file.originalname);
    cb(null, uniqueSuffix + '-' + sanitizedName);
  }
});

// Allowed MIME types for file uploads
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'application/pdf'
];

// Allowed file extensions
const allowedExtensions = /\.(jpeg|jpg|png|gif|pdf)$/i;

// File filter to accept only images and PDFs
const fileFilter = (req, file, cb) => {
  const extValid = allowedExtensions.test(file.originalname.toLowerCase());
  const mimeValid = allowedMimeTypes.includes(file.mimetype);
  
  if (extValid && mimeValid) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, gif) and PDF files are allowed'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Upload endpoint
app.post('/api/upload', upload.array('planDrawings', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  
  const fileInfos = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
    path: '/uploads/' + file.filename
  }));
  
  res.json({ 
    message: 'Files uploaded successfully',
    files: fileInfos
  });
});

// Get municipalities
app.get('/api/municipalities', (req, res) => {
  res.json(municipalitiesData);
});

// Get uploaded files
app.get('/api/files', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading uploads directory' });
    }
    const fileList = files.filter(f => !f.startsWith('.')).map(file => ({
      filename: file,
      path: '/uploads/' + file
    }));
    res.json(fileList);
  });
});

// Delete file endpoint
app.delete('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  // Validate filename to prevent path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }
  
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json({ message: 'File deleted successfully' });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`ApprovIt server running on http://localhost:${PORT}`);
});
