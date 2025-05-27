const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {getActiveCohorts} = require('../controllers/cohortController');


router.get('/', getActiveCohorts);

module.exports = router;
