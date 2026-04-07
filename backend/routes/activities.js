const express = require('express');
const {
  getActivities,
  getLeadActivities
} = require('../controllers/activities');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getActivities);
router.route('/lead/:leadId').get(getLeadActivities);

module.exports = router;
