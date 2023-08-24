const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = 3000;
const ADDRESS = '192.168.1.6';
const cors = require('cors');
const registering_router = require("./src/notes/routes/registering_routes");
const notesRouter = require("./src/notes/routes/note_routes");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // enable CORS for all routes

app.use('/reg', registering_router);
app.use('/notes', notesRouter);

// Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/Notydp');

// Run the server
app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
