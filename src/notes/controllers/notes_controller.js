const Note = require('../models/note_model');

// Create a new note
exports.createNote = async (req, res) => {
    const { userId, title, text, noteColor } = req.body;

    try {

        const newNote = new Note({
            userId,
            title,
            text,
            noteColor,
            createdAt: new Date(),
            
        });

        const savedNote = await newNote.save();

        res.status(201).json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating note');
    }
};
// Get all notes of the logged-in user with pagination
exports.getAllNotes = async (req, res) => {
    try {
        const userId = req.params['id'];
        const { page, limit } = req.query;

        // Calculate the offset based on the current page and limit
        const offset = (page - 1) * limit;

        // Query the database to retrieve paginated notes
        const notes = await Note.find({ userId: userId })
            .skip(offset)
            .limit(limit);

        // Count the total number of notes for the user
        const totalCount = await Note.countDocuments({ userId: userId });

        // console.log({
        //     notes,
        //     currentPage: parseInt(page),
        //     totalPages: Math.ceil(totalCount / limit),
        //     totalItems: totalCount,
        // }

        // )

        res.json({
            notes,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            totalItems: totalCount,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving notes');
    }
};
// Search notes based on a query
exports.searchNotes = async (req, res) => {
    const { userId, query } = req.body;
    console.log(req.body)
    try {
        // Convert the query to a regex pattern
        const regexQuery = new RegExp(query, 'i');

        // Query the database to search for notes
        const notes = await Note.find({
            userId,
            $or: [
                { title: { $regex: regexQuery } },
                { text: { $regex: regexQuery } },
            ],
        });

        // Count the total number of matching notes
        const totalCount = notes.length;

        res.json({
            notes,
            totalItems: totalCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching notes');
    }
};
// Update a note
exports.updateNote = async (req, res) => {
    const { userId, noteId, title, text, noteColor } = req.body;

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