const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern' }
}, { _id: false });

const milestoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  tasks: [taskSchema]
}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);
