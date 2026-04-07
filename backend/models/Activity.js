const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lead',
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'call', 'note', 'meeting', 'status_change', 'task'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Activity', ActivitySchema);
