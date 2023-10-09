const jwt = require('jsonwebtoken');
const { createTask, updateTask, deleteTask } = require('../tasks/controllers/tasks_controller');

const taskSocketMiddleware = (io) => {
  io.use((socket, next) => {
    // Extract the token from the socket handshake query
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    const tokenWithoutBearer = token.split(' ')[1]; // Remove the "Bearer " prefix from the token

    jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return next(new Error('Unauthorized'));
      }

      console.log(`user ${decoded.userId}`)
      socket.userId = decoded.userId;
      next();
    });
  });

  io.on('connection', (socket) => {
    // !Handle socket events and logic for the authenticated user


    socket.on('task_action', async (actionData) => {
      const { action, taskId, taskData } = actionData;
      const userId = socket.userId;


      switch (action) {
        case 'create':
          try {
            console.log(taskData)
            // Handle task creation logic
            const task = await createTask(taskData, userId);

            // Emit task created event to all connected clients
            io.emit('task_created', task);
          } catch (error) {
            console.error('Error creating task:', error);
          }
          break;

        case 'update':
          try {
            // Handle task update logic
            const updatedTask = await updateTask(taskId, taskData);

            // Emit task updated event to all connected clients
            io.emit('task_updated', updatedTask);
          } catch (error) {
            console.error('Error updating task:', error);
          }
          break;


        case 'delete':
          try {
            // Handle task deletion logic
            const res = await deleteTask(taskId);

            // Emit task deleted event to all connected clients
            io.emit('task_deleted', taskId);
          } catch (error) {
            console.error('Error deleting task:', error);
          }
          break;

        default:
          console.warn('Unknown task action:', action);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from task events');
    });
  });
};

module.exports = taskSocketMiddleware;