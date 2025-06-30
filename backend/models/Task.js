const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern' },
  milestone: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
