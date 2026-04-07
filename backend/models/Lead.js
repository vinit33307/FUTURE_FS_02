const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  source: {
    type: String,
    enum: ['Website', 'LinkedIn', 'Referral', 'Facebook', 'Conference', 'Direct', 'Social Media'],
    default: 'Direct'
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String
  },
  leadScore: {
    type: Number,
    default: 0
  },
  estimatedValue: {
    type: Number,
    default: 0
  },
  tags: [String],
  avatar: String,
  createdAt: {
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

// Calculate lead score before saving (basic logic)
LeadSchema.pre('save', async function() {
  if (this.isModified('email') || this.isNew) {
      // Basic AI-style scoring simulation
      let score = 50;
      if (this.email && (this.email.endsWith('.com') || this.email.endsWith('.io'))) score += 10;
      if (this.priority === 'High') score += 20;
      if (this.status === 'Qualified') score += 15;
      this.leadScore = Math.min(score, 100);
  }
});

module.exports = mongoose.model('Lead', LeadSchema);
