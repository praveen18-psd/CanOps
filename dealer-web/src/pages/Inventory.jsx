import { Package, TrendingDown, ArrowDown, ArrowUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { inventory } from '../data/mockData';

export default function Inventory() {
  const low = inventory.availableStock < inventory.lowStockThreshold;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Inventory</h1>
        <p className="text-sm text-slate-500">Can stock management</p>
      </div>

      {low && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 text-amber-700">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">Low stock alert — only <strong>{inventory.availableStock}</strong> cans remaining. Threshold: {inventory.lowStockThreshold}.</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Cans', value: inventory.totalCans, icon: Package, color: 'bg-blue-50 text-blue-600' },
          { label: 'Available Stock', value: inventory.availableStock, icon: Package, color: low ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600' },
          { label: 'Dispatched Today', value: inventory.dispatchedToday, icon: ArrowUp, color: 'bg-purple-50 text-purple-600' },
          { label: 'Returned Today', value: inventory.returnedToday, icon: ArrowDown, color: 'bg-teal-50 text-teal-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-700 text-sm mb-4">5-Day Dispatch vs Return</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={inventory.history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="dispatched" fill="#1a8fe0" radius={[4, 4, 0, 0]} name="Dispatched" />
              <Bar dataKey="returned" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Returned" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-700 text-sm mb-4">Stock Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase">Dispatched</th>
                  <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase">Returned</th>
                  <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase">Closing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inventory.history.map(h => (
                  <tr key={h.date} className="hover:bg-slate-50">
                    <td className="py-2.5 font-medium text-slate-700">{h.date}</td>
                    <td className="py-2.5 text-right text-blue-600 font-semibold">{h.dispatched}</td>
                    <td className="py-2.5 text-right text-teal-600 font-semibold">{h.returned}</td>
                    <td className="py-2.5 text-right text-slate-700 font-semibold">{h.closing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-700 text-sm mb-4">Adjust Stock</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Adjustment Type</label>
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400">
              <option>Add Stock (Procurement)</option>
              <option>Remove Stock (Loss/Damage)</option>
              <option>Stock Count Correction</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Quantity</label>
            <input type="number" placeholder="0" className="w-28 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <input type="text" placeholder="Reason for adjustment..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700">
            Save Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}
