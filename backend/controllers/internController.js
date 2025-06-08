const Intern = require('../models/Intern');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Project = require("../models/Project");
const Supervisor = require('../models/Supervisor');
const mongoose = require('mongoose');


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




