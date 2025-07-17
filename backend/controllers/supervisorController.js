const mongoose = require('mongoose');
const Supervisor = require('../models/Supervisor');
const Project = require("../models/Project");
const Cohort = require('../models/Cohort');
const Intern= require('../models/Intern')
const Task = require("../models/Task");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Milestone = require("../models/Milestone"); 

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
    const supervisorId = req.supervisor._id; // Comes from auth middleware
    const { cohortId, name, description, leader, members } = req.body;

    if (!cohortId || !name || !description || !leader || !members || !Array.isArray(members)) {
      return res.status(400).json({ message: "Missing or invalid fields. Ensure cohortId, name, description, leader, and members are provided." });
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
      cohort: cohortId,
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Automatically create today's attendance record if missing
    for (let intern of interns) {
      const hasTodayRecord = intern.attendanceRecords.some(record => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === today.getTime();
      });

      if (!hasTodayRecord) {
        intern.attendanceRecords.push({ date: today, attendanceStatus: 'present' });
        await intern.save();
      }
    }

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
    const { supervisorId, cohortId } = req.params;

    // Validate if supervisor exists
    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found." });
    }

    // Fetch projects by supervisor and cohort
    const projects = await Project.find({
      supervisor: supervisorId,
      cohort: cohortId,
    })
      .populate('leader', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects by supervisor and cohort:", error);
    res.status(500).json({ message: "Failed to fetch projects." });
  }
};



exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate('leader', 'name email') // populating leader details
      .populate('members', 'name email'); // populating members details

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({ message: "Failed to fetch project." });
  }
};





exports.getMilestoneById = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found." });
    }

    const tasks = await Task.find({ milestone: milestoneId })
      .populate("completedBy", "name email");

    const milestoneWithTasks = {
      ...milestone.toObject(),
      tasks,
    };

    res.status(200).json(milestoneWithTasks);
  } catch (error) {
    console.error("Error fetching milestone by ID:", error);
    res.status(500).json({ message: "Failed to fetch milestone." });
  }
};


exports.toggleProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Toggle status
    project.status = project.status === 'open' ? 'closed' : 'open';

    // If the project is opened, reset the outcome to 'unknown'
    if (project.status === 'open') {
      project.outcome = 'unknown';
    }

    await project.save();

    res.status(200).json({
      message: `Project status updated to ${project.status}.`,
      project
    });
  } catch (error) {
    console.error("Error toggling project status:", error);
    res.status(500).json({ message: "Failed to toggle project status." });
  }
};


exports.toggleProjectOutcome = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Allow toggling only if project is closed
    if (project.status !== 'closed') {
      return res.status(400).json({ message: "You can only set an outcome for closed projects." });
    }

    // Toggle between successful and failed
    if (project.outcome === 'successful') {
      project.outcome = 'failed';
    } else if (project.outcome === 'failed' || project.outcome === 'unknown') {
      project.outcome = 'successful';
    }

    await project.save();

    res.status(200).json({
      message: `Project outcome updated to ${project.outcome}.`,
      project
    });
  } catch (error) {
    console.error("Error toggling project outcome:", error);
    res.status(500).json({ message: "Failed to toggle project outcome." });
  }
};


// Update an existing project
exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, leader, members, status, outcome } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Optional: Validate members exist
    if (members && members.length > 0) {
      const internsExist = await Intern.find({ _id: { $in: members } });
      if (internsExist.length !== members.length) {
        return res.status(404).json({ message: "One or more intern IDs are invalid." });
      }

      // Validate leader is among the members
      if (leader && !members.includes(leader)) {
        return res.status(400).json({ message: "Leader must be one of the members." });
      }
    }

    // Update fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (leader) project.leader = leader;
    if (members) project.members = members;
    if (status) project.status = status;
    if (outcome) project.outcome = outcome;

    await project.save();

    res.status(200).json({ message: "Project updated successfully.", project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Failed to update project." });
  }
};


// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Failed to delete project." });
  }
};


exports.updateAttendance = async (req, res) => {
  try {
    const { internId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

    const intern = await Intern.findById(internId);
    if (!intern) return res.status(404).json({ message: "Intern not found." });

    // Find today's record
    let existingRecord = intern.attendanceRecords.find(record => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    });

    if (existingRecord) {
      // Toggle status
      existingRecord.attendanceStatus = existingRecord.attendanceStatus === 'present' ? 'absent' : 'present';
    } else {
      // If no record for today, create a new one with default 'present' then immediately toggle to 'absent'
      intern.attendanceRecords.push({ date: today, attendanceStatus: 'absent' });
    }

    await intern.save();

    res.status(200).json({ message: "Attendance updated successfully.", intern });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Failed to update attendance." });
  }
};
