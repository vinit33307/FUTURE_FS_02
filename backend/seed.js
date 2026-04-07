const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Lead = require('./models/Lead');
const Task = require('./models/Task');
const Activity = require('./models/Activity');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Lead.deleteMany();
        await Task.deleteMany();
        await Activity.deleteMany();

        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = await User.create({
            name: 'Sarah Hudson',
            email: 'admin@leadflow.com',
            password: 'admin123', // Will be hashed by pre-save
            role: 'Admin',
            initials: 'SH',
            status: 'Active'
        });

        const rep = await User.create({
            name: 'Alex Sterling',
            email: 'alex@leadflow.com',
            password: 'password123',
            role: 'Sales Representative',
            initials: 'AS',
            status: 'Active'
        });

        console.log('Users seeded.');

        // Seed Leads
        const leads = await Lead.create([
            { fullName: 'Julianne Devis', email: 'j.devis@skyline.com', phone: '+1 (555) 019-2234', company: 'Skyline Interactive', source: 'LinkedIn', status: 'Qualified', priority: 'High', assignedTo: admin._id, estimatedValue: 45000, tags: ['Enterprise'] },
            { fullName: 'Marcus Raine', email: 'm.raine@nexus.io', phone: '+1 (555) 012-9981', company: 'Nexus Logistics', source: 'Referral', status: 'Contacted', priority: 'Medium', assignedTo: rep._id, estimatedValue: 32500, tags: ['Mid Market'] },
            { fullName: 'Sarah Landers', email: 's.landers@vertex.com', phone: '+1 (555) 098-1122', company: 'Vertex Media', source: 'Direct', status: 'New', priority: 'High', assignedTo: admin._id, estimatedValue: 28000, tags: ['Mid Market'] },
            { fullName: 'Julian Vane', email: 'j.vane@archstudio.com', phone: '+44 20 7946 0123', company: 'Vane & Associates', source: 'Referral', status: 'Qualified', priority: 'High', assignedTo: rep._id, estimatedValue: 245000, tags: ['Enterprise', 'High Intent'] }
        ]);

        console.log('Leads seeded.');

        // Seed Tasks
        await Task.create([
            { title: 'Audit Review', description: 'Complete Q3 audit review', assignee: admin._id, status: 'In Progress', priority: 'High', dueDate: new Date('2026-04-15') },
            { title: 'Follow up with Julian Vane', description: 'Send proposal follow-up email', assignee: rep._id, status: 'To Do', priority: 'High', dueDate: new Date('2026-04-13'), leadId: leads[3]._id }
        ]);

        console.log('Tasks seeded.');

        console.log('Data Seeding Complete!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
