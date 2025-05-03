const express = require('express');
const { loginAdmin, createAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/register', protect, createAdmin);

module.exports = router;
