const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  task: { type: String, required: true },
  status: { type: String, enum: ['pending', 'done'], default: 'pending' },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: function () {
    return this.status === 'done';
  }},
}, { _id: false });

const projectSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Intern' }],
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  milestone: [milestoneSchema],
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', required: true },
  status: { type: String, enum: ['completed', 'ongoing'], default: 'ongoing' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
