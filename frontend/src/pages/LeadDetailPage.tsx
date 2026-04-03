import { useParams, useNavigate } from 'react-router-dom';
import { useCRM } from '@/context/CRMContext';
import { useState } from 'react';
import { ArrowLeft, Mail, Phone, Building, Globe, Calendar, Tag, Edit, Trash2, MessageSquare, PhoneCall, FileText, Users } from 'lucide-react';
import LeadFormDialog from '@/components/leads/LeadFormDialog';
import DeleteLeadDialog from '@/components/leads/DeleteLeadDialog';

const statusColors: Record<string, string> = {
  New: 'bg-primary/10 text-primary',
  Contacted: 'bg-info/10 text-info',
  Qualified: 'bg-success/10 text-success',
  Converted: 'bg-success/10 text-success',
  Lost: 'bg-destructive/10 text-destructive',
};

const activityTypeIcons: Record<string, typeof Mail> = {
  email: Mail,
  call: PhoneCall,
  note: FileText,
  meeting: Users,
  status_change: Tag,
  task: FileText,
};

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getLeadById, getActivitiesForLead, addActivity } = useCRM();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const lead = getLeadById(id || '');
  const activities = getActivitiesForLead(id || '');

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <p className="text-xl font-bold text-foreground mb-2">Lead Not Found</p>
        <p className="text-sm text-muted-foreground mb-4">This lead may have been deleted.</p>
        <button onClick={() => navigate('/leads')} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Back to Leads</button>
      </div>
    );
  }

  const addNote = () => {
    if (!noteText.trim()) return;
    addActivity({
      leadId: lead.id,
      type: 'note',
      description: noteText,
      timestamp: 'Just now',
      user: 'Alex Sterling',
    });
    setNoteText('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/leads')} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
              {lead.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{lead.fullName}</h1>
              <p className="text-sm text-muted-foreground">{lead.company} • Lead #{44900 + parseInt(lead.id)}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button onClick={() => setDeleteOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lead Info */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Lead Information</h3>
            <div className="space-y-3">
              {[
                { icon: Mail, label: 'Email', value: lead.email },
                { icon: Phone, label: 'Phone', value: lead.phone },
                { icon: Building, label: 'Company', value: lead.company },
                { icon: Globe, label: 'Source', value: lead.source },
                { icon: Calendar, label: 'Created', value: lead.createdAt },
                { icon: Users, label: 'Assigned To', value: lead.assignedTo },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3">Lead Score & Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Lead Score</span>
                  <span className="font-bold text-foreground">{lead.leadScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${lead.leadScore}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>{lead.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Priority</span>
                <span className={`text-xs font-medium ${lead.priority === 'High' ? 'text-destructive' : lead.priority === 'Medium' ? 'text-warning' : 'text-muted-foreground'}`}>{lead.priority}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Est. Value</span>
                <span className="text-sm font-semibold text-foreground">${lead.estimatedValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {lead.tags.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {lead.notes && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Right: Activity Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* Add Note */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Add Note / Activity
            </h3>
            <div className="flex gap-3">
              <textarea
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary min-h-[80px]"
                placeholder="Add a note, log a call, or record an activity..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-3">
              <button onClick={addNote} disabled={!noteText.trim()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">Add Note</button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Activity Timeline</h3>
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No activities recorded yet.</p>
            ) : (
              <div className="space-y-0">
                {activities.map((activity, i) => {
                  const Icon = activityTypeIcons[activity.type] || FileText;
                  return (
                    <div key={activity.id} className="flex gap-4 relative">
                      {i < activities.length - 1 && (
                        <div className="absolute left-[15px] top-10 bottom-0 w-px bg-border" />
                      )}
                      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0 z-10">
                        <Icon className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="text-sm text-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.user} • {activity.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <LeadFormDialog open={editOpen} onOpenChange={setEditOpen} editLead={lead} />
      <DeleteLeadDialog open={deleteOpen} onOpenChange={setDeleteOpen} lead={lead} />
    </div>
  );
}
