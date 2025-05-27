const Cohort = require('../models/Cohort');


exports.getActiveCohorts = async (req, res) => {
  try {
    const now = new Date();
    const activeCohorts = await Cohort.find({ applicationEnd: { $gte: now } }).sort({ applicationStart: 1 });

    if (activeCohorts.length === 0) {
      return res.status(200).json({ message: 'No active cohorts to display.' });
    }

    res.status(200).json(activeCohorts);
  } catch (error) {
    console.error('Error fetching active cohorts:', error);
    res.status(500).json({ error: 'Failed to fetch active cohorts' });
  }
};


exports.getOngoingCohorts = async (req, res) => {
  try {
    const now = new Date();
    const ongoingCohorts = await Cohort.find({
      applicationStart: { $lte: now },
      applicationEnd: { $gte: now },
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


exports.getPastCohorts = async (req, res) => {
  try {
    const now = new Date();
    const pastCohorts = await Cohort.find({
      applicationEnd: { $lt: now },
    }).sort({ applicationEnd: -1 });

    if (pastCohorts.length === 0) {
      return res.status(200).json({ message: 'No past cohorts to display.' });
    }

    res.status(200).json(pastCohorts);
  } catch (error) {
    console.error('Error fetching past cohorts:', error);
    res.status(500).json({ error: 'Failed to fetch past cohorts' });
  }
};
