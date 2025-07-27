const express = require('express');
const upload = require('../middleware/upload');
const router = express.Router();
const { protect } = require('../middleware/supervisorAuthMiddleware');
const { loginSupervisor,getInternsByCohort,createProject, getProjectsBySupervisor,
    getProjectById,getMilestoneById,
toggleProjectStatus, updateAttendance,
toggleProjectOutcome,updateProject, deleteProject, getSupervisorById,updateSupervisorProfile
} = require('../controllers/supervisorController');

router.post('/login', loginSupervisor);
router.get('/cohort/:cohortId/interns', protect, getInternsByCohort);
router.post('/new-project', protect, createProject);
router.get('/projects/:supervisorId/:cohortId', protect, getProjectsBySupervisor);
router.get('/project/:projectId', protect, getProjectById);
router.get("/milestone/:milestoneId", protect, getMilestoneById);
router.patch('/:projectId/toggle-status', protect, toggleProjectStatus);
router.patch('/:projectId/toggle-outcome', protect, toggleProjectOutcome);
router.put('/project/:projectId', protect, updateProject);       
router.delete('/project/:projectId', protect, deleteProject);    
router.put('/intern/:internId/attendance', protect, updateAttendance);
router.get('/:supervisorId', protect, getSupervisorById); 
router.put('/:supervisorId/update', protect, upload.single("profilePicture"), updateSupervisorProfile);


module.exports = router;
