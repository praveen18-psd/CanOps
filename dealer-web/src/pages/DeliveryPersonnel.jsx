import { useState } from 'react';
import { Plus, Phone, MapPin, Truck, XCircle, CheckCircle2 } from 'lucide-react';
import { deliveryPersonnel } from '../data/mockData';

function PersonnelModal({ person, onClose }) {
  if (!person) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-slate-800">Delivery Person</h2>
          <button onClick={onClose}><XCircle className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-2xl font-bold">
              {person.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-lg">{person.name}</p>
              <p className="text-slate-500 text-sm">{person.id}</p>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${person.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {person.status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Phone</p>
              <p className="font-medium text-slate-700 mt-0.5">{person.phone}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Assigned Zone</p>
              <p className="font-medium text-slate-700 mt-0.5">{person.zone}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Vehicle</p>
              <p className="font-medium text-slate-700 mt-0.5">{person.vehicle}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Today's Deliveries</p>
              <p className="font-bold text-brand-600 mt-0.5 text-lg">{person.deliveriesToday}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 col-span-2">
              <p className="text-slate-400 text-xs">All-Time Deliveries</p>
              <p className="font-bold text-slate-700 mt-0.5 text-xl">{person.totalDeliveries.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="p-5 border-t flex gap-3">
          <button className="flex-1 bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700">Edit</button>
          <button className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm hover:bg-slate-50">
            {person.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-slate-800">Add Delivery Person</h2>
          <button onClick={onClose}><XCircle className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Full Name', placeholder: 'e.g. Murugan S' },
            { label: 'Mobile Number', placeholder: '+91 94451 XXXXX' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
              <input placeholder={f.placeholder} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
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
              <label className="block text-xs font-medium text-slate-600 mb-1">Vehicle Type</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400">
                <option>Two-Wheeler</option>
                <option>Three-Wheeler</option>
                <option>Van</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-5 border-t flex gap-3">
          <button className="flex-1 bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700">Add Person</button>
          <button onClick={onClose} className="px-5 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function DeliveryPersonnel() {
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const active = deliveryPersonnel.filter(d => d.status === 'active');
  const inactive = deliveryPersonnel.filter(d => d.status === 'inactive');

  return (
    <div className="space-y-5">
      {selected && <PersonnelModal person={selected} onClose={() => setSelected(null)} />}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Delivery Personnel</h1>
          <p className="text-sm text-slate-500">{active.length} active · {inactive.length} inactive</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700">
          <Plus className="w-4 h-4" /> Add Person
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {active.map(dp => (
          <div key={dp.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-bold mx-auto mb-2">
              {dp.name.charAt(0)}
            </div>
            <p className="font-semibold text-slate-800 text-sm truncate">{dp.name}</p>
            <p className="text-2xl font-bold text-brand-600 mt-1">{dp.deliveriesToday}</p>
            <p className="text-xs text-slate-400">Today</p>
          </div>
        ))}
      </div>

      {/* Active table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Active Personnel</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Zone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Vehicle</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Today</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">All Time</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {deliveryPersonnel.map(dp => (
                <tr key={dp.id} onClick={() => setSelected(dp)} className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                        {dp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{dp.name}</p>
                        <p className="text-slate-400 text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3" />{dp.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{dp.zone}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="flex items-center gap-1 text-slate-600"><Truck className="w-3 h-3 text-slate-400" />{dp.vehicle}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-brand-600">{dp.deliveriesToday}</span>
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <span className="font-medium text-slate-600">{dp.totalDeliveries.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {dp.status === 'active'
                      ? <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium"><CheckCircle2 className="w-3 h-3" />Active</span>
                      : <span className="bg-slate-100 text-slate-500 text-xs px-2.5 py-0.5 rounded-full font-medium">Inactive</span>
                    }
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
