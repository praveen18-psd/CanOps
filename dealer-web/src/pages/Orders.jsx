import { useState } from 'react';
import { Search, Filter, Droplets, Phone, MapPin, XCircle } from 'lucide-react';
import { orders, deliveryPersonnel } from '../data/mockData';

const STATUS_CONFIG = {
  pending:      { label: 'Pending',     bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  assigned:     { label: 'Assigned',    bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  'in-transit': { label: 'In Transit',  bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  delivered:    { label: 'Delivered',   bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
  failed:       { label: 'Failed',      bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function AssignModal({ order, onClose }) {
  const [selectedPerson, setSelectedPerson] = useState('');
  const activePersonnel = deliveryPersonnel.filter(dp => dp.status === 'active');
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-slate-800">Assign Delivery Person</h2>
          <button onClick={onClose}><XCircle className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="bg-slate-50 rounded-lg p-3 text-sm">
            <p className="font-medium text-slate-700">{order.customerName}</p>
            <p className="text-slate-500">{order.id} · {order.cans} can(s) · {order.zone}</p>
          </div>
          <div className="space-y-2">
            {activePersonnel.map(dp => (
              <label key={dp.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedPerson === dp.id ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" name="person" value={dp.id} checked={selectedPerson === dp.id} onChange={() => setSelectedPerson(dp.id)} className="accent-brand-600" />
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                  {dp.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{dp.name}</p>
                  <p className="text-xs text-slate-400">{dp.zone} · {dp.deliveriesToday} deliveries today</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="p-5 border-t flex gap-3">
          <button disabled={!selectedPerson} className="flex-1 bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Assign
          </button>
          <button onClick={onClose} className="px-5 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [assignOrder, setAssignOrder] = useState(null);

  const tabs = ['all', 'pending', 'assigned', 'in-transit', 'delivered', 'failed'];

  const filtered = orders.filter(o => {
    const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'all' || o.status === activeTab;
    return matchSearch && matchTab;
  });

  const counts = tabs.reduce((acc, t) => {
    acc[t] = t === 'all' ? orders.length : orders.filter(o => o.status === t).length;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {assignOrder && <AssignModal order={assignOrder} onClose={() => setAssignOrder(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Orders</h1>
          <p className="text-sm text-slate-500">Today — {orders.length} orders · ₹{orders.reduce((s, o) => s + o.amount, 0).toLocaleString()} revenue</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-1 flex gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const cfg = tab === 'all' ? null : STATUS_CONFIG[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab === 'all' ? 'All' : cfg.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search order ID or customer..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-400 shadow-sm"
        />
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map(o => (
          <div key={o.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-5 h-5 text-brand-500" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800">{o.customerName}</p>
                    <span className="text-slate-400 text-xs">{o.id}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{o.address}
                  </p>
                </div>
              </div>
              <StatusBadge status={o.status} />
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-slate-400 text-xs">Cans</span>
                <p className="font-semibold text-slate-700">{o.cans}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Amount</span>
                <p className="font-semibold text-slate-700">₹{o.amount}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Payment</span>
                <p className="font-semibold text-slate-700 capitalize">{o.paymentMode === 'cod' ? 'Cash' : 'Wallet'}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Slot</span>
                <p className="font-semibold text-slate-700 capitalize">{o.slot}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Delivery Person</span>
                <p className="font-semibold text-slate-700">{o.deliveryPersonName || '—'}</p>
              </div>
            </div>

            {o.status === 'pending' && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => setAssignOrder(o)}
                  className="flex-1 bg-brand-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                  Assign Delivery Person
                </button>
                <button className="px-4 border border-red-200 text-red-600 py-1.5 rounded-lg text-sm hover:bg-red-50 transition-colors">
                  Cancel
                </button>
              </div>
            )}
            {o.status === 'failed' && (
              <div className="mt-3 pt-3 border-t border-red-50">
                <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  Delivery failed — customer absent or address issue. Re-assign or mark as resolved.
                </p>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
