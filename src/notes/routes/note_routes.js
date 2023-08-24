const { Router } = require("express");
const { getAllNotes, createNote, updateNote, deleteNote } = require("../controllers/notes_controller");

const notesRouter = Router()
notesRouter.get('/all_notes/:id', getAllNotes);
notesRouter.post('/add_note', createNote);
notesRouter.put('/updateNote', updateNote);
notesRouter.delete('/deleteNote', deleteNote);
module.exports = notesRouter;
