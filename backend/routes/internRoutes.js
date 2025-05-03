const express = require('express');
const router = express.Router();
const { applyIntern } = require('../controllers/internController');
const multer = require('multer');
const path = require('path');

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

router.post(
  '/apply',
  upload.fields([
    { name: 'documents', maxCount: 5 },
    { name: 'profilePicture', maxCount: 1 }
  ]),
  applyIntern
);

module.exports = router;
