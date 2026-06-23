import { Download, TrendingUp, ShoppingBag, Users, Droplets } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { analyticsData } from '../data/mockData';

const ZONE_COLORS = ['#1a8fe0', '#8b5cf6', '#14b8a6', '#f97316'];

function Card({ title, children, action }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-700 text-sm">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function Analytics() {
  const kpis = analyticsData.kpis;

  const kpiCards = [
    { label: "Today's Revenue", value: `₹${kpis.todayRevenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
    { label: "Today's Orders", value: kpis.todayOrders, icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
    { label: "Delivered", value: kpis.deliveredCount, icon: Droplets, color: 'bg-teal-50 text-teal-600' },
    { label: "Avg Orders/Day", value: kpis.avgOrdersPerDay, icon: Users, color: 'bg-violet-50 text-violet-600' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-sm text-slate-500">Last 7 days performance overview</p>
        </div>
        <button className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(k => (
          <div key={k.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{k.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{k.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${k.color}`}>
                <k.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue + Orders trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Revenue (7 Days)">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData.dailyRevenue}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a8fe0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1a8fe0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} contentStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#1a8fe0" strokeWidth={2} fill="url(#revGrad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Orders per Day">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Zone revenue + Delivery performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Revenue by Zone">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.revenueByZone} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis dataKey="zone" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} width={110} />
              <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} contentStyle={{ fontSize: 12 }} />
              {analyticsData.revenueByZone.map((entry, idx) => (
                <Bar key={entry.zone} dataKey="revenue" fill={ZONE_COLORS[idx % ZONE_COLORS.length]} radius={[0, 4, 4, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Delivery Performance Today">
          <div className="space-y-4">
            {analyticsData.deliveryPerformance.map((dp, i) => (
              <div key={dp.name} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: ZONE_COLORS[i % ZONE_COLORS.length] }}
                >
                  {dp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700 truncate">{dp.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{dp.delivered}/{dp.delivered + dp.failed}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${dp.rate}%`, background: ZONE_COLORS[i % ZONE_COLORS.length] }}
                    />
                  </div>
                </div>
                <span className={`text-sm font-bold ml-2 ${dp.rate >= 95 ? 'text-green-600' : dp.rate >= 85 ? 'text-amber-600' : 'text-red-600'}`}>
                  {dp.rate}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Dues table */}
      <Card title="Pending Dues Summary">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Zone</th>
                <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: 'Ramesh Babu', zone: 'Anna Nagar West', dues: 240, last: '2026-06-21' },
                { name: 'Suresh Kumar', zone: 'Aminjikarai', dues: 480, last: '2026-06-20' },
                { name: 'Venkatesh Rao', zone: 'Anna Nagar East', dues: 160, last: '2026-06-21' },
                { name: 'Saranya R', zone: 'Kilpauk', dues: 80, last: '2026-06-22' },
              ].map(r => (
                <tr key={r.name} className="hover:bg-slate-50">
                  <td className="py-3 font-medium text-slate-700">{r.name}</td>
                  <td className="py-3 text-slate-500 hidden sm:table-cell">{r.zone}</td>
                  <td className="py-3 text-right font-semibold text-red-600">₹{r.dues}</td>
                  <td className="py-3 text-right text-slate-400 text-xs hidden md:table-cell">{r.last}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200">
                <td className="py-3 font-bold text-slate-700" colSpan={2}>Total Outstanding</td>
                <td className="py-3 text-right font-bold text-red-600">₹960</td>
                <td className="hidden md:table-cell" />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}
