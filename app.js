const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const notesRouter = require("./src/notes/routes/note_routes");
const registeringRouter = require("./src/registeration/routes/registering_routes");
const tasksRouter = require('./src/tasks/routes/tasks_routes');
const teamsRouter = require('./src/tasks/routes/teams_routes');
const invitationRouter = require("./src/invitation/routes/inviteRouter");
const authenticateToken = require('./authenticate');

//? Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // enable CORS for all routes

//! Routers........

app.use('/reg', registeringRouter);
app.use('/notes',authenticateToken, notesRouter);
app.use('/tasks',authenticateToken, tasksRouter);
app.use('/teams',authenticateToken, teamsRouter);
app.use('/invites',authenticateToken, invitationRouter);

// Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/Notydp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
    // Run the server
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server running on localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });