const Intern = require('../models/Intern');

exports.applyIntern = async (req, res) => {
  try {
    const {
      name,
      email,
      university,
      CGPA
    } = req.body;

    const documents = req.files?.documents?.map(file => file.path) || [];
    const profilePicture = req.files?.profilePicture?.[0]?.path || '';

    const newIntern = new Intern({
      name,
      email,
      university,
      CGPA,
      documents,
      profilePicture
    });

    await newIntern.save();
    res.status(201).json({ message: 'Intern application submitted', intern: newIntern });
  } catch (error) {
    console.error('Intern application error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

