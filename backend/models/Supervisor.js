const mongoose = require('mongoose');

const supervisorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  profilePicture: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('Supervisor', supervisorSchema);
