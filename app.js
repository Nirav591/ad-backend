const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');


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
app.use(bodyParser.json());

// Route middlewares
app.use('/api/auth', authRoutes);
app.use('/api', adminRoutes);


const PORT =  6315;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
