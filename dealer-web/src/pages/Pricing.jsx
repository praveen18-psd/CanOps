import { useState } from 'react';
import { Tag, Save, IndianRupee } from 'lucide-react';
import { pricingConfig } from '../data/mockData';

export default function Pricing() {
  const [canPrice, setCanPrice] = useState(pricingConfig.canPrice);
  const [deposit, setDeposit] = useState(pricingConfig.depositAmount);
  const [zones, setZones] = useState(pricingConfig.zones);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Pricing Configuration</h1>
        <p className="text-sm text-slate-500">Set can price, deposits, and zone-specific rates</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          Pricing updated successfully. Customers will be notified.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Global pricing */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <Tag className="w-4 h-4 text-brand-600" /> Global Pricing
          </h2>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Default Can Price (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                value={canPrice}
                onChange={e => setCanPrice(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-400 text-slate-700 font-medium"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Applied to all zones unless overridden below</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Can Deposit Amount (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                value={deposit}
                onChange={e => setDeposit(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-400 text-slate-700 font-medium"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">One-time deposit per can for new customers</p>
          </div>
        </div>

        {/* Zone pricing */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-semibold text-slate-700">Zone-Specific Pricing</h2>
          {zones.map((z, i) => (
            <div key={z.zone} className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{z.zone}</p>
              </div>
              <div className="relative w-28">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="number"
                  value={z.price}
                  onChange={e => {
                    const updated = [...zones];
                    updated[i] = { ...updated[i], price: Number(e.target.value) };
                    setZones(updated);
                  }}
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-400 text-slate-700 font-medium"
                />
              </div>
              {z.price !== canPrice && (
                <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">Custom</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Effective preview */}
      <div className="bg-brand-50 rounded-xl p-5 border border-brand-100">
        <h2 className="font-semibold text-brand-800 mb-3">Pricing Preview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {zones.map(z => (
            <div key={z.zone} className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500 mb-1 truncate">{z.zone}</p>
              <p className="text-2xl font-bold text-brand-600">₹{z.price}</p>
              <p className="text-xs text-slate-400">per can</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-700">
          <Save className="w-4 h-4" /> Save Pricing
        </button>
      </div>
    </div>
  );
}
