const express = require('express');
const upload = require('./uploadConfig'); // Your multer configuration file
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware to handle JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // File upload successful
  res.json({ message: 'File uploaded successfully', file: req.file });
});

// Convert image to Base64
app.post('/upload/base64', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Read the uploaded file and convert to Base64
  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading file', error: err.message });
    }
    
    // Convert file to Base64
    const base64Image = `data:${req.file.mimetype};base64,${data.toString('base64')}`;
    
    // Send response
    res.json({
      message: 'File uploaded and converted to Base64',
      base64Image,
    });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
