import { useState } from 'react';
import { useCRM } from '@/context/CRMContext';
import { Task } from '@/data/types';
import { Plus, ChevronLeft, ChevronRight, Filter, ArrowUpDown, Check, X, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const statusColors: Record<string, string> = {
  'To Do': 'bg-secondary text-secondary-foreground',
  'In Progress': 'bg-primary/10 text-primary',
  'Completed': 'bg-success/10 text-success',
};

const priorityColors: Record<string, string> = {
  High: 'text-destructive',
  Medium: 'text-warning',
  Low: 'text-muted-foreground',
};

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useCRM();
  const [activeTab, setActiveTab] = useState('All Tasks');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: '', description: '', assignee: 'Alex Sterling', status: 'To Do' as Task['status'], priority: 'Medium' as Task['priority'], dueDate: '' });
  const tabs = ['All Tasks', 'In Progress', 'Completed'];

  const filteredTasks = activeTab === 'All Tasks' ? tasks : tasks.filter(t => t.status === (activeTab === 'Completed' ? 'Completed' : 'In Progress'));

  const daysOfMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const today = new Date().getDate();

  const openCreate = () => {
    setEditingTask(null);
    setForm({ title: '', description: '', assignee: 'Alex Sterling', status: 'To Do', priority: 'Medium', dueDate: '' });
    setTaskDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description, assignee: task.assignee, status: task.status, priority: task.priority, dueDate: task.dueDate });
    setTaskDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    if (editingTask) {
      updateTask(editingTask.id, form);
    } else {
      addTask(form);
    }
    setTaskDialogOpen(false);
  };

  const inputClass = "w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Orchestration</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your workflow and upcoming milestones.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-lg">{new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}</h3>
            <div className="flex gap-1">
              <button className="p-1 rounded hover:bg-secondary transition-colors"><ChevronLeft className="w-4 h-4 text-muted-foreground" /></button>
              <button className="p-1 rounded hover:bg-secondary transition-colors"><ChevronRight className="w-4 h-4 text-muted-foreground" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {daysOfMonth.map(d => {
              const hasTasks = tasks.some(t => {
                const due = new Date(t.dueDate);
                return due.getDate() === d;
              });
              return (
                <div key={d} className={`text-center py-2 text-sm rounded-lg cursor-pointer transition-colors relative ${
                  d === today ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground hover:bg-secondary'
                }`}>
                  {d}
                  {hasTasks && d !== today && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
                </div>
              );
            })}
          </div>

          <div className="mt-6 bg-secondary rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Completion Rate</p>
            <p className="text-3xl font-bold text-foreground mt-1">{tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0}%</p>
            <p className="text-xs text-success mt-1">{tasks.filter(t => t.status === 'Completed').length} of {tasks.length} tasks completed</p>
            <div className="w-full h-1.5 rounded-full bg-border mt-3 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100 : 0}%` }} />
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                    activeTab === tab ? 'text-foreground border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors group">
                <button
                  onClick={() => updateTask(task.id, { status: task.status === 'Completed' ? 'To Do' : 'Completed' })}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    task.status === 'Completed' ? 'bg-success border-success' : 'border-border hover:border-primary'
                  }`}
                >
                  {task.status === 'Completed' && <Check className="w-3 h-3 text-success-foreground" />}
                </button>
                <div className={`w-1 h-8 rounded-full shrink-0 ${task.priority === 'High' ? 'bg-destructive' : task.priority === 'Medium' ? 'bg-warning' : 'bg-success'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.assignee} • {task.dueDate}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${statusColors[task.status]}`}>{task.status}</span>
                <button onClick={() => openEdit(task)} className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all">
                  <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => deleteTask(task.id)} className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No tasks found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Task Form Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Title *</label>
              <input className={inputClass} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Description</label>
              <textarea className={`${inputClass} min-h-[60px]`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Assignee</label>
                <select className={inputClass} value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}>
                  {['Alex Sterling', 'Sarah Jenkins', 'Elena Rodriguez', 'David Chen'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Due Date</label>
                <input type="date" className={inputClass} value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</label>
                <select className={inputClass} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Task['status'] }))}>
                  <option>To Do</option><option>In Progress</option><option>Completed</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Priority</label>
                <select className={inputClass} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Task['priority'] }))}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setTaskDialogOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">{editingTask ? 'Update' : 'Create'}</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
