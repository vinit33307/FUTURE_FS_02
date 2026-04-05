import { User, Bell, Shield, Palette, Globe, Database, Mail, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account preferences and system configuration.</p>
      </div>

      {/* Profile */}
      <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <User className="w-4 h-4" /> Profile Settings
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Full Name</label>
            <input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary" defaultValue="Alex Sterling" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email</label>
            <input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary" defaultValue="a.sterling@architect.com" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Role</label>
            <input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-secondary text-sm text-muted-foreground" defaultValue="Sales Director" readOnly />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone</label>
            <input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary" defaultValue="+1 (555) 123-4567" />
          </div>
        </div>
        <button className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Save Changes
        </button>
      </div>

      {/* Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Notifications', icon: Bell, settings: [
            { label: 'Email notifications', enabled: true },
            { label: 'Push notifications', enabled: true },
            { label: 'SMS alerts', enabled: false },
          ]},
          { title: 'Security', icon: Shield, settings: [
            { label: 'Two-factor authentication', enabled: true },
            { label: 'Login alerts', enabled: true },
            { label: 'Session timeout (30 min)', enabled: false },
          ]},
          { title: 'Appearance', icon: Palette, settings: [
            { label: 'Dark mode', enabled: false },
            { label: 'Compact sidebar', enabled: false },
            { label: 'Show animations', enabled: true },
          ]},
          { title: 'Integrations', icon: Globe, settings: [
            { label: 'Email sync', enabled: true },
            { label: 'Calendar sync', enabled: false },
            { label: 'Slack notifications', enabled: true },
          ]},
        ].map((section) => (
          <div key={section.title} className="bg-card rounded-xl border border-border p-5 animate-fade-in">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <section.icon className="w-4 h-4" /> {section.title}
            </h3>
            <div className="space-y-3">
              {section.settings.map((setting) => (
                <div key={setting.label} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{setting.label}</span>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${setting.enabled ? 'bg-primary' : 'bg-border'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${setting.enabled ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-xl border border-destructive/30 p-5 animate-fade-in">
        <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
        <p className="text-xs text-muted-foreground mb-4">Irreversible actions that affect your entire account.</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors">
            Delete Account
          </button>
          <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            Export All Data
          </button>
        </div>
      </div>
    </div>
  );
}
