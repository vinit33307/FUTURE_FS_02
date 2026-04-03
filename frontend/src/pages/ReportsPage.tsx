import { Download, Calendar, TrendingUp, BarChart3, FileText, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', leads: 120, conversions: 28 },
  { month: 'Feb', leads: 145, conversions: 35 },
  { month: 'Mar', leads: 160, conversions: 42 },
  { month: 'Apr', leads: 180, conversions: 48 },
  { month: 'May', leads: 200, conversions: 55 },
  { month: 'Jun', leads: 190, conversions: 52 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports Center</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate and export comprehensive business intelligence reports.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Calendar className="w-4 h-4" /> Date Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Lead Performance', desc: 'Comprehensive lead metrics and conversion analytics', icon: TrendingUp, generated: '12 reports this month' },
          { title: 'Revenue Analysis', desc: 'Financial projections and actual revenue breakdown', icon: BarChart3, generated: '8 reports this month' },
          { title: 'Team Productivity', desc: 'Individual and team performance benchmarks', icon: FileText, generated: '5 reports this month' },
        ].map((report) => (
          <div key={report.title} className="bg-card rounded-xl border border-border p-5 hover:shadow-elevated transition-shadow cursor-pointer animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3">
              <report.icon className="w-5 h-5 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">{report.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{report.desc}</p>
            <p className="text-xs text-primary mt-3 font-medium">{report.generated}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
        <h3 className="font-semibold text-foreground mb-1">Monthly Overview</h3>
        <p className="text-xs text-muted-foreground mb-4">Leads generated vs conversions over the last 6 months</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
            <Bar dataKey="leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="conversions" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Reports */}
      <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
        <h3 className="font-semibold text-foreground mb-4">Recently Generated</h3>
        <div className="space-y-3">
          {[
            { name: 'Q3 Lead Performance Report', date: 'Sep 10, 2024', type: 'PDF', size: '2.4 MB' },
            { name: 'August Revenue Analysis', date: 'Sep 1, 2024', type: 'XLSX', size: '1.8 MB' },
            { name: 'Team Productivity - August', date: 'Sep 1, 2024', type: 'PDF', size: '3.1 MB' },
            { name: 'Pipeline Health Check', date: 'Aug 28, 2024', type: 'PDF', size: '1.2 MB' },
          ].map((report) => (
            <div key={report.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                  <FileText className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{report.name}</p>
                  <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
