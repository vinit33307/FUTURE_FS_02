const Activity = require('../models/Activity');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
exports.getActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 }).populate('leadId', 'fullName company');

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get lead specific activities
// @route   GET /api/activities/lead/:leadId
// @access  Private
exports.getLeadActivities = async (req, res, next) => {
    try {
      const activities = await Activity.find({ leadId: req.params.leadId }).sort({ timestamp: -1 });
  
      res.status(200).json({
        success: true,
        count: activities.length,
        data: activities
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
