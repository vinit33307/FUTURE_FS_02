import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Lead, Task, Email, Activity, Notification, LeadStatus } from '@/data/types';
import { leadService, taskService, activityService } from '@/services/api';
import { emails as initialEmails, notifications as initialNotifications } from '@/data/mockData';
import { useAuth } from './AuthContext';

interface CRMContextType {
  leads: Lead[];
  tasks: Task[];
  emails: Email[];
  activities: Activity[];
  notifications: Notification[];
  theme: 'light' | 'dark';
  loading: boolean;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'leadScore'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'assignee'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id'>) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleTheme: () => void;
  getLeadById: (id: string) => Lead | undefined;
  getActivitiesForLead: (leadId: string) => Activity[];
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [emails] = useState<Email[]>(initialEmails);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [leadsRes, tasksRes, activitiesRes] = await Promise.all([
        leadService.getLeads(),
        taskService.getTasks(),
        activityService.getActivities()
      ]);
      setLeads(leadsRes.data.data);
      setTasks(tasksRes.data.data);
      setActivities(activitiesRes.data.data);
    } catch (err) {
      console.error('Failed to fetch CRM data', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addLead = useCallback(async (lead: Omit<Lead, 'id' | 'createdAt' | 'leadScore'>) => {
    try {
      const res = await leadService.createLead(lead);
      setLeads(prev => [res.data.data, ...prev]);
      fetchData(); // Refresh activities and stats
    } catch (err) {
      console.error('Failed to add lead', err);
      throw err;
    }
  }, [fetchData]);

  const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
    try {
      const res = await leadService.updateLead(id, updates);
      setLeads(prev => prev.map(l => l.id === id ? res.data.data : l));
      fetchData();
    } catch (err) {
      console.error('Failed to update lead', err);
      throw err;
    }
  }, [fetchData]);

  const deleteLead = useCallback(async (id: string) => {
    try {
      await leadService.deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete lead', err);
      throw err;
    }
  }, []);

  const updateLeadStatus = useCallback(async (id: string, status: LeadStatus) => {
    await updateLead(id, { status });
  }, [updateLead]);

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'assignee'>) => {
    try {
      const res = await taskService.createTask(task);
      setTasks(prev => [res.data.data, ...prev]);
      fetchData();
    } catch (err) {
      console.error('Failed to add task', err);
      throw err;
    }
  }, [fetchData]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const res = await taskService.updateTask(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? res.data.data : t));
    } catch (err) {
      console.error('Failed to update task', err);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task', err);
      throw err;
    }
  }, []);

  const addActivity = useCallback(async (activity: Omit<Activity, 'id'>) => {
    // Currently activities are mostly side-effects of lead/task actions
    // but we can add an direct add if needed
    console.log('Direct activity add not yet fully implemented via service');
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  }, []);

  const getLeadById = useCallback((id: string) => leads.find(l => (l.id === id || (l as any)._id === id)), [leads]);
  const getActivitiesForLead = useCallback((leadId: string) => activities.filter(a => (a.leadId as any)._id === leadId || (a.leadId as any) === leadId), [activities]);

  return (
    <CRMContext.Provider value={{
      leads, tasks, emails, activities, notifications, theme, loading,
      addLead, updateLead, deleteLead, updateLeadStatus,
      addTask, updateTask, deleteTask, addActivity,
      markNotificationRead, markAllNotificationsRead, toggleTheme,
      getLeadById, getActivitiesForLead,
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error('useCRM must be used within CRMProvider');
  return ctx;
}
