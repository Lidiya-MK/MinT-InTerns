const Administrator = require('../models/Administrator');

const initializeAdmin = async () => {
  const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
  const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  const exists = await Administrator.findOne({ email: defaultEmail });

  if (!exists) {
    await Administrator.create({
      name: 'Default Admin',
      email: defaultEmail,
      password: defaultPassword,
    });
    console.log('✅ Built-in administrator created');
  } else {
    console.log('ℹ️ Built-in administrator already exists');
  }
};




module.exports = initializeAdmin;
