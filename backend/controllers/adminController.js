const Intern = require('../models/Intern');
const Supervisor = require('../models/Supervisor');
const bcrypt = require('bcryptjs');
const Cohort = require('../models/Cohort');
const mongoose = require('mongoose');

exports.getPendingInterns = async (req, res) => {
  try {
    const pendingInterns = await Intern.find({ status: { $in: ['pending', 'rejected'] } })
    res.status(200).json(pendingInterns);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }exports.getPendingInterns = async (req, res) => {
    try {
      const interns = await Intern.find({ status: { $in: ['pending', 'rejected'] } });
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
};

exports.getAcceptedInterns = async (req, res) => {
  try {
    const pendingInterns = await Intern.find({ status: 'accepted' });
    res.status(200).json(pendingInterns);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports.getMaxInterns = async (req, res) => {
  try {
    const cohort = await Cohort.findOne();

    if (!cohort) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    res.status(200).json({ maxInterns: cohort.maxInterns});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const cohortId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(cohortId)) {
      return res.status(400).json({ message: "Invalid cohort ID." });
    }

    const cohort = await Cohort.findById(cohortId);
    if (!cohort) {
      return res.status(404).json({ message: "Cohort not found." });
    }

    const acceptedCount = await Intern.countDocuments({ status: 'accepted' });
    const freeSlots = Math.max(cohort.maxInterns - acceptedCount, 0);

    res.status(200).json({ freeSlots });
  } catch (err) {
    console.error("Error fetching available slots:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.createSupervisor = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await Supervisor.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Supervisor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const supervisor = await Supervisor.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Supervisor created successfully', supervisor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getInternById = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ message: 'Intern not found' });
    res.status(200).json(intern);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateMaxAcceptedInterns = async (req, res) => {
  try {
    const cohortId = req.params.id;
    const { max } = req.body;

    // Validate cohort ID
    if (!mongoose.Types.ObjectId.isValid(cohortId)) {
      return res.status(400).json({ message: "Invalid cohort ID." });
    }

  
    
    const cohort = await Cohort.findById(cohortId);
    if (!cohort) {
      return res.status(404).json({ message: "Cohort not found." });
    }

    cohort.maxInterns = max;
    await cohort.save();

    res.status(200).json({ message: "Max interns updated", cohort });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.acceptIntern = async (req, res) => {
  try {
    const cohort = await Cohort.findOne();
    if (!cohort) {
      return res.status(500).json({ message: 'Cohort not found. Please set max accepted interns first.' });
    }

    const currentAcceptedCount = await Intern.countDocuments({ status: 'accepted' });
    if (currentAcceptedCount >= cohort.maxInterns) {
      return res.status(403).json({ message: 'Acceptance limit reached. Cannot accept more interns.' });
    }

    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ message: 'Intern not found' });

    if (intern.status === 'accepted') {
      return res.status(400).json({ message: 'Intern is already accepted' });
    }

    intern.status = 'accepted';
    await intern.save();

    res.status(200).json({ message: 'Intern accepted' });
  } catch (err) {
    console.error('Accept Intern Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectIntern = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ message: 'Intern not found' });

    intern.status = 'rejected';
    await intern.save();

    res.status(200).json({ message: 'Intern rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// controllers/adminController.js



exports.getCohorts = async (req, res) => {
  try {
    const cohorts = await Cohort.find().sort({ createdAt: -1 });
    res.status(200).json(cohorts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cohorts', error: err.message });
  }
};

exports.createCohort = async (req, res) => {
  try {
    const {
      name,
      applicationStart,
      applicationEnd,
      cohortStart,
      cohortEnd,
      maxInterns,
    } = req.body;

    if (
      !name ||
      !applicationStart ||
      !applicationEnd ||
      !cohortStart ||
      !cohortEnd ||
      !maxInterns
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newCohort = new Cohort({
      name,
      applicationStart,
      applicationEnd,
      cohortStart,
      cohortEnd,
      maxInterns,
    });

    await newCohort.save();
    res.status(201).json({ message: 'Cohort created successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating cohort', error: err.message });
  }
};


exports.deleteCohort = async (req, res) => {
  try {
    const cohortId = req.params.id;
    const deleted = await Cohort.findByIdAndDelete(cohortId);
    if (!deleted) {
      return res.status(404).json({ message: 'Cohort not found.' });
    }
    res.status(200).json({ message: 'Cohort deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting cohort', error: err.message });
  }
};


