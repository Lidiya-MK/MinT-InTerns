const Intern = require('../models/Intern');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Project = require("../models/Project");
const Supervisor = require('../models/Supervisor');
const mongoose = require('mongoose');
const Milestone = require('../models/Milestone');
const Task = require('../models/Task');


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

exports.updateInternProfile = async (req, res) => {
  const internId = req.params.id;
  const { email, password } = req.body;
  const profilePicture = req.file ? req.file.path : undefined; // Assuming file upload middleware like multer

  try {
    const intern = await Intern.findById(internId);
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found.' });
    }

    // Update email if provided and different
    if (email && email !== intern.email) {
      // Optional: you might want to check for uniqueness here
      intern.email = email;
    }

    // Update password if provided (hash it)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      intern.password = await bcrypt.hash(password, salt);
    }

    // Update profile picture if provided
    if (profilePicture) {
      intern.profilePicture = profilePicture;
    }

    await intern.save();

    // Optionally omit password from response
    const internObj = intern.toObject();
    delete internObj.password;

    res.json({ message: 'Profile updated successfully', intern: internObj });
  } catch (error) {
    console.error('Error updating intern profile:', error);
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
      return res.status(400).json({ message: "Invalid intern ID" });
    }

    // Find all projects where the intern is a leader or a team member
    const projects = await Project.find({
      $or: [{ leader: internId }, { members: internId }],
    })
      .populate("leader", "name email")
      .populate("members", "name email")
      .lean(); // Use .lean() to modify plain objects later

    // Fetch milestones and their tasks for each project
    for (let project of projects) {
      const milestones = await Milestone.find({ project: project._id })
        .lean();

      for (let milestone of milestones) {
        const tasks = await Task.find({ milestone: milestone._id })
          .populate("completedBy", "name email")
          .lean();

        milestone.tasks = tasks;
      }

      project.milestones = milestones;
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects for intern:", error);
    res.status(500).json({ error: "Something went wrong" });
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
  const { milestoneId } = req.params;
  const { taskName } = req.body;

  try {
    const milestone = await Milestone.findById(milestoneId).populate('project');
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const newTask = new Task({
      name: taskName,
      milestone: milestone._id,
      project: milestone.project._id,
    });

    await newTask.save();

    res.status(201).json({
      message: 'Subtask added successfully',
      task: newTask,
    });
  } catch (error) {
    console.error('Error adding subtask:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
exports.editMilestone = async (req, res) => {
  const { milestoneId } = req.params;
  const { name } = req.body;

  try {
    const milestone = await Milestone.findById(milestoneId).populate('project', 'leader');
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

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
 const { milestoneId } = req.params;


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
  const { milestoneId, taskId } = req.params;
  const { name } = req.body; // ✅ must match Mongoose schema

  try {
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, milestone: milestoneId },
      { name },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Subtask not found.' });
    }

    res.json({ message: 'Subtask updated.', task });
  } catch (error) {
    console.error('Error editing subtask:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


exports.deleteSubTask = async (req, res) => {
  const { milestoneId, taskId } = req.params;

  try {
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    const task = await Task.findOne({ _id: taskId, milestone: milestoneId });
    if (!task) {
      return res.status(404).json({ message: 'Subtask not found.' });
    }

    await Task.findByIdAndDelete(taskId);

    // Re-fetch tasks related to this milestone to recalculate status
    const remainingTasks = await Task.find({ milestone: milestoneId });

    milestone.status = calculateMilestoneStatus(remainingTasks);
    await milestone.save();

    res.json({ message: 'Subtask deleted.', milestone });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.toggleSubTaskStatus = async (req, res) => {
  const { internId } = req.params;
  const { milestoneId, taskId } = req.body;

  try {
    const task = await Task.findOne({ _id: taskId, milestone: milestoneId });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Toggle status
    if (task.status === "completed") {
      task.status = "ongoing";
      task.completedBy = null;
    } else {
      task.status = "completed";
      task.completedBy = internId;
    }

    await task.save();

    // Recalculate milestone status
    const tasks = await Task.find({ milestone: milestoneId });
    const completedTasks = tasks.filter(t => t.status === "completed");
    const milestone = await Milestone.findById(milestoneId);

    milestone.status = completedTasks.length === tasks.length ? "completed" : "ongoing";
    await milestone.save();

    res.status(200).json({ message: "Task status updated", task });
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




