const Intern = require('../models/Intern');


exports.getPendingInterns = async (req, res) => {
  try {
    const pendingInterns = await Intern.find({ status: 'pending' });
    res.status(200).json(pendingInterns);
  } catch (err) {
    console.error('Admin fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
