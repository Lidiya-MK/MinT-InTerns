const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPendingInterns } = require('../controllers/adminController');

router.get('/interns/pending', protect, getPendingInterns);

module.exports = router;
