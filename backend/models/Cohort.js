const mongoose = require('mongoose');

const CohortSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  applicationStart: { type: Date, required: true },
  applicationEnd: { type: Date, required: true },
  cohortStart: { type: Date, required: true },
  cohortEnd: { type: Date, required: true },
  maxInterns: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }


});

module.exports = mongoose.model('Cohort', CohortSchema);
