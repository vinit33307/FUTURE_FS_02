import api from '../lib/axios';
import { Lead, Task, Activity, User, Notification } from '../data/types';

export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const leadService = {
  getLeads: () => api.get('/leads'),
  getLead: (id: string) => api.get(`/leads/${id}`),
  createLead: (data: any) => api.post('/leads', data),
  updateLead: (id: string, data: any) => api.put(`/leads/${id}`, data),
  deleteLead: (id: string) => api.delete(`/leads/${id}`),
  getStats: () => api.get('/leads/stats'),
};

export const taskService = {
  getTasks: () => api.get('/tasks'),
  createTask: (data: any) => api.post('/tasks', data),
  updateTask: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
};

export const activityService = {
  getActivities: () => api.get('/activities'),
  getLeadActivities: (leadId: string) => api.get(`/activities/lead/${leadId}`),
};
