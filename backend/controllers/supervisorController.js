const mongoose = require('mongoose');
const Supervisor = require('../models/Supervisor');
const Project = require("../models/Project");
const Cohort = require('../models/Cohort');
const Intern= require('../models/Intern')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.loginSupervisor = async (req, res) => {
  const { email, password, cohortId } = req.body;

  try {
    const supervisor = await Supervisor.findOne({ email });
    if (!supervisor) return res.status(404).json({ message: "Supervisor not found" });

    const isMatch = await bcrypt.compare(password, supervisor.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const cohort = await Cohort.findById(cohortId);
    if (!cohort) return res.status(404).json({ message: "Cohort not found" });

    const now = new Date();
    if (now < cohort.applicationStart || now > cohort.cohortEnd) {
      return res.status(400).json({ message: "Selected cohort is not active" });
    }

    const token = generateToken(supervisor._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      supervisorId: supervisor._id,
      cohortId: cohort._id
    });

  } catch (error) {
    console.error("Supervisor login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.createProject = async (req, res) => {
  try {
    const supervisorId = req.supervisor._id; // Assumes auth middleware attaches this
    const { name, description, leader, members } = req.body;

    if (!name || !description || !leader || !members || !Array.isArray(members)) {
      return res.status(400).json({ message: "Missing or invalid fields. Ensure name, description, leader, and members are provided." });
    }

    // Check that leader is among the members
    if (!members.includes(leader)) {
      return res.status(400).json({ message: "Leader must be one of the members." });
    }

    // Optional: Validate if each intern exists
    const internsExist = await Intern.find({ _id: { $in: members } });
    if (internsExist.length !== members.length) {
      return res.status(404).json({ message: "One or more intern IDs are invalid." });
    }

    const newProject = new Project({
      name,
      description,
      leader,
      members,
      supervisor: supervisorId,
      status: 'open', 
      outcome: 'unknown' 
    });

    await newProject.save();

    return res.status(201).json({
      message: "Project created successfully.",
      project: newProject
    });
  } catch (err) {
    console.error("Project creation error:", err);
    res.status(500).json({ message: "Failed to create project." });
  }
};



exports.getInternsByCohort = async (req, res) => {
  try {
    const { cohortId } = req.params;

    const interns = await Intern.find({ cohort: cohortId }).populate('cohort', 'name'); 

    res.status(200).json(interns);
  } catch (error) {
    console.error('Error fetching interns by cohort:', error);
    res.status(500).json({ error: 'Failed to fetch interns for this cohort' });
  }
};


exports.getOngoingCohorts = async (req, res) => {
  try {
    const now = new Date();
    const ongoingCohorts = await Cohort.find({
      applicationStart: { $lte: now },
      cohortEnd: { $gte: now },
    }).sort({ applicationStart: 1 });

    if (ongoingCohorts.length === 0) {
      return res.status(200).json({ message: 'No ongoing cohorts to display.' });
    }

    res.status(200).json(ongoingCohorts);
  } catch (error) {
    console.error('Error fetching ongoing cohorts:', error);
    res.status(500).json({ error: 'Failed to fetch ongoing cohorts' });
  }
};


exports.getProjectsBySupervisor = async (req, res) => {
  try {
    const supervisorId = req.params.supervisorId;

    // Validate if supervisor exists
    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found." });
    }

    const projects = await Project.find({ supervisor: supervisorId })
      .populate('leader', 'name email') 
      .populate('members', 'name email') 
      .sort({ createdAt: -1 }); 

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects by supervisor:", error);
    res.status(500).json({ message: "Failed to fetch projects." });
  }
};
