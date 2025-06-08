const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {getOngoingCohorts} = require('../controllers/cohortController');


router.get('/', getOngoingCohorts);

module.exports = router;
