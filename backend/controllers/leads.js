const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res, next) => {
  try {
    let query;

    // If Admin/Manager, get all, otherwise get assigned to me
    if (req.user.role === 'Admin' || req.user.role === 'Manager') {
      query = Lead.find().populate('assignedTo', 'name email');
    } else {
      query = Lead.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email');
    }

    const leads = await query;

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res, next) => {
  try {
    // Add user to req.body if not specified
    if (!req.body.assignedTo) {
        req.body.assignedTo = req.user.id;
    }

    const lead = await Lead.create(req.body);

    // Track activity
    await Activity.create({
        leadId: lead._id,
        type: 'note',
        description: `New lead created: ${lead.fullName}`,
        user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res, next) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    // Capture status change for activity
    if (req.body.status && req.body.status !== lead.status) {
        await Activity.create({
            leadId: lead._id,
            type: 'status_change',
            description: `Lead status changed from ${lead.status} to ${req.body.status}`,
            user: req.user.id
        });
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get lead analytics/stats
// @route   GET /api/leads/stats
// @access  Private
exports.getLeadStats = async (req, res, next) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const converted = await Lead.countDocuments({ status: 'Converted' });
        const lost = await Lead.countDocuments({ status: 'Lost' });
        const newToday = await Lead.countDocuments({ 
            createdAt: { $gte: new Date().setHours(0,0,0,0) } 
        });

        const stats = {
            totalLeads,
            newToday,
            converted,
            lost,
            conversionRate: totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) : 0,
            estimatedRevenue: (await Lead.aggregate([
                { $group: { _id: null, total: { $sum: "$estimatedValue" } } }
            ]))[0]?.total || 0
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
