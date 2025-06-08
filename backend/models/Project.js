const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Intern' }],
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', required: true },
  milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' }],
  description: { type: String },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },

  
  outcome: {
    type: String,
    enum: ['unknown', 'successful', 'failed'],
    default: 'unknown'
  }

}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
