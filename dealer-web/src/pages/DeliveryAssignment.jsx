import { useState } from 'react';
import { Zap, UserCheck, MapPin, Package, Clock, CheckCircle2 } from 'lucide-react';
import { orders, deliveryPersonnel } from '../data/mockData';

const ZONE_COLORS = {
  'Anna Nagar East': 'bg-blue-100 text-blue-700 border-blue-200',
  'Anna Nagar West': 'bg-violet-100 text-violet-700 border-violet-200',
  'Kilpauk':         'bg-teal-100 text-teal-700 border-teal-200',
  'Aminjikarai':     'bg-orange-100 text-orange-700 border-orange-200',
};

export default function DeliveryAssignment() {
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activePersonnel = deliveryPersonnel.filter(d => d.status === 'active');

  const [assignments, setAssignments] = useState(() => {
    const init = {};
    activePersonnel.forEach(dp => { init[dp.id] = []; });
    return init;
  });
  const [unassigned, setUnassigned] = useState(pendingOrders);
  const [dragOrder, setDragOrder] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDrop = (dpId) => {
    if (!dragOrder) return;
    setAssignments(prev => ({ ...prev, [dpId]: [...prev[dpId], dragOrder] }));
    setUnassigned(prev => prev.filter(o => o.id !== dragOrder.id));
    setDragOrder(null);
  };

  const handleAutoAssign = () => {
    const byZone = {};
    pendingOrders.forEach(o => {
      if (!byZone[o.zone]) byZone[o.zone] = [];
      byZone[o.zone].push(o);
    });
    const newAssignments = {};
    activePersonnel.forEach(dp => { newAssignments[dp.id] = []; });
    activePersonnel.forEach(dp => {
      const zoneOrders = byZone[dp.zone] || [];
      newAssignments[dp.id] = [...(newAssignments[dp.id] || []), ...zoneOrders];
    });
    setAssignments(newAssignments);
    setUnassigned([]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const removeFromAssignment = (dpId, orderId) => {
    const order = assignments[dpId].find(o => o.id === orderId);
    setAssignments(prev => ({ ...prev, [dpId]: prev[dpId].filter(o => o.id !== orderId) }));
    if (order) setUnassigned(prev => [...prev, order]);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Delivery Assignment</h1>
          <p className="text-sm text-slate-500">{unassigned.length} unassigned · {Object.values(assignments).flat().length} assigned</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAutoAssign}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700"
          >
            <Zap className="w-4 h-4" /> Auto-Assign by Zone
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4" /> Orders auto-assigned by zone successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Unassigned pool */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <h2 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Unassigned Orders
              <span className="ml-auto bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{unassigned.length}</span>
            </h2>
          </div>
          <div
            className="p-3 space-y-2 min-h-48"
            onDragOver={e => e.preventDefault()}
          >
            {unassigned.length === 0 && (
              <div className="text-center text-slate-400 text-sm py-8">All orders assigned</div>
            )}
            {unassigned.map(o => (
              <div
                key={o.id}
                draggable
                onDragStart={() => setDragOrder(o)}
                className="bg-white border border-slate-200 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-brand-300 transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{o.customerName}</p>
                    <p className="text-xs text-slate-400">{o.id} · {o.cans} can(s)</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${ZONE_COLORS[o.zone] || 'bg-slate-100 text-slate-600'}`}>
                    {o.zone.split(' ')[0]}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{o.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personnel drop zones */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activePersonnel.map(dp => (
            <div
              key={dp.id}
              className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(dp.id)}
            >
              <div className="px-4 py-3 border-b border-slate-100 bg-brand-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                    {dp.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{dp.name}</p>
                    <p className="text-xs text-slate-500">{dp.zone} · {dp.vehicle}</p>
                  </div>
                  <span className="bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {assignments[dp.id]?.length || 0}
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-2 min-h-36">
                {assignments[dp.id]?.length === 0 && (
                  <div className="border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-xs py-6">
                    Drop orders here
                  </div>
                )}
                {assignments[dp.id]?.map(o => (
                  <div key={o.id} className="bg-brand-50 border border-brand-100 rounded-lg p-2.5 flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{o.customerName}</p>
                      <p className="text-xs text-slate-400">{o.cans} can(s) · ₹{o.amount}</p>
                    </div>
                    <button
                      onClick={() => removeFromAssignment(dp.id, o.id)}
                      className="text-slate-400 hover:text-red-500 text-xs"
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm button */}
      {Object.values(assignments).flat().length > 0 && (
        <div className="flex justify-end">
          <button className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Confirm {Object.values(assignments).flat().length} Assignments
          </button>
        </div>
      )}
    </div>
  );
}
