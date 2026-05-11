const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user._id },
        { teamMembers: req.user._id }
      ]
    }).populate('createdBy', 'name email')
      .populate('teamMembers', 'name email');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res) => {
  const { title, description, deadline, priority, teamMembers } = req.body;

  try {
    const project = await Project.create({
      title,
      description,
      deadline,
      priority,
      createdBy: req.user._id,
      teamMembers: teamMembers || [],
    });

    const populatedProject = await project.populate('createdBy', 'name email');

    // Create Notification
    await Notification.create({
      recipient: req.user._id,
      sender: req.user._id,
      title: 'New Project Created',
      message: `Project "${title}" has been successfully created.`,
      type: 'project',
    });

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('projectCreated', populatedProject);
    io.emit('notificationReceived'); // Notify frontend to refetch notifications

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update project progress
// @route   PUT /api/projects/:id/progress
// @access  Private
const updateProjectProgress = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.progress = req.body.progress;
      const updatedProject = await project.save();
      
      const io = req.app.get('io');
      io.emit('projectUpdated', updatedProject);

      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const Task = require('../models/Task');

// @desc    Get dashboard analytics
// @route   GET /api/projects/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments({
      $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }]
    });

    const projectIds = await Project.find({
      $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }]
    }).select('_id');

    const ids = projectIds.map(p => p._id);

    const totalTasks = await Task.countDocuments({ project: { $in: ids } });
    const completedTasks = await Task.countDocuments({ project: { $in: ids }, status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ project: { $in: ids }, status: { $ne: 'Completed' } });

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks: 0, // Placeholder logic
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'name email');

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.deleteOne();

    res.json({ message: 'Project removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  updateProjectProgress,
  getAnalytics,
};
