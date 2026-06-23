import { useState } from 'react';
import { Wallet, TrendingDown, Plus, Minus, Search, Send } from 'lucide-react';
import { customers } from '../data/mockData';

function AdjustModal({ customer, onClose }) {
  const [mode, setMode] = useState('credit');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  if (!customer) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-slate-800">Adjust Wallet — {customer.name}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-sm">Current Balance</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">₹{customer.walletBalance}</p>
          </div>
          <div className="flex rounded-xl overflow-hidden border border-slate-200">
            <button onClick={() => setMode('credit')} className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === 'credit' ? 'bg-green-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
              <Plus className="w-4 h-4" /> Credit
            </button>
            <button onClick={() => setMode('debit')} className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === 'debit' ? 'bg-red-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
              <Minus className="w-4 h-4" /> Debit
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Note (optional)</label>
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Cash received, refund..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          {amount && (
            <div className={`rounded-lg p-3 text-sm font-medium text-center ${mode === 'credit' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              New balance: ₹{mode === 'credit' ? customer.walletBalance + parseInt(amount || 0) : customer.walletBalance - parseInt(amount || 0)}
            </div>
          )}
        </div>
        <div className="p-5 border-t flex gap-3">
          <button className={`flex-1 text-white py-2 rounded-lg text-sm font-medium ${mode === 'credit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
            {mode === 'credit' ? 'Credit Wallet' : 'Debit Wallet'}
          </button>
          <button onClick={onClose} className="px-5 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function WalletDues() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [adjusting, setAdjusting] = useState(null);

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (tab === 'dues') return matchSearch && c.outstandingDues > 0;
    if (tab === 'lowwallet') return matchSearch && c.walletBalance < 100 && c.status === 'active';
    return matchSearch;
  });

  const totalWallet = customers.reduce((s, c) => s + c.walletBalance, 0);
  const totalDues = customers.reduce((s, c) => s + c.outstandingDues, 0);
  const lowWalletCount = customers.filter(c => c.walletBalance < 100 && c.status === 'active').length;

  return (
    <div className="space-y-5">
      {adjusting && <AdjustModal customer={adjusting} onClose={() => setAdjusting(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Wallet & Dues</h1>
          <p className="text-sm text-slate-500">Manage customer balances and outstanding payments</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Wallet Balance</p>
              <p className="text-xl font-bold text-green-600">₹{totalWallet.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Outstanding Dues</p>
              <p className="text-xl font-bold text-red-600">₹{totalDues.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Low Wallet (&lt;₹100)</p>
              <p className="text-xl font-bold text-amber-600">{lowWalletCount} customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customer..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {[{ key: 'all', label: 'All' }, { key: 'dues', label: 'Has Dues' }, { key: 'lowwallet', label: 'Low Wallet' }].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
          <Send className="w-4 h-4" /> Send Reminder
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Wallet Balance</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Dues</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Zone</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold text-base ${c.walletBalance >= 200 ? 'text-green-600' : c.walletBalance >= 100 ? 'text-slate-700' : c.walletBalance > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                      ₹{c.walletBalance}
                    </span>
                    {c.walletBalance < 100 && c.status === 'active' && (
                      <span className="block text-xs text-amber-500 mt-0.5">Low</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.outstandingDues > 0
                      ? <span className="font-semibold text-red-600">₹{c.outstandingDues}</span>
                      : <span className="text-slate-300">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{c.zone}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setAdjusting(c)}
                        className="text-xs bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-100 font-medium"
                      >
                        Adjust
                      </button>
                      {c.outstandingDues > 0 && (
                        <button className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium">
                          Collect
                        </button>
                      )}
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
