const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/supervisorAuthMiddleware');
const { loginSupervisor,getInternsByCohort,createProject } = require('../controllers/supervisorController');

router.post('/login', loginSupervisor);
router.get('/cohort/:cohortId/interns', protect, getInternsByCohort);
router.post('/new-project', protect, createProject);
module.exports = router;
