import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Users, Kanban, CheckSquare, Mail,
  Sparkles, BarChart3, Shield, Settings, Plus, ChevronLeft, ChevronRight, X, LogOut
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/leads', label: 'Leads', icon: Users },
  { path: '/pipeline', label: 'Pipeline', icon: Kanban },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/email', label: 'Email', icon: Mail },
  { path: '/analytics', label: 'Analytics', icon: Sparkles },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
];

const bottomItems = [
  { path: '/admin', label: 'Admin Panel', icon: Shield },
  { path: '/settings', label: 'Settings', icon: Settings },
];

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`
      fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-40 transition-all duration-300
      ${collapsed ? 'w-[70px]' : 'w-[220px]'}
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
    `}>
      {/* Logo */}
      <div className="flex items-center justify-between gap-2 px-4 h-16 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">LF</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm text-foreground leading-tight">LeadFlow CRM</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Enterprise Tier</p>
            </div>
          )}
        </div>
        {mobileOpen && (
          <button onClick={onMobileClose} className="p-1 rounded hover:bg-secondary lg:hidden">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-l-full" />}
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-2 space-y-1 border-t border-border pt-2">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-lg bg-secondary relative group">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
            <span className="text-primary-foreground text-xs font-semibold">{user?.initials || '??'}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 pr-6">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name || 'Guest User'}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.role || 'User'}</p>
              <button 
                onClick={handleLogout}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {!collapsed && (
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity mt-2">
            <Plus className="w-4 h-4" />
            New Lead
          </button>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full hidden lg:flex items-center justify-center py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
