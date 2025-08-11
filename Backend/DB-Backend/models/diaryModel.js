import mongoose from "mongoose";

const diarySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Diary = mongoose.model("Diary", diarySchema);

export default Diary;
