import { useState } from 'react';
import {
  Search, Plus, Filter, MoreVertical, CheckCircle,
  XCircle, Wallet, ShoppingBag, Phone, MapPin, ChevronDown
} from 'lucide-react';
import { customers } from '../data/mockData';

const SUB_LABELS = { daily: 'Daily', alternate: 'Alt. Days', custom: 'Custom', none: 'None' };

function CustomerModal({ customer, onClose }) {
  if (!customer) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-slate-800">Customer Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-bold">
              {customer.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-lg">{customer.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {customer.status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Phone</p>
              <p className="font-medium text-slate-700 mt-0.5">{customer.phone}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Zone</p>
              <p className="font-medium text-slate-700 mt-0.5">{customer.zone}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Wallet Balance</p>
              <p className={`font-semibold mt-0.5 ${customer.walletBalance >= 100 ? 'text-green-600' : 'text-amber-600'}`}>
                ₹{customer.walletBalance}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Outstanding Dues</p>
              <p className={`font-semibold mt-0.5 ${customer.outstandingDues > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                ₹{customer.outstandingDues}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Subscription</p>
              <p className="font-medium text-slate-700 mt-0.5">{SUB_LABELS[customer.subscription]}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Cans/Order</p>
              <p className="font-medium text-slate-700 mt-0.5">{customer.cansPerOrder}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Total Orders</p>
              <p className="font-medium text-slate-700 mt-0.5">{customer.orderCount}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Last Order</p>
              <p className="font-medium text-slate-700 mt-0.5">{customer.lastOrder}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-sm">
            <p className="text-slate-400 text-xs">Address</p>
            <p className="font-medium text-slate-700 mt-0.5">{customer.address}</p>
          </div>
        </div>
        <div className="p-5 border-t flex gap-3">
          <button className="flex-1 bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
            Edit Customer
          </button>
          <button className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            {customer.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddCustomerModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-slate-800">Add New Customer</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Full Name', placeholder: 'e.g. Priya Sharma', type: 'text' },
            { label: 'Mobile Number', placeholder: '+91 98400 XXXXX', type: 'tel' },
            { label: 'Address', placeholder: 'Delivery address', type: 'text' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Zone</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400">
                <option>Anna Nagar East</option>
                <option>Anna Nagar West</option>
                <option>Kilpauk</option>
                <option>Aminjikarai</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Subscription</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400">
                <option value="daily">Daily</option>
                <option value="alternate">Alternate Days</option>
                <option value="custom">Custom</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-5 border-t flex gap-3">
          <button className="flex-1 bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
            Add Customer
          </button>
          <button onClick={onClose} className="px-5 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Customers() {
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const zones = ['all', 'Anna Nagar East', 'Anna Nagar West', 'Kilpauk', 'Aminjikarai'];

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) || c.address.toLowerCase().includes(search.toLowerCase());
    const matchZone = zoneFilter === 'all' || c.zone === zoneFilter;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchZone && matchStatus;
  });

  return (
    <div className="space-y-5">
      {selected && <CustomerModal customer={selected} onClose={() => setSelected(null)} />}
      {showAdd && <AddCustomerModal onClose={() => setShowAdd(false)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Customers</h1>
          <p className="text-sm text-slate-500">{customers.filter(c => c.status === 'active').length} active · {customers.length} total</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Import CSV
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, address..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
          />
        </div>
        <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-brand-400">
          {zones.map(z => <option key={z} value={z}>{z === 'all' ? 'All Zones' : z}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-brand-400">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Zone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Subscription</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Wallet</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Dues</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => (
                <tr key={c.id} onClick={() => setSelected(c)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{c.name}</p>
                        <p className="text-slate-400 text-xs">{c.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />{c.zone}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                      {SUB_LABELS[c.subscription]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${c.walletBalance >= 100 ? 'text-green-600' : c.walletBalance > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                      ₹{c.walletBalance}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span className={`font-semibold ${c.outstandingDues > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                      {c.outstandingDues > 0 ? `₹${c.outstandingDues}` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {c.status === 'active'
                      ? <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium"><CheckCircle className="w-3 h-3" />Active</span>
                      : <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-xs px-2.5 py-0.5 rounded-full font-medium"><XCircle className="w-3 h-3" />Inactive</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <span className="text-slate-600 font-medium">{c.orderCount}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {filtered.length} of {customers.length} customers</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs">Prev</button>
            <button className="px-3 py-1 bg-brand-600 text-white rounded-lg text-xs">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
