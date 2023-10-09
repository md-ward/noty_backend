const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const notesRouter = require("./src/notes/routes/note_routes");
const registeringRouter = require("./src/registeration/routes/registering_routes");
const tasksRouter = require("./src/tasks/routes/tasks_routes");
const teamsRouter = require("./src/tasks/routes/teams_routes");
const invitationRouter = require("./src/invitation/routes/inviteRouter");
const authenticateToken = require("./src/middleware/authenticate");
const taskSocketMiddleware = require("./src/middleware/websockit");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Routers
app.use("/reg", registeringRouter);
app.use("/notes", authenticateToken, notesRouter);
app.use("/tasks", authenticateToken, tasksRouter);
app.use("/teams", authenticateToken, teamsRouter);
app.use("/invites", authenticateToken, invitationRouter);

// Connect to the database
mongoose
  .connect("mongodb://127.0.0.1:27017/Notydp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");

    // Create an HTTP server
    const server = http.createServer(app);

    // Create a Socket.IO server and attach it to the HTTP server
    const io = new Server(server);
    // io.on('connect', () => {
    //   console.log('user connected');
    // });

    io.on("disconnect", () => {
      console.log("user disconnected..");
    });
    taskSocketMiddleware(io);

    // Run the server
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`Server running on localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if there's an error connecting to the database
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});
