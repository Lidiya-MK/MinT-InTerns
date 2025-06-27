const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/supervisorAuthMiddleware');
const { loginSupervisor,getInternsByCohort,createProject, getProjectsBySupervisor,
    getProjectById,getMilestoneById,
toggleProjectStatus,
toggleProjectOutcome

} = require('../controllers/supervisorController');

router.post('/login', loginSupervisor);
router.get('/cohort/:cohortId/interns', protect, getInternsByCohort);
router.post('/new-project', protect, createProject);
router.get('/projects/:supervisorId/:cohortId', protect, getProjectsBySupervisor);
router.get('/project/:projectId', protect, getProjectById);
router.get("/milestone/:milestoneId", protect, getMilestoneById);
router.patch('/:projectId/toggle-status', protect, toggleProjectStatus);
router.patch('/:projectId/toggle-outcome', protect, toggleProjectOutcome);


module.exports = router;
