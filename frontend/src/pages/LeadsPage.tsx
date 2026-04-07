import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '@/context/CRMContext';
import { Lead, LeadStatus, LeadPriority } from '@/data/types';
import { Search, Filter, Download, Upload, UserPlus, MoreVertical, Users, TrendingUp, Clock, DollarSign, Edit, Trash2, Eye } from 'lucide-react';
import LeadFormDialog from '@/components/leads/LeadFormDialog';
import DeleteLeadDialog from '@/components/leads/DeleteLeadDialog';
import { exportLeadsToCSV } from '@/lib/csvExport';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const statusColors: Record<LeadStatus, string> = {
  New: 'bg-primary/10 text-primary',
  Contacted: 'bg-info/10 text-info',
  Qualified: 'bg-success/10 text-success',
  Converted: 'bg-success/10 text-success',
  Lost: 'bg-destructive/10 text-destructive',
};

const priorityDisplay: Record<LeadPriority, { label: string; color: string }> = {
  High: { label: '! HIGH', color: 'text-destructive' },
  Medium: { label: '↕ MEDIUM', color: 'text-warning' },
  Low: { label: '= LOW', color: 'text-muted-foreground' },
};

export default function LeadsPage() {
  const { leads } = useCRM();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'score'>('date');
  const [createOpen, setCreateOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

  const filtered = (leads || [])
    .filter(lead => {
      const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
      const matchesSearch = (lead.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
        return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
      }
      if (sortBy === 'score') return (b.leadScore || 0) - (a.leadScore || 0);
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  const toggleSelect = (id: string) => {
    setSelectedLeads(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedLeads.size === filtered.length) setSelectedLeads(new Set());
    else setSelectedLeads(new Set(filtered.map(l => l.id)));
  };

  const stats = {
    total: leads?.length || 0,
    converted: leads?.filter(l => l.status === 'Converted').length || 0,
    newToday: leads?.filter(l => l.createdAt && new Date(l.createdAt).toDateString() === new Date().toDateString()).length || 0,
    totalValue: leads?.reduce((s, l) => s + (l.estimatedValue || 0), 0) || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leads Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your customer acquisition pipeline.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => exportLeadsToCSV(filtered)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-accent transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <UserPlus className="w-4 h-4" /> Create Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: stats.total.toLocaleString(), icon: Users },
          { label: 'Converted', value: stats.converted.toLocaleString(), icon: TrendingUp },
          { label: 'Conv. Rate', value: stats.total ? `${((stats.converted / stats.total) * 100).toFixed(1)}%` : '0%', icon: Clock },
          { label: 'Est. Revenue', value: `$${(stats.totalValue / 1000).toFixed(1)}k`, icon: DollarSign },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4 animate-fade-in">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-accent-foreground" />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-3">{stat.label}</p>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterStatus === s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {s}
            </button>
          ))}
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border-0">
            <option value="date">Sort: Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="score">Sort: Score</option>
          </select>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedLeads.size > 0 && (
        <div className="flex items-center gap-3 bg-accent rounded-xl px-4 py-2 animate-fade-in">
          <span className="text-sm font-medium text-foreground">{selectedLeads.size} selected</span>
          <button onClick={() => setSelectedLeads(new Set())} className="text-xs text-primary hover:underline">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="w-10 py-3 px-4">
                  <input type="checkbox" checked={selectedLeads.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-border" />
                </th>
                {['Name', 'Company', 'Contact', 'Source', 'Status', 'Priority', 'Score', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/leads/${lead.id}`)}>
                  <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedLeads.has(lead.id)} onChange={() => toggleSelect(lead.id)} className="rounded border-border" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                        {(lead.fullName || 'U').split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{lead.fullName || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground text-ellipsis overflow-hidden max-w-[100px]">ID: {lead.id?.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-foreground">{lead.company || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <p className="text-foreground">{lead.email || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">{lead.phone || 'N/A'}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded bg-secondary text-xs font-medium text-secondary-foreground">{lead.source || 'Direct'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${statusColors[lead.status] || 'bg-secondary text-secondary-foreground'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium ${priorityDisplay[lead.priority]?.color || 'text-muted-foreground'}`}>
                      {priorityDisplay[lead.priority]?.label || 'MEDIUM'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{lead.leadScore || 0}%</span>
                      <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${lead.leadScore || 0}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-secondary transition-colors">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/leads/${lead.id}`)}><Eye className="w-4 h-4 mr-2" /> View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditLead(lead)}><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteLead(lead)}><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Showing {filtered.length} of {leads.length} entries</p>
        </div>
      </div>

      <LeadFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      <LeadFormDialog open={!!editLead} onOpenChange={(open) => !open && setEditLead(null)} editLead={editLead} />
      <DeleteLeadDialog open={!!deleteLead} onOpenChange={(open) => !open && setDeleteLead(null)} lead={deleteLead} />
    </div>
  );
}
