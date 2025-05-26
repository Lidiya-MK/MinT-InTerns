const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPendingInterns,createSupervisor,getInternById,acceptIntern, rejectIntern, getAcceptedInterns,updateMaxAcceptedInterns, getCohorts, createCohort, deleteCohort,getMaxInterns,getAvailableSlots } = require('../controllers/adminController');

router.get('/interns/pending', protect, getPendingInterns);
router.get('/interns/accepted', protect, getAcceptedInterns);
router.post('/register/supervisor', protect, createSupervisor);
router.get('/interns/:id', protect, getInternById);
router.patch('/interns/:id/accept', protect, acceptIntern);
router.patch('/interns/:id/reject', protect, rejectIntern);
router.patch('/cohorts/updatemax/:id', protect, updateMaxAcceptedInterns)
router.get('/cohorts', protect, getCohorts);
router.post('/cohorts', protect, createCohort);
router.delete('/cohorts/:id', protect, deleteCohort);
router.patch('/cohorts/max', protect, getMaxInterns);
router.get('/cohorts/:id/available-slots', protect, getAvailableSlots);


module.exports = router;
