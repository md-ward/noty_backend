const User = require('../../registeration/models/registering_model');
const Task = require('../models/task_model');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, status, teamId } = req.body;

    // Extract the creator ID from the token
    const creatorId = req.user.userId;

    // Create the task
    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedTo,
      team: teamId,
      status,
      creatorId,
    });

    // Update the assigned user's assignedTasks field
    await User.findByIdAndUpdate(assignedTo, {
      $push: { assignedTasks: task._id },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    // Extract the creator ID from the token
    const creatorId = req.user.userId;

    const tasks = await Task.find({
      $or: [
        { creatorId }, // Tasks created by the user
        { assignedTo: { $in: [creatorId] } }, // Tasks assigned to the user
        { team: { $in: [creatorId] } }, // Tasks assigned to the user's team members
      ],
    })
      .populate('assignedTo', 'name email')
      .populate('team', 'name -_id');

    res.status(200).json(tasks);
  } catch (error) {
    console.log(req.user)

    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

// Get a specific task by ID
exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Extract the creator ID from the token
    const creatorId = req.user.userId;

    const task = await Task.findOne({ _id: taskId, creatorId })
      .populate('assignedTo', 'name email')
      .populate('team', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, dueDate, assignedTo, status, teamId } = req.body;

    // Extract the creator ID from the token
    const creatorId = req.user.userId;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, creatorId },
      { title, description, dueDate, assignedTo, team: teamId, status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(201).json({ message: 'Task updated' });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Extract the creator ID from the token
    const creatorId = req.user.userId;

    const task = await Task.findOneAndDelete({ _id: taskId, creatorId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove the task from the assigned user's assignedTasks field
    await User.findByIdAndUpdate(task.assignedTo, {
      $pull: { assignedTasks: task._id },
    });

    res.status(204).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};