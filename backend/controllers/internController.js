const Intern = require('../models/Intern');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Project = require("../models/Project");
const Supervisor = require('../models/Supervisor');
const mongoose = require('mongoose');
const Milestone = require('../models/Milestone');


exports.applyIntern = async (req, res) => {
  try {
    const { name, email, university, CGPA, cohort } = req.body;

    const documents = req.files?.documents?.map(file => file.path) || [];
    const profilePicture = req.files?.profilePicture?.[0]?.path || '';

    // Use "000000" as the default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('000000', salt);

    const newIntern = new Intern({
      name,
      email,
      university,
      CGPA,
      cohort,
      documents,
      profilePicture,
      password: hashedPassword,
    });

    await newIntern.save();
    res.status(201).json({ message: 'Intern application submitted', intern: newIntern });
  } catch (error) {
    console.error('Intern application error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.loginIntern = async (req, res) => {
  const { email, password } = req.body;

  try {
    const intern = await Intern.findOne({ email });

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    const isMatch = await bcrypt.compare(password, intern.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (intern.status !== 'accepted') {
      return res.status(403).json({ message: 'Only accepted interns can log into the system' });
    }

    const token = jwt.sign({ id: intern._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      _id: intern._id,
      name: intern.name,
      email: intern.email,
      status: intern.status,
      token,
    });
  } catch (error) {
    console.error('Intern login error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.getInternById = async (req, res) => {
  const { id } = req.params;

  try {
    const intern = await Intern.findById(id).select('-password'); 

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    res.status(200).json(intern);
  } catch (error) {
    console.error('Error fetching intern by ID:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
exports.getProjectsByInternId = async (req, res) => {
  const { internId } = req.params;

  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(internId)) {
      return res.status(400).json({ message: 'Invalid intern ID' });
    }

    // Find all projects where the intern is a leader or a team member
   const projects = await Project.find({
  $or: [
    { leader: internId },
    { members: internId }
  ]
})
.populate('leader', 'name email')
.populate('members', 'name email')
.populate({
  path: 'milestones',
  populate: {
    path: 'tasks.completedBy',
    select: 'name email'
  }
});

res.status(200).json(projects);

  } catch (error) {
    console.error('Error fetching projects for intern:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


function calculateMilestoneStatus(tasks) {
  return tasks.every(task => task.status === 'completed') ? 'completed' : 'ongoing';
}

exports.addMilestone = async (req, res) => {
  const { projectId, name } = req.body;

  try {
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create the milestone and link it to the project
    const milestone = new Milestone({ name, project: project._id, tasks: [] });
    await milestone.save();

    // Add the milestone to the project
    project.milestones.push(milestone._id);
    await project.save();

    res.status(201).json(milestone);
  } catch (error) {
    console.error('Error adding milestone:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
exports.addSubTask = async (req, res) => {
  const { milestoneId, taskName } = req.body;

  try {
     const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    milestone.tasks.push({ name: taskName });
    milestone.status = calculateMilestoneStatus(milestone.tasks);

    await milestone.save();
    res.status(201).json(milestone);
  } catch (error) {
    console.error('Error adding subtask:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
exports.editMilestone = async (req, res) => {
  const { milestoneId, name } = req.body;

  try {
    const milestone = await Milestone.findById(milestoneId).populate('project', 'leader');
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    // Remove leader check – allow any intern to edit milestone
    if (name) {
      milestone.name = name;
      await milestone.save();
    }

    res.json({ message: 'Milestone updated successfully', milestone });
  } catch (error) {
    console.error('Error editing milestone:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.deleteMilestone = async (req, res) => {
  const { milestoneId } = req.body;

  try {
    const milestone = await Milestone.findById(milestoneId).populate('project', 'leader milestones');
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    // Remove leader check – allow any intern to delete milestone
    await Project.findByIdAndUpdate(milestone.project._id, {
      $pull: { milestones: milestone._id },
    });

    await Milestone.findByIdAndDelete(milestoneId);

    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.editSubTask = async (req, res) => {
  const { milestoneId, taskIndex, taskName } = req.body;

  try {
    const milestone = await Milestone.findById(milestoneId).populate('project');
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    // Remove leader check – allow any intern to edit subtasks
    milestone.tasks[taskIndex].name = taskName;
    await milestone.save();

    res.json(milestone);
  } catch (error) {
    console.error('Error editing subtask:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.deleteSubTask = async (req, res) => {
  const { milestoneId, taskIndex } = req.body;

  try {
    const milestone = await Milestone.findById(milestoneId).populate('project');
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    // Remove leader check – allow any intern to delete subtasks
    milestone.tasks.splice(taskIndex, 1);
    milestone.status = calculateMilestoneStatus(milestone.tasks);
    await milestone.save();

    res.json(milestone);
  } catch (error) {
    console.error('Error deleting subtask:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.toggleSubTaskStatus = async (req, res) => {
  const { internId } = req.params;
  const { milestoneId, taskIndex } = req.body;

  try {
    const milestone = await Milestone.findById(milestoneId);
    const subtask = milestone.tasks[taskIndex];

    if (subtask.status === "completed") {
      subtask.status = "ongoing";
      subtask.completedBy = null;
    } else {
      subtask.status = "completed";
      subtask.completedBy = internId;
    }

    milestone.status = calculateMilestoneStatus(milestone.tasks);
    await milestone.save();

    res.json(milestone);
  } catch (error) {
    console.error("Error toggling subtask:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
exports.toggleMilestoneStatus = async (req, res) => {
  try {
    const milestoneId = req.params.milestoneId;
    const milestone = await Milestone.findById(milestoneId).populate('tasks');

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const hasTasks = milestone.tasks && milestone.tasks.length > 0;
    const allTasksCompleted = hasTasks && milestone.tasks.every(task => task.status === 'completed');

    let newStatus = 'ongoing'; // default

    if (hasTasks && allTasksCompleted) {
      newStatus = 'completed';
    }

    // If no tasks at all, make sure it's not marked as completed
    if (!hasTasks) {
      newStatus = 'ongoing';
    }

    milestone.status = newStatus;
    await milestone.save();

    res.status(200).json({
      message: `Milestone status set to ${newStatus}`,
      milestone
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




