const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/internAuth');

const { applyIntern, loginIntern, getInternById, createProject,getAllSupervisors } = require('../controllers/internController');

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Intern Application Route
router.post(
  '/apply',
  upload.fields([
    { name: 'documents', maxCount: 5 },
    { name: 'profilePicture', maxCount: 1 }
  ]),
  applyIntern
);

// Intern Login Route
router.post('/login', loginIntern);
router.get('/:id', protect, getInternById);


module.exports = router;
