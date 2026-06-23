import { Map, Navigation, MapPin, Phone } from 'lucide-react';
import { deliveryPersonnel, orders } from '../data/mockData';

const ZONE_COLORS = {
  'Anna Nagar East': '#1a8fe0',
  'Anna Nagar West': '#8b5cf6',
  'Kilpauk':         '#14b8a6',
  'Aminjikarai':     '#f97316',
};

export default function RouteOverview() {
  const activePersonnel = deliveryPersonnel.filter(d => d.status === 'active');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Route Overview</h1>
          <p className="text-sm text-slate-500">Live delivery personnel positions — today's window</p>
        </div>
        <span className="flex items-center gap-2 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Map placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="relative bg-slate-100 h-72 flex items-center justify-center">
          {/* Fake map grid */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
          {/* Delivery pins scattered */}
          <div className="absolute inset-0">
            {[
              { x: '20%', y: '30%', name: 'Murugan S', color: ZONE_COLORS['Anna Nagar East'], delivered: 18 },
              { x: '45%', y: '45%', name: 'Selvaraj K', color: ZONE_COLORS['Anna Nagar West'], delivered: 22 },
              { x: '65%', y: '25%', name: 'Vijay R', color: ZONE_COLORS['Kilpauk'], delivered: 15 },
              { x: '75%', y: '65%', name: 'Anbu T', color: ZONE_COLORS['Aminjikarai'], delivered: 20 },
            ].map(pin => (
              <div key={pin.name} className="absolute" style={{ left: pin.x, top: pin.y, transform: 'translate(-50%, -50%)' }}>
                <div className="relative group">
                  <div
                    className="w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm cursor-pointer"
                    style={{ background: pin.color }}
                  >
                    {pin.name.charAt(0)}
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-xs rounded-lg px-2 py-1.5 whitespace-nowrap shadow-lg">
                    {pin.name} — {pin.delivered} delivered
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 absolute -top-0.5 -right-0.5 border border-white animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 text-center">
            <Map className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">Google Maps integration</p>
            <p className="text-slate-400 text-xs mt-1">Live positions update every 30 seconds</p>
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 flex flex-wrap gap-3 border-t border-slate-100">
          {Object.entries(ZONE_COLORS).map(([zone, color]) => (
            <div key={zone} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
              <span className="text-xs text-slate-600">{zone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Personnel status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activePersonnel.map(dp => {
          const dpOrders = orders.filter(o => o.deliveryPersonId === dp.id);
          const delivered = dpOrders.filter(o => o.status === 'delivered').length;
          const inProgress = dpOrders.filter(o => o.status === 'in-transit' || o.status === 'assigned').length;
          return (
            <div key={dp.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: ZONE_COLORS[dp.zone] }}
                >
                  {dp.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{dp.name}</p>
                  <p className="text-xs text-slate-400">{dp.zone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center mb-3">
                <div className="bg-green-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-green-600">{delivered}</p>
                  <p className="text-xs text-slate-400">Delivered</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-blue-600">{inProgress}</p>
                  <p className="text-xs text-slate-400">In Progress</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 border border-slate-200 text-slate-600 py-1.5 rounded-lg text-xs hover:bg-slate-50">
                  <Phone className="w-3 h-3" /> Call
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 bg-brand-50 text-brand-700 py-1.5 rounded-lg text-xs hover:bg-brand-100">
                  <Navigation className="w-3 h-3" /> Track
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
