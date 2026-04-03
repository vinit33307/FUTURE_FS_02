import { users } from '@/data/mockData';
import { UserPlus, Download, Filter, MoreVertical, Settings, Shield, Database, ChevronDown } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Governance</h1>
          <p className="text-muted-foreground text-sm mt-1">Control enterprise access levels, manage global data protocols, and monitor authentication status.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* User Management */}
      <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-primary" /> User Management
          </h3>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-medium hover:bg-accent transition-colors">
              Export CSV
            </button>
            <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
              <Filter className="w-3 h-3" /> Filter
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['User Identity', 'Access Role', 'Current Status', 'Last Authentication', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
                      {user.initials}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium text-secondary-foreground">
                    {user.role} <ChevronDown className="w-3 h-3" />
                  </button>
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.status === 'Active' ? 'text-success' : 'text-destructive'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {user.status}
                  </span>
                </td>
                <td className="py-4 text-muted-foreground text-sm">{user.lastAuth}</td>
                <td className="py-4">
                  <button className="p-1 rounded hover:bg-secondary transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* System Configuration */}
      <div>
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-warning" /> System Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* API Integration */}
          <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Settings className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xs font-semibold text-success">HEALTHY</span>
            </div>
            <h4 className="font-semibold text-foreground">API Integration</h4>
            <p className="text-xs text-muted-foreground mt-1">Manage external endpoints and data webhooks.</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground">Current Key</span>
              <span className="text-xs text-primary font-mono">arch_v2_...98x</span>
            </div>
            <button className="w-full mt-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              Regenerate Token
            </button>
          </div>

          {/* Security */}
          <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-accent-foreground" />
            </div>
            <h4 className="font-semibold text-foreground">Security Enforcement</h4>
            <p className="text-xs text-muted-foreground mt-1">Configure MFA and session duration limits.</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-foreground">Require MFA</span>
              <div className="w-10 h-5 rounded-full bg-primary relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-primary-foreground" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-foreground">Session Timeout</span>
              <span className="text-sm font-medium text-foreground">30 Minutes</span>
            </div>
          </div>

          {/* Storage */}
          <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3">
              <Database className="w-5 h-5 text-accent-foreground" />
            </div>
            <h4 className="font-semibold text-foreground">Cloud Storage</h4>
            <p className="text-xs text-muted-foreground mt-1">Instance capacity and asset distribution.</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground uppercase font-medium">650GB Used</span>
              <span className="text-xs text-primary font-medium">1TB Total</span>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary mt-2 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: '65%' }} />
            </div>
            <button className="w-full mt-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Upgrade Tier
            </button>
          </div>
        </div>
      </div>

      {/* Admin Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 animate-fade-in border-l-4 border-l-primary">
          <h3 className="font-semibold text-foreground text-lg">Recent Administrative Logs</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Real-time audit stream of all high-impact modifications within the CRM environment.</p>
          <div className="space-y-4">
            {[
              { time: '12:04 PM', text: 'User Marcus Vane modified global lead scoring weights.', color: 'bg-info', highlight: 'Marcus Vane' },
              { time: '10:15 AM', text: 'System backup initiated and completed successfully across 4 shards.', color: 'bg-primary', highlight: '' },
              { time: '09:30 AM', text: 'Failed login attempt detected from IP 192.168.1.45.', color: 'bg-destructive', highlight: 'IP 192.168.1.45' },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs text-muted-foreground w-16 shrink-0 pt-0.5">{log.time}</span>
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${log.color}`} />
                <p className="text-sm text-foreground">{log.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-5 flex flex-col items-center justify-center text-center animate-fade-in">
          <p className="text-5xl font-bold text-foreground">142</p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Actions Today</p>
          <button className="mt-4 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-background transition-colors">
            View Full Logs
          </button>
        </div>
      </div>
    </div>
  );
}
