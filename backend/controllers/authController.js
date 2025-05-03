const Administrator = require('../models/Administrator');
const generateToken = require('../utils/generateToken');

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Administrator.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

exports.createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await Administrator.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Admin already exists' });

  const newAdmin = await Administrator.create({ name, email, password });
  res.status(201).json({ message: 'Admin created', adminId: newAdmin._id });
};
