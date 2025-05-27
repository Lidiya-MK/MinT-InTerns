const Intern = require('../models/Intern');
const bcrypt = require('bcryptjs');

exports.applyIntern = async (req, res) => {
  try {
    const {
      name,
      email,
      university,
      CGPA,
      cohort,
    } = req.body;

    const documents = req.files?.documents?.map(file => file.path) || [];
    const profilePicture = req.files?.profilePicture?.[0]?.path || '';

    // Hash the email to use as password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(email, salt);

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
