const express = require('express');
const { loginAdmin, createAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/login', loginAdmin);


router.post('/register', protect, upload.single('profilePicture'), createAdmin);

module.exports = router;
