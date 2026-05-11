const express = require('express');
const router = express.Router();
const {
  getTasksByProject,
  createTask,
  updateTaskStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createTask);

router.get('/project/:projectId', protect, getTasksByProject);
router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;
