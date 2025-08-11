import ImportantNote from '../models/importantNotePRModel.js';

// GET latest active note (unsaved note for current page)
export const getNoteByPage = async (req, res) => {
  try {
    const note = await ImportantNote.findOne({ page: req.params.page, isSaved: false }).sort({ createdAt: -1 });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all saved notes for a page
export const getSavedNotes = async (req, res) => {
  try {
    const notes = await ImportantNote.find({ page: req.params.page, isSaved: true }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SAVE a new note
export const saveNote = async (req, res) => {

  try {
    const newNote = new ImportantNote({
      content: req.body.content,
      author: req.body.author?.trim() || "Anonymous", // fallback if name not given
      page: req.body.page,
      isSaved: req.body.isSaved ?? true,
    });

    const saved = await newNote.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// EDIT a note
export const updateNote = async (req, res) => {
  try {
    const updated = await ImportantNote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a note
export const deleteNote = async (req, res) => {
  try {
    await ImportantNote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
