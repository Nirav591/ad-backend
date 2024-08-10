const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const fs = require('fs');



require('dotenv').config();

const app = express();



// List of allowed origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3032'];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins list or if there's no origin (for non-browser requests)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // if you need to send cookies with the requests
};

// Use CORS middleware with the defined options
app.use(cors(corsOptions));

// Use body-parser middleware
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.urlencoded({ extended: true }));




// Route middlewares
app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);


app.post('/upload', (req, res) => {
  const { imageBase64, fileName } = req.body;

  if (!imageBase64 || !fileName) {
      return res.status(400).json({ error: 'Image data and file name are required' });
  }

  // Decode Base64 image
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  // Save the image to the filesystem
  const filePath = path.join(__dirname, 'uploads', fileName);

  fs.writeFile(filePath, buffer, (err) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to save image' });
      }
      res.status(200).json({ message: 'Image uploaded successfully' });
  });
});

if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}



const PORT =  6315;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
