const { Router } = require('express');
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require('../controllers/tasks_controller');

const tasksRouter = Router();

// Create a new task
tasksRouter.post('/add_task', createTask);

// Get all tasks
tasksRouter.get('/', getAllTasks);

// Get a specific task by ID
tasksRouter.get('/:id', getTaskById);

// Update a task
tasksRouter.put('/:id', updateTask);

// Delete a task
tasksRouter.delete('/:id', deleteTask);

module.exports = tasksRouter;