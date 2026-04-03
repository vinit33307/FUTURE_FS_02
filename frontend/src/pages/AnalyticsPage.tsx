import { dashboardStats, chartData, leads } from '@/data/mockData';
import { TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const performanceData = [
    { name: 'Marcus Thorne', revenue: 142000, progress: 90 },
    { name: 'Elena Rodriguez', revenue: 128500, progress: 82 },
    { name: 'Sarah Jenkins', revenue: 94000, progress: 65 },
    { name: 'David Chen', revenue: 81200, progress: 52 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Intelligence Hub</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time performance metrics and predictive lead analytics for the current fiscal quarter.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$842,500', change: '+12%', up: true },
          { label: 'Conversion Rate', value: '24.8%', change: '+3.2%', up: true },
          { label: 'Active Leads', value: '1,204', change: '-0.5%', up: false },
          { label: 'Avg. Deal Cycle', value: '18 Days', change: '-4d', up: true },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-5 animate-fade-in">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${stat.up ? 'text-success' : 'text-destructive'}`}>
                {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Revenue Growth</h3>
              <p className="text-xs text-muted-foreground">Projected vs Actual performance</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs rounded-full bg-primary text-primary-foreground font-medium">Monthly</button>
              <button className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground font-medium">Weekly</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
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
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={chartData.leadSources} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                {chartData.leadSources.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center -mt-2 mb-3">
            <p className="text-2xl font-bold text-foreground">1.2k</p>
            <p className="text-xs text-muted-foreground uppercase">Leads</p>
          </div>
          <div className="space-y-2">
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

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funnel */}
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground">Lead Conversion Funnel</h3>
            <span className="text-xs text-success font-medium">Optimal Performance</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Drop-off rates by stage</p>
          <div className="space-y-3">
            {chartData.conversionFunnel.map((stage) => {
              const maxVal = chartData.conversionFunnel[0].value;
              const pct = (stage.value / maxVal) * 100;
              return (
                <div key={stage.stage}>
                  <div className="h-10 rounded-lg bg-secondary overflow-hidden">
                    <div className="h-full rounded-lg bg-gradient-primary flex items-center justify-between px-3 text-primary-foreground text-xs font-semibold" style={{ width: `${pct}%` }}>
                      <span>{stage.stage.toUpperCase()}</span>
                      <span>{stage.value.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance by Agent */}
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
          <h3 className="font-semibold text-foreground">Performance by Agent</h3>
          <p className="text-xs text-muted-foreground mb-4">Revenue generated per account executive</p>
          <div className="space-y-4">
            {performanceData.map((agent) => (
              <div key={agent.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground shrink-0">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{agent.name}</span>
                    <span className="text-sm font-semibold text-foreground">${(agent.revenue / 1000).toFixed(0)},000</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-secondary mt-2 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${agent.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div className="mt-4 bg-accent rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-accent-foreground">✨ AI Intelligence Insight</span>
            </div>
            <p className="text-xs text-muted-foreground">Velocity Logistics is 3x more likely to close in the next 72 hours based on recent engagement patterns.</p>
            <button className="text-xs text-primary font-medium mt-2 hover:underline">Prioritize Deal →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
