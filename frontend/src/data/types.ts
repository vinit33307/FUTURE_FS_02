export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
export type LeadPriority = 'Low' | 'Medium' | 'High';
export type LeadSource = 'Website' | 'LinkedIn' | 'Referral' | 'Facebook' | 'Conference' | 'Direct' | 'Social Media';

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  assignedTo: string;
  notes: string;
  createdAt: string;
  leadScore: number;
  estimatedValue: number;
  tags: string[];
  avatar?: string;
}

export interface Activity {
  id: string;
  leadId: string;
  type: 'email' | 'call' | 'note' | 'meeting' | 'status_change' | 'task';
  description: string;
  timestamp: string;
  user: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeAvatar?: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  priority: LeadPriority;
  dueDate: string;
  leadId?: string;
  leadName?: string;
}

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  labels: string[];
  folder: 'inbox' | 'sent' | 'drafts' | 'starred' | 'trash';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastAuth: string;
  avatar?: string;
  initials: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}
