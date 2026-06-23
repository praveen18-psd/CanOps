import { useState } from 'react';
import { Calendar, Plus, Trash2, AlertTriangle, XCircle } from 'lucide-react';
import { holidays } from '../data/mockData';

const TYPE_CONFIG = {
  holiday:    { label: 'Holiday',    color: 'bg-red-100 text-red-700 border-red-200' },
  suspension: { label: 'Suspension', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

function AddModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-slate-800">Add Non-Delivery Date</h2>
          <button onClick={onClose}><XCircle className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
            <input type="date" min="2026-06-23" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400">
              <option value="holiday">Public Holiday</option>
              <option value="suspension">Suspension (Stock / Operations)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Reason</label>
            <input placeholder="e.g. Pongal, stock shortage..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-xs text-amber-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Subscription orders for this date will be automatically skipped. Customers will be notified.</span>
          </div>
        </div>
        <div className="p-5 border-t flex gap-3">
          <button className="flex-1 bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700">Add Date</button>
          <button onClick={onClose} className="px-5 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function HolidayCalendar() {
  const [showAdd, setShowAdd] = useState(false);
  const [items, setItems] = useState(holidays);

  const months = [
    { label: 'Jul 2026', days: 31, start: 3 },
    { label: 'Aug 2026', days: 31, start: 6 },
  ];

  return (
    <div className="space-y-5">
      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Holiday Calendar</h1>
          <p className="text-sm text-slate-500">Mark non-delivery dates and notify customers automatically</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700">
          <Plus className="w-4 h-4" /> Add Date
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 text-amber-700 text-sm">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>Subscription orders on marked dates are automatically skipped and customers notified via WhatsApp.</span>
      </div>

      {/* Upcoming non-delivery dates */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Upcoming Non-Delivery Dates</h2>
        </div>
        {items.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p>No non-delivery dates marked</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {items.map((item, i) => {
              const cfg = TYPE_CONFIG[item.type];
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="text-center bg-slate-50 rounded-xl px-4 py-2 min-w-16">
                    <p className="text-xs text-slate-400">{new Date(item.date).toLocaleString('en', { month: 'short' })}</p>
                    <p className="text-2xl font-bold text-slate-800">{new Date(item.date).getDate()}</p>
                    <p className="text-xs text-slate-400">{new Date(item.date).getFullYear()}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{item.reason}</p>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {new Date(item.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color}`}>{cfg.label}</span>
                  <button
                    onClick={() => setItems(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Calendar mini-views */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {months.map(m => (
          <div key={m.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-3">{m.label}</h3>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} className="text-xs font-medium text-slate-400 py-1">{d}</div>
              ))}
              {Array.from({ length: m.start }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: m.days }, (_, i) => {
                const day = i + 1;
                const dateStr = `2026-${m.label.slice(0, 3) === 'Jul' ? '07' : '08'}-${String(day).padStart(2, '0')}`;
                const holiday = items.find(h => h.date === dateStr);
                return (
                  <div
                    key={day}
                    className={`text-xs rounded-lg py-1.5 font-medium transition-colors cursor-default ${
                      holiday
                        ? holiday.type === 'holiday' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    title={holiday?.reason}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
