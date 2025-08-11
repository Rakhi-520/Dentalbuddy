import express from "express";
import Diary from "../models/diaryModel.js";

const router = express.Router();

// GET all diary notes
router.get("/", async (req, res) => {
  try {
    const notes = await Diary.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// POST a new diary note
router.post("/", async (req, res) => {
  try {
    const { content, date } = req.body;
    const newNote = await Diary.create({ content, date });
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ error: "Failed to add note" });
  }
});

// PUT update a diary note
router.put("/:id", async (req, res) => {
  try {
    const updated = await Diary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update note" });
  }
});

// DELETE a diary note
router.delete("/:id", async (req, res) => {
  try {
    await Diary.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
