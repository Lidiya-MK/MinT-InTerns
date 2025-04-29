const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  CGPA: { type: Number, required: true },
  university: { type: String, required: true }, 
  profilePicture: { type: String }, 
  documents: [{ type: String }], 
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Intern', internSchema);
