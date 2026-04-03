import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Lead, Task, Email, Activity, Notification, LeadStatus } from '@/data/types';
import { leads as initialLeads, tasks as initialTasks, emails as initialEmails, activities as initialActivities, notifications as initialNotifications } from '@/data/mockData';

interface CRMContextType {
  leads: Lead[];
  tasks: Task[];
  emails: Email[];
  activities: Activity[];
  notifications: Notification[];
  theme: 'light' | 'dark';
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'leadScore'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleTheme: () => void;
  getLeadById: (id: string) => Lead | undefined;
  getActivitiesForLead: (leadId: string) => Activity[];
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [emails] = useState<Email[]>(initialEmails);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  const addLead = useCallback((lead: Omit<Lead, 'id' | 'createdAt' | 'leadScore'>) => {
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      leadScore: Math.floor(Math.random() * 40) + 30,
    };
    setLeads(prev => [newLead, ...prev]);
    setActivities(prev => [{
      id: Date.now().toString(),
      leadId: newLead.id,
      type: 'note',
      description: `New lead created: ${newLead.fullName} from ${newLead.company}`,
      timestamp: 'Just now',
      user: 'System',
    }, ...prev]);
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'New Lead Added',
      message: `${newLead.fullName} from ${newLead.company} was added`,
      type: 'info',
      read: false,
      timestamp: 'Just now',
    }, ...prev]);
  }, []);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  }, []);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    const lead = leads.find(l => l.id === id);
    if (lead) {
      setActivities(prev => [{
        id: Date.now().toString(),
        leadId: id,
        type: 'status_change',
        description: `Lead status changed to ${status}`,
        timestamp: 'Just now',
        user: 'Alex Sterling',
      }, ...prev]);
    }
  }, [leads]);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    setTasks(prev => [{ ...task, id: Date.now().toString() }, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
    setActivities(prev => [{ ...activity, id: Date.now().toString() }, ...prev]);
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

  const getLeadById = useCallback((id: string) => leads.find(l => l.id === id), [leads]);
  const getActivitiesForLead = useCallback((leadId: string) => activities.filter(a => a.leadId === leadId), [activities]);

  return (
    <CRMContext.Provider value={{
      leads, tasks, emails, activities, notifications, theme,
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
