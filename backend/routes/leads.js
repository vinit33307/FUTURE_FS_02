const express = require('express');
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats
} = require('../controllers/leads');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/stats').get(getLeadStats);

router
  .route('/')
  .get(getLeads)
  .post(createLead);

router
  .route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(deleteLead);

module.exports = router;
