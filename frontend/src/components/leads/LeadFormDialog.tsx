import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lead, LeadStatus, LeadPriority, LeadSource } from '@/data/types';
import { useCRM } from '@/context/CRMContext';

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editLead?: Lead | null;
}

const sources: LeadSource[] = ['Website', 'LinkedIn', 'Referral', 'Facebook', 'Conference', 'Direct', 'Social Media'];
const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const priorities: LeadPriority[] = ['Low', 'Medium', 'High'];

export default function LeadFormDialog({ open, onOpenChange, editLead }: LeadFormDialogProps) {
  const { addLead, updateLead } = useCRM();
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', company: '',
    source: 'Website' as LeadSource, status: 'New' as LeadStatus,
    priority: 'Medium' as LeadPriority, assignedTo: 'Alex Sterling',
    notes: '', estimatedValue: 0, tags: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editLead) {
      setForm({
        fullName: editLead.fullName, email: editLead.email, phone: editLead.phone,
        company: editLead.company, source: editLead.source, status: editLead.status,
        priority: editLead.priority, assignedTo: editLead.assignedTo, notes: editLead.notes,
        estimatedValue: editLead.estimatedValue, tags: editLead.tags,
      });
    } else {
      setForm({ fullName: '', email: '', phone: '', company: '', source: 'Website', status: 'New', priority: 'Medium', assignedTo: 'Alex Sterling', notes: '', estimatedValue: 0, tags: [] });
    }
    setErrors({});
  }, [editLead, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.company.trim()) errs.company = 'Company is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editLead) {
      updateLead(editLead.id, form);
    } else {
      addLead(form);
    }
    onOpenChange(false);
  };

  const inputClass = "w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all";
  const labelClass = "text-xs text-muted-foreground font-medium uppercase tracking-wider";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editLead ? 'Edit Lead' : 'Create New Lead'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input className={inputClass} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
            {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input className={inputClass} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone *</label>
            <input className={inputClass} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className={labelClass}>Company *</label>
            <input className={inputClass} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            {errors.company && <p className="text-xs text-destructive mt-1">{errors.company}</p>}
          </div>
          <div>
            <label className={labelClass}>Source</label>
            <select className={inputClass} value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value as LeadSource }))}>
              {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as LeadStatus }))}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Priority</label>
            <select className={inputClass} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as LeadPriority }))}>
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Estimated Value ($)</label>
            <input className={inputClass} type="number" value={form.estimatedValue} onChange={e => setForm(f => ({ ...f, estimatedValue: parseInt(e.target.value) || 0 }))} />
          </div>
          <div>
            <label className={labelClass}>Assigned To</label>
            <select className={inputClass} value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}>
              {['Alex Sterling', 'Sarah Jenkins', 'Elena Rodriguez', 'David Chen'].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tags (comma separated)</label>
            <input className={inputClass} value={form.tags.join(', ')} onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Notes</label>
            <textarea className={`${inputClass} min-h-[80px]`} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">{editLead ? 'Update Lead' : 'Create Lead'}</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
