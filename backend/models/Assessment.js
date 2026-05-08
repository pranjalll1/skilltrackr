const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  userAnswer: { type: String, default: null },
});

const assessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  questions: [questionSchema],
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
