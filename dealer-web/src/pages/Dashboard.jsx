import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Truck, CheckCircle2, AlertCircle, Clock,
  TrendingUp, Users, Droplets, RefreshCw, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { analyticsData, orders, deliveryPersonnel } from '../data/mockData';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',     color: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-400' },
  assigned:   { label: 'Assigned',    color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
  'in-transit': { label: 'In Transit', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  delivered:  { label: 'Delivered',   color: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  failed:     { label: 'Failed',      color: 'bg-red-100 text-red-700',      dot: 'bg-red-500' },
};

function StatCard({ icon: Icon, label, value, sub, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 shadow-sm border border-slate-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const kpis = analyticsData.kpis;
  const recentOrders = orders.slice(0, 8);

  const statusBreakdown = [
    { label: 'Pending',    value: kpis.pendingCount,   color: 'bg-amber-400', textColor: 'text-amber-700' },
    { label: 'Assigned',   value: kpis.assignedCount,  color: 'bg-blue-500',  textColor: 'text-blue-700' },
    { label: 'In Transit', value: kpis.inTransitCount, color: 'bg-purple-500',textColor: 'text-purple-700' },
    { label: 'Delivered',  value: kpis.deliveredCount, color: 'bg-green-500', textColor: 'text-green-700' },
    { label: 'Failed',     value: kpis.failedCount,    color: 'bg-red-500',   textColor: 'text-red-700' },
  ];
  const total = statusBreakdown.reduce((s, i) => s + i.value, 0);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500">Monday, 23 June 2026 — Live overview</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Today's Orders" value={kpis.todayOrders} sub={`₹${kpis.todayRevenue.toLocaleString()} revenue`} color="bg-brand-50 text-brand-600" onClick={() => navigate('/orders')} />
        <StatCard icon={CheckCircle2} label="Delivered" value={kpis.deliveredCount} sub="Completed today" color="bg-green-50 text-green-600" />
        <StatCard icon={Clock} label="In Progress" value={kpis.assignedCount + kpis.inTransitCount} sub={`${kpis.pendingCount} pending`} color="bg-amber-50 text-amber-600" />
        <StatCard icon={AlertCircle} label="Failed" value={kpis.failedCount} sub="Need attention" color="bg-red-50 text-red-600" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Active Customers" value={kpis.activeCustomers} sub="Served today" color="bg-violet-50 text-violet-600" onClick={() => navigate('/customers')} />
        <StatCard icon={Droplets} label="Avg Orders/Day" value={kpis.avgOrdersPerDay} sub="7-day average" color="bg-cyan-50 text-cyan-600" />
        <StatCard icon={TrendingUp} label="Outstanding Dues" value={`₹${kpis.totalDuesOutstanding}`} sub="From 3 customers" color="bg-orange-50 text-orange-600" onClick={() => navigate('/wallet')} />
        <StatCard icon={Truck} label="Active Riders" value={deliveryPersonnel.filter(d => d.status === 'active').length} sub="Out for delivery" color="bg-teal-50 text-teal-600" onClick={() => navigate('/personnel')} />
      </div>

      {/* Order status bar + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status breakdown */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Today's Order Status</h2>
          {/* Progress bar */}
          <div className="flex h-3 rounded-full overflow-hidden mb-4">
            {statusBreakdown.map(s => (
              <div
                key={s.label}
                className={`${s.color} transition-all`}
                style={{ width: `${(s.value / total) * 100}%` }}
                title={`${s.label}: ${s.value}`}
              />
            ))}
          </div>
          <div className="space-y-2">
            {statusBreakdown.map(s => (
              <div key={s.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                  <span className="text-slate-600">{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${s.textColor}`}>{s.value}</span>
                  <span className="text-slate-400 text-xs">{Math.round((s.value / total) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-sm">
            <span className="text-slate-500">Total orders</span>
            <span className="font-bold text-slate-800">{total}</span>
          </div>
        </div>

        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">7-Day Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={analyticsData.dailyRevenue}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a8fe0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1a8fe0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} contentStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#1a8fe0" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Delivery performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Delivery Performance Today</h2>
          <div className="space-y-3">
            {analyticsData.deliveryPerformance.map(dp => (
              <div key={dp.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {dp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700 truncate">{dp.name}</span>
                    <span className="text-xs text-slate-500">{dp.delivered}/{dp.delivered + dp.failed}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${dp.rate}%` }} />
                  </div>
                </div>
                <span className={`text-xs font-semibold ${dp.rate >= 95 ? 'text-green-600' : dp.rate >= 85 ? 'text-amber-600' : 'text-red-600'}`}>
                  {dp.rate}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Recent Orders</h2>
            <button onClick={() => navigate('/orders')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {recentOrders.map(o => (
              <div key={o.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-4 h-4 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{o.customerName}</p>
                  <p className="text-xs text-slate-400">{o.id} · {o.cans} can{o.cans > 1 ? 's' : ''} · ₹{o.amount}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
