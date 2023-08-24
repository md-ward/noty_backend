const Note = require('../models/note_model');

// Create a new note
exports.createNote = async (req, res) => {
    const { userId, title, text, noteColor, tags } = req.body;

    try {
        // Check if the logged-in user is creating the note
        // if (userId !== req.userId) {
        //   return res.status(403).json({ message: 'Unauthorized' });
        // }

        const newNote = new Note({
            userId,
            title,
            text,
            noteColor,
            createdAt: new Date(),
            tags,
        });

        const savedNote = await newNote.save();

        res.status(201).json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating note');
    }
};

// Get all notes of the logged-in user
exports.getAllNotes = async (req, res) => {
    try {
        const userId = req.params['id'];

        // console.log(userId);

        const notes = await Note.find({ userId: userId });
        // console.log(notes)
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving notes');
    }
};

// Update a note
exports.updateNote = async (req, res) => {
    const { userId, noteId, title, text, noteColor, tags } = req.body;

    try {
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if the logged-in user is the owner of the note
        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            {
                title,
                text,
                noteColor,
                tags,
            },
            { new: true }
        );

        res.json(updatedNote);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating note');
    }
};

// Delete a note
exports.deleteNote = async (req, res) => {
    const { noteId, userId } = req.body;
    try {
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if the logged-in user is the owner of the note
        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Note.findByIdAndRemove(noteId);

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting note');
    }
};