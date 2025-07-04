const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const internRoutes = require('./routes/internRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/interns', internRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/api/admin', authRoutes);
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);
const cohortRoutes = require('./routes/cohortRoutes');
app.use('/api/cohort', cohortRoutes);
const supervisorRoutes = require('./routes/supervisorRoutes');
app.use('/api/supervisor', supervisorRoutes);




// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/myDB")
.then(() => {
  console.log('MongoDB connected');
  initializeAdmin();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));
const initializeAdmin = require('./utils/initAdmin');



