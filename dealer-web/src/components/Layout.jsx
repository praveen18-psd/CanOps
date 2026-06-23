import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShoppingBag, Truck, UserCheck,
  Package, Wallet, BarChart2, Bell, Map, Tag, Calendar,
  ChevronLeft, ChevronRight, LogOut, Droplets, Menu, X
} from 'lucide-react';
import { dealer } from '../data/mockData';

const navItems = [
  { to: '/',                label: 'Dashboard',        icon: LayoutDashboard },
  { to: '/orders',          label: 'Orders',            icon: ShoppingBag },
  { to: '/customers',       label: 'Customers',         icon: Users },
  { to: '/assignment',      label: 'Delivery Assignment', icon: Truck },
  { to: '/personnel',       label: 'Delivery Personnel', icon: UserCheck },
  { to: '/inventory',       label: 'Inventory',         icon: Package },
  { to: '/wallet',          label: 'Wallet & Dues',     icon: Wallet },
  { to: '/analytics',       label: 'Reports & Analytics', icon: BarChart2 },
  { to: '/notifications',   label: 'Notifications',     icon: Bell },
  { to: '/route-overview',  label: 'Route Overview',    icon: Map },
  { to: '/pricing',         label: 'Pricing',           icon: Tag },
  { to: '/calendar',        label: 'Holiday Calendar',  icon: Calendar },
];

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-brand-700 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <Droplets className="w-5 h-5 text-brand-600" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-base leading-tight">CanOps</p>
            <p className="text-brand-300 text-xs">Dealer Portal</p>
          </div>
        )}
      </div>

      {/* Dealer info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-brand-700">
          <p className="text-white text-sm font-medium truncate">{dealer.name}</p>
          <p className="text-brand-300 text-xs truncate">{dealer.owner}</p>
          <span className="mt-1 inline-block bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">{dealer.plan}</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-colors ${
                isActive
                  ? 'bg-brand-500 text-white font-medium'
                  : 'text-brand-200 hover:bg-brand-700 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className={`border-t border-brand-700 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={() => navigate('/login')}
          className={`flex items-center gap-2 text-brand-300 hover:text-white text-sm transition-colors ${collapsed ? '' : 'w-full px-2 py-2 rounded-lg hover:bg-brand-700'}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-brand-800 transition-all duration-200 flex-shrink-0 ${collapsed ? 'w-16' : 'w-60'}`}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-brand-600 text-white rounded-r-full p-1 shadow-md z-10"
          style={{ left: collapsed ? '52px' : '228px' }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-brand-800 flex flex-col z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 rounded-lg hover:bg-slate-100" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-800">{dealer.name}</p>
              <p className="text-xs text-slate-500">{dealer.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              Today: Mon, 23 Jun 2026
            </span>
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">
              {dealer.owner.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
