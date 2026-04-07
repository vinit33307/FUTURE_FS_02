import { useState, useRef } from 'react';
import { useCRM } from '@/context/CRMContext';
import { Lead, LeadStatus } from '@/data/types';
import { MoreHorizontal, Plus, Filter, GripVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const columns: { status: LeadStatus; color: string }[] = [
  { status: 'New', color: 'bg-info' },
  { status: 'Contacted', color: 'bg-warning' },
  { status: 'Qualified', color: 'bg-primary' },
  { status: 'Converted', color: 'bg-success' },
  { status: 'Lost', color: 'bg-destructive' },
];

const tagColors: Record<string, string> = {
  Enterprise: 'bg-primary/10 text-primary',
  'Mid Market': 'bg-info/10 text-info',
  SMB: 'bg-secondary text-secondary-foreground',
  'High Priority': 'bg-destructive/10 text-destructive',
  'High Intent': 'bg-success/10 text-success',
};

export default function PipelinePage() {
  const { leads, updateLeadStatus } = useCRM();
  const navigate = useNavigate();
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<LeadStatus | null>(null);

  const getLeadsByStatus = (status: LeadStatus) => leads.filter(l => l.status === status);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLead(leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(status);
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    if (draggedLead) {
      updateLeadStatus(draggedLead, status);
    }
    setDraggedLead(null);
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
    setDragOverCol(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <p className="text-xs text-primary uppercase tracking-widest font-semibold">Sales Pipeline</p>
          <h1 className="text-2xl font-bold text-foreground mt-1">Drag & Drop Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">Drag leads between columns to update their status.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['AS', 'SJ', 'ER', 'DC'].map((initials) => (
              <div key={initials} className="w-8 h-8 rounded-full border-2 border-card bg-accent flex items-center justify-center text-[10px] font-semibold text-accent-foreground">
                {initials}
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {columns.map((col) => {
          const colLeads = getLeadsByStatus(col.status);
          const isOver = dragOverCol === col.status;
          return (
            <div
              key={col.status}
              className={`min-w-[280px] flex-1 transition-all ${isOver ? 'scale-[1.02]' : ''}`}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => handleDrop(e, col.status)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <span className="font-semibold text-foreground text-sm">{col.status}</span>
                  <span className="px-2 py-0.5 rounded bg-secondary text-xs font-medium text-muted-foreground">{colLeads.length}</span>
                </div>
                <button className="p-1 rounded hover:bg-secondary transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Drop zone */}
              <div className={`space-y-3 min-h-[200px] rounded-xl transition-colors p-1 ${isOver ? 'bg-accent/50 border-2 border-dashed border-primary' : ''}`}>
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className={`bg-card rounded-xl border border-border p-4 hover:shadow-elevated transition-all cursor-grab active:cursor-grabbing animate-fade-in ${
                      draggedLead === lead.id ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-wrap gap-1.5">
                        {lead.tags?.length > 0 ? lead.tags.map((tag) => (
                          <span key={tag} className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${tagColors[tag] || 'bg-secondary text-secondary-foreground'}`}>
                            {tag}
                          </span>
                        )) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-secondary text-secondary-foreground">Lead</span>
                        )}
                      </div>
                      <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm">{lead.company || 'Private Entity'}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{lead.fullName || 'Anonymous'} • ${(lead.estimatedValue || 0).toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[10px] font-semibold text-accent-foreground">
                          {(() => {
                            const name = typeof lead.assignedTo === 'string' ? lead.assignedTo : (lead.assignedTo as any)?.name || 'System';
                            return name.split(' ').map(n => n[0]).join('');
                          })()}
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                      {(lead.leadScore || 0) > 70 && (
                        <span className="text-xs text-success font-medium">{lead.leadScore}%</span>
                      )}
                    </div>
                  </div>
                ))}

                <button className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Lead
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
