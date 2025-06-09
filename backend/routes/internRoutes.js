const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/internAuth');

const {
  applyIntern,
  loginIntern,
  getInternById,
  getProjectsByInternId,
  addMilestone,
  editMilestone,
  deleteMilestone,
  addSubTask,
  editSubTask,
  deleteSubTask,
  toggleSubTaskStatus,
 
  
} = require('../controllers/internController');

// Multer file storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ─────────────────────────────────────────────
// Intern Core Routes
// ─────────────────────────────────────────────
router.post(
  '/apply',
  upload.fields([
    { name: 'documents', maxCount: 5 },
    { name: 'profilePicture', maxCount: 1 }
  ]),
  applyIntern
);

router.post('/login', loginIntern);
router.get('/:id', protect, getInternById);
router.get('/:internId/projects', protect, getProjectsByInternId);

// ─────────────────────────────────────────────
// Milestone & Subtask Routes (from InternController)
// ─────────────────────────────────────────────

// Milestones
router.post('/addms', protect, addMilestone);
router.put('/:projectId/editms', protect, editMilestone);
router.delete('/:projectId/deletems', protect, deleteMilestone);

// Subtasks
router.post('/addst', protect, addSubTask);
router.put('/:milestoneId/editst', protect, editSubTask);
router.delete('/:milestoneId/deletest', protect, deleteSubTask);

// Task status management
router.patch(
  "/toggleSubTask/:internId",
  protect, 
  toggleSubTaskStatus
);




module.exports = router;
