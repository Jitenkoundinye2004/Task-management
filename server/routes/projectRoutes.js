const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  updateProjectProgress,
  getAnalytics,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/analytics', protect, getAnalytics);

router.route('/')
  .get(protect, getProjects)
  .post(protect, authorize('Admin'), createProject);

router.route('/:id')
  .put(protect, authorize('Admin'), updateProject)
  .delete(protect, authorize('Admin'), deleteProject);

router.put('/:id/progress', protect, updateProjectProgress);

module.exports = router;
