import { useState } from 'react';
import { emails as initialEmails } from '@/data/mockData';
import { Email } from '@/data/types';
import { Pencil, Inbox, Send, FileText, Star, Trash2, Filter, Reply, Forward, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const folders = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, count: 24 },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'drafts', label: 'Drafts', icon: FileText },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'trash', label: 'Trash', icon: Trash2 },
];

const labels = [
  { name: 'High Priority', color: 'bg-success' },
  { name: 'Follow-up', color: 'bg-warning' },
  { name: 'Design System', color: 'bg-primary' },
];

export default function EmailPage() {
  const [selectedEmail, setSelectedEmail] = useState(initialEmails[0]);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 rounded-xl border border-border overflow-hidden bg-card animate-fade-in">
      {/* Sidebar */}
      <div className="w-56 border-r border-border p-4 flex flex-col shrink-0">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity mb-4">
          <Pencil className="w-4 h-4" /> Compose
        </button>

        <div className="space-y-1 mb-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-2 mb-2">Mailboxes</p>
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                activeFolder === folder.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <div className="flex items-center gap-2">
                <folder.icon className="w-4 h-4" />
                <span className="font-medium">{folder.label}</span>
              </div>
              {folder.count && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${activeFolder === folder.id ? 'bg-primary-foreground/20' : 'bg-secondary'}`}>
                  {folder.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-2 mb-2">Labels</p>
          {labels.map((label) => (
            <button key={label.name} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors">
              <div className={`w-2.5 h-2.5 rounded-full ${label.color}`} />
              <span>{label.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Email List */}
      <div className="w-80 border-r border-border flex flex-col shrink-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground">Inbox</h3>
          <Filter className="w-4 h-4 text-muted-foreground cursor-pointer" />
        </div>
        <div className="flex gap-2 px-4 py-2 border-b border-border">
          {['All', 'Unread', 'Attachments'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeFilter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {initialEmails.map((email) => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${
                selectedEmail.id === email.id ? 'bg-accent border-l-2 border-l-primary' : 'hover:bg-secondary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${!email.read ? 'text-foreground' : 'text-muted-foreground'}`}>{email.from}</span>
                <span className="text-[10px] text-muted-foreground uppercase">{email.timestamp}</span>
              </div>
              <p className="text-sm font-medium text-foreground mt-0.5 truncate">{email.subject}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{email.preview}</p>
              {email.labels.length > 0 && (
                <div className="flex gap-1 mt-1.5">
                  {email.labels.map(l => (
                    <span key={l} className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-success/10 text-success">{l}</span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Email Detail */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b border-border">
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors"><Reply className="w-4 h-4 text-muted-foreground" /></button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors"><Forward className="w-4 h-4 text-muted-foreground" /></button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors"><Download className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>1 of 342</span>
            <button className="p-1 rounded hover:bg-secondary"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1 rounded hover:bg-secondary"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <h2 className="text-xl font-bold text-foreground">{selectedEmail.subject}</h2>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
              {selectedEmail.from.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{selectedEmail.from}</p>
              <p className="text-xs text-muted-foreground">&lt;{selectedEmail.fromEmail}&gt;</p>
              <p className="text-xs text-muted-foreground">To: {selectedEmail.to}</p>
            </div>
            <span className="ml-auto text-xs text-muted-foreground">{selectedEmail.timestamp}</span>
          </div>
          <div className="mt-6 text-sm text-foreground leading-relaxed whitespace-pre-line">
            {selectedEmail.body}
          </div>
          <div className="mt-8 bg-accent rounded-xl p-4 border-l-4 border-primary">
            <p className="text-[10px] text-primary uppercase tracking-widest font-semibold mb-2">Key Project Insight</p>
            <p className="text-sm text-foreground italic">"The client expressed a strong desire for 'perceived weightlessness' in the lobby area. We suggest using structural tonal shifts instead of physical partitions."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
