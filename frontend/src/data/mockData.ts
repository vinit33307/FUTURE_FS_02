import { Lead, Task, Email, User, Activity, Notification } from './types';

export const leads: Lead[] = [
  { id: '1', fullName: 'Julianne Devis', email: 'j.devis@skyline.com', phone: '+1 (555) 019-2234', company: 'Skyline Interactive', source: 'LinkedIn', status: 'Qualified', priority: 'High', assignedTo: 'Alex Sterling', notes: 'Interested in enterprise plan', createdAt: '2024-09-10', leadScore: 94, estimatedValue: 45000, tags: ['Enterprise'], avatar: '' },
  { id: '2', fullName: 'Marcus Raine', email: 'm.raine@nexus.io', phone: '+1 (555) 012-9981', company: 'Nexus Logistics', source: 'Referral', status: 'Contacted', priority: 'Medium', assignedTo: 'Sarah Jenkins', notes: 'Follow up next week', createdAt: '2024-09-08', leadScore: 72, estimatedValue: 32500, tags: ['Mid Market'], avatar: '' },
  { id: '3', fullName: 'Sarah Landers', email: 's.landers@vertex.com', phone: '+1 (555) 098-1122', company: 'Vertex Media', source: 'Direct', status: 'New', priority: 'High', assignedTo: 'Alex Sterling', notes: 'Inbound from website', createdAt: '2024-09-12', leadScore: 65, estimatedValue: 28000, tags: ['Mid Market'], avatar: '' },
  { id: '4', fullName: 'Brian Porter', email: 'b.porter@cloudcore.io', phone: '+1 (555) 033-4412', company: 'CloudCore Solutions', source: 'Conference', status: 'New', priority: 'Low', assignedTo: 'Elena Rodriguez', notes: 'Met at tech summit', createdAt: '2024-09-11', leadScore: 40, estimatedValue: 12000, tags: ['SMB'], avatar: '' },
  { id: '5', fullName: 'Julian Vane', email: 'j.vane@archstudio.com', phone: '+44 20 7946 0123', company: 'Vane & Associates', source: 'Referral', status: 'Qualified', priority: 'High', assignedTo: 'Sarah Jenkins', notes: 'High intent, proposal sent', createdAt: '2024-09-05', leadScore: 94, estimatedValue: 245000, tags: ['Enterprise', 'High Intent'], avatar: '' },
  { id: '6', fullName: 'David Miller', email: 'd.miller@neonlofts.com', phone: '+1 (555) 887-3321', company: 'Neon Studio Lofts', source: 'Facebook', status: 'New', priority: 'Medium', assignedTo: 'David Chen', notes: 'Interested in starter plan', createdAt: '2024-09-13', leadScore: 55, estimatedValue: 12500, tags: ['SMB', 'High Priority'], avatar: '' },
  { id: '7', fullName: 'Elena Rossi', email: 'e.rossi@catalyst.io', phone: '+1 (555) 445-2290', company: 'The Catalyst Hub', source: 'Social Media', status: 'Contacted', priority: 'Medium', assignedTo: 'Elena Rodriguez', notes: 'Demo scheduled', createdAt: '2024-09-09', leadScore: 68, estimatedValue: 28000, tags: ['Mid Market'], avatar: '' },
  { id: '8', fullName: 'Mark Thompson', email: 'm.thompson@bridgeview.com', phone: '+1 (555) 776-9901', company: 'Bridgeview Residency', source: 'Website', status: 'Qualified', priority: 'High', assignedTo: 'Alex Sterling', notes: '94% lead score', createdAt: '2024-09-04', leadScore: 91, estimatedValue: 110000, tags: ['Enterprise', 'High Intent'], avatar: '' },
  { id: '9', fullName: 'Lisa Chang', email: 'l.chang@horizonplan.com', phone: '+1 (555) 332-8877', company: 'Horizon Urban Planning', source: 'LinkedIn', status: 'Converted', priority: 'High', assignedTo: 'Sarah Jenkins', notes: 'Signed enterprise deal', createdAt: '2024-08-15', leadScore: 98, estimatedValue: 54000, tags: ['Enterprise'], avatar: '' },
  { id: '10', fullName: 'Tom Wright', email: 't.wright@apexdesign.co', phone: '+1 (555) 221-4456', company: 'Apex Architecture', source: 'Conference', status: 'Lost', priority: 'Low', assignedTo: 'David Chen', notes: 'Went with competitor', createdAt: '2024-08-20', leadScore: 25, estimatedValue: 12000, tags: ['SMB'], avatar: '' },
  { id: '11', fullName: 'Nina Patel', email: 'n.patel@techforge.io', phone: '+1 (555) 998-7766', company: 'TechForge Inc', source: 'Website', status: 'Converted', priority: 'Medium', assignedTo: 'Elena Rodriguez', notes: 'Closed mid-market deal', createdAt: '2024-08-10', leadScore: 88, estimatedValue: 38000, tags: ['Mid Market'], avatar: '' },
  { id: '12', fullName: 'Ryan Cooper', email: 'r.cooper@pinnacle.com', phone: '+1 (555) 112-3344', company: 'Pinnacle Group', source: 'Referral', status: 'Lost', priority: 'Medium', assignedTo: 'Alex Sterling', notes: 'Budget constraints', createdAt: '2024-08-25', leadScore: 30, estimatedValue: 22000, tags: ['Mid Market'], avatar: '' },
];

export const tasks: Task[] = [
  { id: '1', title: 'Audit', description: 'Complete Q3 audit review', assignee: 'Alex Sterling', status: 'In Progress', priority: 'High', dueDate: '2024-09-15' },
  { id: '2', title: 'Client Onboarding - Stellar Corp', description: 'Complete onboarding documentation', assignee: 'Sarah Jenkins', status: 'To Do', priority: 'Medium', dueDate: '2024-09-18', leadId: '9', leadName: 'Lisa Chang' },
  { id: '3', title: 'Draft Pitch Deck for Investor Round', description: 'Prepare investor materials', assignee: 'Elena Rodriguez', status: 'Completed', priority: 'Low', dueDate: '2024-09-10' },
  { id: '4', title: 'Architect CRM v2.0 UI Review', description: 'Review and approve new UI designs', assignee: 'Marcus Chen', status: 'In Progress', priority: 'High', dueDate: '2024-09-14' },
  { id: '5', title: 'Data Migration - Legacy Systems', description: 'Migrate data from old CRM', assignee: 'David Chen', status: 'To Do', priority: 'Medium', dueDate: '2024-09-20' },
  { id: '6', title: 'Follow up with Julian Vane', description: 'Send proposal follow-up email', assignee: 'Sarah Jenkins', status: 'To Do', priority: 'High', dueDate: '2024-09-13', leadId: '5', leadName: 'Julian Vane' },
  { id: '7', title: 'Review planning docs', description: 'Check structural plans for Surrey project', assignee: 'Alex Sterling', status: 'To Do', priority: 'High', dueDate: '2024-09-14' },
  { id: '8', title: 'Schedule site visit', description: 'Arrange visit to Paddington office', assignee: 'Sarah Jenkins', status: 'To Do', priority: 'Medium', dueDate: '2024-10-24' },
];

export const emails: Email[] = [
  { id: '1', from: 'Alex Rivera', fromEmail: 'alex.rivera@designstudio.com', to: 'Marcus Chen', subject: 'Draft Proposal: Q4 Interior Design Project', preview: "Hey Marcus, I've finished the initial layout sketches for the hotel lobby. There are some interesting asymmetrical patterns...", body: "Hi Marcus,\n\nI've finally consolidated the team's feedback into the draft proposal for the upcoming Q4 interior project. As we discussed, we're leaning heavily into a more Structured Etherealism look — balancing the industrial elements with soft, diffused lighting and glass surfaces.\n\nBest regards,\nAlex", timestamp: 'Just now', read: false, starred: false, labels: [], folder: 'inbox' },
  { id: '2', from: 'Sarah Jenkins', fromEmail: 's.jenkins@architect.com', to: 'Marcus Chen', subject: 'Meeting reschedule for Monday', preview: 'Can we move our sync to 3 PM? I have a client onsite at the construction zone...', body: 'Hi Marcus, Can we move our sync to 3 PM? I have a client onsite at the construction zone that morning. Thanks, Sarah', timestamp: '14:20 PM', read: false, starred: false, labels: [], folder: 'inbox' },
  { id: '3', from: 'Project Lead Bot', fromEmail: 'bot@architect.com', to: 'Marcus Chen', subject: 'Daily Insight: Lead Scoring Updated', preview: 'You have 5 new high-intent leads from the architectural forum. View the breakdown...', body: 'Your daily lead scoring report is ready. 5 new high-intent leads identified.', timestamp: '11:05 AM', read: true, starred: false, labels: ['Auto-Report'], folder: 'inbox' },
  { id: '4', from: 'Elena Rodriguez', fromEmail: 'e.rodriguez@architect.com', to: 'Marcus Chen', subject: 'Invoice #9942 - Approved', preview: 'The finance team has cleared the payment for the marble sourcing. Please check the portal...', body: 'Hi Marcus, The invoice has been approved. Please proceed with the order. Elena', timestamp: 'Yesterday', read: true, starred: false, labels: [], folder: 'inbox' },
  { id: '5', from: 'David Miller', fromEmail: 'd.miller@neonlofts.com', to: 'Marcus Chen', subject: 'Drafting Software Renewal', preview: 'Our enterprise license is expiring in 15 days. I recommend the Architect Pro tier upgrade...', body: 'Hi Marcus, Heads up on the license renewal. David', timestamp: 'Yesterday', read: true, starred: true, labels: [], folder: 'inbox' },
];

export const users: User[] = [
  { id: '1', name: 'Sarah Hudson', email: 's.hudson@architect.com', role: 'Admin', status: 'Active', lastAuth: '2 mins ago', initials: 'SH' },
  { id: '2', name: 'Marcus Vane', email: 'm.vane@architect.com', role: 'Editor', status: 'Active', lastAuth: '3 hours ago', initials: 'MV' },
  { id: '3', name: 'Elena Lourd', email: 'e.lourd@architect.com', role: 'Viewer', status: 'Inactive', lastAuth: '4 days ago', initials: 'EL' },
];

export const activities: Activity[] = [
  { id: '1', leadId: '5', type: 'email', description: 'Email Sent: Follow-up on Proposal', timestamp: 'Today, 10:45 AM', user: 'Alex Rivera' },
  { id: '2', leadId: '5', type: 'call', description: 'Outgoing Call: Discovery', timestamp: 'Yesterday, 4:20 PM', user: 'Sarah Jenkins' },
  { id: '3', leadId: '5', type: 'note', description: 'Document Created: Project Scope V1', timestamp: 'Oct 12, 11:30 AM', user: 'Elena Rodriguez' },
  { id: '4', leadId: '1', type: 'status_change', description: 'Lead status changed to Qualified', timestamp: 'Today, 9:15 AM', user: 'Alex Sterling' },
  { id: '5', leadId: '9', type: 'status_change', description: 'Lead converted to customer', timestamp: 'Yesterday, 2:00 PM', user: 'Sarah Jenkins' },
  { id: '6', leadId: '3', type: 'email', description: 'Welcome email sent', timestamp: 'Today, 8:30 AM', user: 'System' },
];

export const notifications: Notification[] = [
  { id: '1', title: 'New Lead Added', message: 'Sarah Landers from Vertex Media was added', type: 'info', read: false, timestamp: '2 mins ago' },
  { id: '2', title: 'Task Deadline', message: 'Audit review is due tomorrow', type: 'warning', read: false, timestamp: '1 hour ago' },
  { id: '3', title: 'Lead Converted', message: 'Lisa Chang has been converted to customer', type: 'success', read: true, timestamp: 'Yesterday' },
  { id: '4', title: 'Failed Login Attempt', message: 'Detected from IP 192.168.1.45', type: 'error', read: true, timestamp: 'Yesterday' },
];

export const dashboardStats = {
  totalLeads: 1284,
  newToday: 24,
  converted: 86,
  lost: 12,
  conversionRate: 24.8,
  avgResponseTime: 2.4,
  avgDealCycle: 18,
  estimatedRevenue: 842500,
};

export const chartData = {
  revenueGrowth: [
    { month: 'Jan', projected: 40000, actual: 38000 },
    { month: 'Feb', projected: 45000, actual: 42000 },
    { month: 'Mar', projected: 50000, actual: 48000 },
    { month: 'Apr', projected: 55000, actual: 52000 },
    { month: 'May', projected: 60000, actual: 58000 },
    { month: 'Jun', projected: 65000, actual: 0 },
    { month: 'Jul', projected: 70000, actual: 0 },
  ],
  leadGrowth: [
    { day: 'Mon', leads: 30 },
    { day: 'Tue', leads: 45 },
    { day: 'Wed', leads: 55 },
    { day: 'Thu', leads: 70 },
    { day: 'Fri', leads: 85 },
    { day: 'Sat', leads: 95 },
    { day: 'Sun', leads: 60 },
  ],
  leadSources: [
    { name: 'Direct Search', value: 45, color: 'hsl(245, 58%, 51%)' },
    { name: 'Social Media', value: 30, color: 'hsl(280, 65%, 60%)' },
    { name: 'Referrals', value: 25, color: 'hsl(220, 13%, 80%)' },
  ],
  conversionFunnel: [
    { stage: 'Awareness', value: 4200 },
    { stage: 'Interest', value: 2940 },
    { stage: 'Consideration', value: 1323 },
    { stage: 'Conversion', value: 317 },
  ],
};
