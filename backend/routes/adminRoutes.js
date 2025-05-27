const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPendingInterns,createSupervisor,getInternById,acceptIntern,
     rejectIntern, getAcceptedInterns,updateMaxAcceptedInterns, getCohorts, 
     createCohort, deleteCohort,getMaxInterns,getAvailableSlots, getInternsByCohort,getAcceptedInternsByCohort,getPendingOrRejectedInternsByCohort,
     getPendingInternCountByCohort, getAcceptedInternCountByCohort, getAllSupervisors, getAllAdmins } = require('../controllers/adminController');
const{getOngoingCohorts, getPastCohorts}= require('../controllers/cohortController')

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
router.get('/cohort/:cohortId/interns', protect, getInternsByCohort);
router.get('/cohort/ongoing',protect,  getOngoingCohorts);
router.get('/cohort/past', protect, getPastCohorts);
router.get('/cohort/:cohortId/interns/pending-rejected', protect, getPendingOrRejectedInternsByCohort);
router.get('/cohort/:cohortId/interns/accepted', protect, getAcceptedInternsByCohort);
router.get('/cohort/:cohortId/accepted-count', protect, getAcceptedInternCountByCohort);
router.get('/cohort/:cohortId/pending-count', protect, getPendingInternCountByCohort);
router.get('/supervisors', protect, getAllSupervisors);
router.get('/administrators', protect, getAllAdmins);


module.exports = router;
