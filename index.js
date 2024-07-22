const express = require('express');
const authRoutes = require('./routes/authRoutes');
const { port } = require('./config/config');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
