const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, project, assignedTo, priority, dueDate } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      priority,
      dueDate,
      createdBy: req.user._id,
    });

    const populatedTask = await task.populate('assignedTo', 'name email avatar');
    
    // Create Notification
    await Notification.create({
      recipient: assignedTo || req.user._id,
      sender: req.user._id,
      title: 'New Task Assigned',
      message: `You have been assigned to "${title}"`,
      type: 'task',
    });

    // Notify team
    const io = req.app.get('io');
    if (assignedTo) io.to(assignedTo).emit('taskAssigned', populatedTask);
    io.emit('taskCreated', populatedTask);
    io.emit('notificationReceived');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update task status (Kanban move)
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      task.status = req.body.status;
      const updatedTask = await task.save();
      
      const io = req.app.get('io');
      io.emit('taskUpdated', updatedTask);

      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTasksByProject,
  createTask,
  updateTaskStatus,
};
