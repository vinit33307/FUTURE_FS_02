import { Lead } from '@/data/types';

export function exportLeadsToCSV(leads: Lead[], filename = 'leads_export.csv') {
  const headers = ['Full Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Priority', 'Assigned To', 'Lead Score', 'Est. Value', 'Tags', 'Created', 'Notes'];
  const rows = leads.map(l => [
    l.fullName, l.email, l.phone, l.company, l.source, l.status, l.priority,
    l.assignedTo, l.leadScore.toString(), l.estimatedValue.toString(),
    l.tags.join('; '), l.createdAt, l.notes.replace(/,/g, ';'),
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseCSVToLeads(text: string): Partial<Lead>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
  return lines.slice(1).map(line => {
    const values = line.match(/(".*?"|[^,]+)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return {
      fullName: obj['full name'] || obj['name'] || '',
      email: obj['email'] || '',
      phone: obj['phone'] || '',
      company: obj['company'] || '',
      source: (obj['source'] || 'Website') as Lead['source'],
      status: (obj['status'] || 'New') as Lead['status'],
      priority: (obj['priority'] || 'Medium') as Lead['priority'],
      assignedTo: obj['assigned to'] || 'Alex Sterling',
      notes: obj['notes'] || '',
      estimatedValue: parseInt(obj['est. value'] || obj['value'] || '0') || 0,
      tags: (obj['tags'] || '').split(';').map(t => t.trim()).filter(Boolean),
    } as Partial<Lead>;
  });
}
