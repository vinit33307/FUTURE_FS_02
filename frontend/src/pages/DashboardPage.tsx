import { useState } from 'react';
import { useCRM } from '@/context/CRMContext';
import { Users, TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { chartData, dashboardStats } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

function StatCard({ label, value, change, changeDirection, icon: Icon }: {
  label: string; value: string; change?: string; changeDirection?: 'up' | 'down';
  icon: React.ElementType;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent-foreground" />
        </div>
        {change && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${changeDirection === 'up' ? 'text-success' : 'text-destructive'}`}>
            {changeDirection === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-4">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { leads, activities, tasks } = useCRM();

  const totalLeads = leads?.length || 0;
  const converted = leads?.filter(l => l.status === 'Converted').length || 0;
  const convRate = totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) : '0';
  const totalRevenue = leads?.reduce((s, l) => s + (l.estimatedValue || 0), 0) || 0;
  const recentLeads = leads?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Intelligence Hub</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time performance metrics and predictive lead analytics.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(1)}k`} change="+12%" changeDirection="up" icon={DollarSign} />
        <StatCard label="Conversion Rate" value={`${convRate}%`} change="+3.2%" changeDirection="up" icon={TrendingUp} />
        <StatCard label="Active Leads" value={totalLeads.toLocaleString()} icon={Users} />
        <StatCard label="Pending Tasks" value={tasks.filter(t => t.status !== 'Completed').length.toString()} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Revenue Growth</h3>
              <p className="text-xs text-muted-foreground">Projected vs Actual performance</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData.revenueGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              <Line type="monotone" dataKey="projected" stroke="hsl(var(--border))" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
          <h3 className="font-semibold text-foreground">Lead Sources</h3>
          <p className="text-xs text-muted-foreground mb-2">Acquisition channel breakdown</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={chartData.leadSources} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                {chartData.leadSources.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {chartData.leadSources.map((source) => (
              <div key={source.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-muted-foreground">{source.name}</span>
                </div>
                <span className="font-medium text-foreground">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
          <h3 className="font-semibold text-foreground">Lead Conversion Funnel</h3>
          <p className="text-xs text-muted-foreground mb-4">Drop-off rates by stage</p>
          <div className="space-y-3">
            {chartData.conversionFunnel.map((stage) => {
              const maxVal = chartData.conversionFunnel[0].value;
              const pct = (stage.value / maxVal) * 100;
              return (
                <div key={stage.stage} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{stage.stage}</span>
                    <span className="font-medium text-foreground">{stage.value.toLocaleString()}</span>
                  </div>
                  <div className="h-8 rounded-lg bg-secondary overflow-hidden">
                    <div className="h-full rounded-lg bg-gradient-primary flex items-center pl-3 text-primary-foreground text-xs font-semibold transition-all" style={{ width: `${pct}%` }}>
                      {stage.stage.toUpperCase()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {activities.length > 0 ? activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  activity.type === 'email' ? 'bg-primary' : activity.type === 'call' ? 'bg-warning' : activity.type === 'status_change' ? 'bg-success' : 'bg-info'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {typeof activity.user === 'string' ? activity.user : (activity.user as any)?.name || 'System'} • {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground py-8 text-center">No recent activities</p>
            )}
          </div>
        </div>
      </div>

      {/* AI Lead Scoring Insight */}
      <div className="bg-card rounded-xl border border-border p-5 animate-fade-in border-l-4 border-l-primary">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-foreground">✨ AI Lead Scoring Insight</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {leads.length > 0 ? (
            <>
              Based on engagement patterns, <strong className="text-foreground">{leads.filter(l => (l.leadScore || 0) > 80).length} leads</strong> have a high probability of conversion (score &gt; 80%). 
              Top prospect: <strong className="text-foreground">{leads.sort((a, b) => (b.leadScore || 0) - (a.leadScore || 0))[0]?.fullName || 'N/A'}</strong> with a {leads.sort((a, b) => (b.leadScore || 0) - (a.leadScore || 0))[0]?.leadScore || 0}% score.
            </>
          ) : (
            "Add leads to start generating AI insights and conversion probability scores."
          )}
        </p>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
        <h3 className="font-semibold text-foreground mb-4">Recent High-Value Leads</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Lead', 'Value', 'Agent', 'Status', 'Score'].map(h => (
                  <th key={h} className="text-left py-3 px-2 text-xs text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                        {(lead.fullName || 'U').split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{lead.fullName || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{lead.company || 'No Company'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-medium text-foreground">${(lead.estimatedValue || 0).toLocaleString()}</td>
                  <td className="py-3 px-2 text-muted-foreground text-sm">{typeof lead.assignedTo === 'string' ? lead.assignedTo : (lead.assignedTo as any)?.name || 'Unassigned'}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'Converted' ? 'bg-success/10 text-success' :
                      lead.status === 'Qualified' ? 'bg-info/10 text-info' :
                      lead.status === 'Contacted' ? 'bg-warning/10 text-warning' :
                      lead.status === 'New' ? 'bg-primary/10 text-primary' :
                      'bg-destructive/10 text-destructive'
                    }`}>{lead.status}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{lead.leadScore}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${lead.leadScore}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
