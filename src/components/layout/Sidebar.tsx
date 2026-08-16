'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PieChart,
  Users,
  TrendingUp,
  UserCheck,
  Truck,
  MapPin,
  Wheat,
  RotateCcw,
  ShoppingBag,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Sprout,
  ShieldCheck,
  BarChart3,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { useAppState } from '@/context/AppStateContext';

export const modulesNav = [
  { slug: 'budget', name: 'Budget', desc: 'Financial planning & variance', icon: PieChart, accent: 'text-emerald-400 border-emerald-500/20' },
  { slug: 'partners', name: 'Partners', desc: 'Suppliers, SLA & Vetting', icon: Users, accent: 'text-amber-400 border-amber-500/20' },
  { slug: 'raise-funds', name: 'Raise Funds', desc: 'Crowd-sponsor & investor ROI', icon: TrendingUp, accent: 'text-teal-400 border-teal-500/20' },
  { slug: 'farmers', name: 'Farmers', desc: 'Ghana Card KYC & GIS assets', icon: UserCheck, accent: 'text-emerald-400 border-emerald-500/20' },
  { slug: 'inputs', name: 'Inputs', desc: 'Vouchers & OTP pickup', icon: Truck, accent: 'text-sky-400 border-sky-500/20' },
  { slug: 'mechanization', name: 'Mechanization', desc: 'GPS tractor telematics', icon: MapPin, accent: 'text-indigo-400 border-indigo-500/20' },
  { slug: 'harvest', name: 'Harvest', desc: 'Yield & EUDR grading', icon: Wheat, accent: 'text-amber-400 border-amber-500/20' },
  { slug: 'retrieval', name: 'Retrieval', desc: 'Waybill & debt deduction', icon: RotateCcw, accent: 'text-purple-400 border-purple-500/20' },
  { slug: 'trade', name: 'Trade Dept', desc: 'GCX & off-taker spot/futures', icon: ShoppingBag, accent: 'text-blue-400 border-blue-500/20' },
  { slug: 'money-back', name: 'Money Back', desc: 'Waterfall & MoMo payouts', icon: DollarSign, accent: 'text-emerald-400 border-emerald-500/20' },
];

export const secondaryNav = [
  { name: 'Reports & Analytics', icon: BarChart3, href: '/reports' },
  { name: 'Calendar & Cycles', icon: Calendar, href: '/calendar' },
  { name: 'Messages & Alerts', icon: MessageSquare, href: '/messages' },
  { name: 'Documents & Contracts', icon: FileText, href: '/documents' },
  { name: 'Settings & Roles', icon: Settings, href: '/settings', requiresAdminOrStaff: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { activeUserPerspective } = useAppState();

  const isFieldAgent = activeUserPerspective === 'field_agent';

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0B1120] border-r border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-[#0F172A]">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <Sprout className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="font-extrabold text-lg leading-none tracking-tight text-white flex items-center gap-1.5">
                Grow<span className="text-emerald-400">ForMe</span>
              </div>
              <div className="text-[10px] font-semibold tracking-wider uppercase text-amber-400 mt-0.5">
                Agri Finance ERP
              </div>
            </div>
          </Link>
        )}

        {collapsed && (
          <Link href="/" className="mx-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <Sprout className="w-6 h-6 text-slate-950" />
            </div>
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {!collapsed && (
            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Operational Hubs</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20">
                Active
              </span>
            </div>
          )}
          <nav className="space-y-1">
            {modulesNav.map((item) => {
              const href = `/${item.slug}`;
              const isActive = pathname === href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.slug}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-950/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && (
                    <div className="overflow-hidden">
                      <div className="truncate font-semibold text-slate-100">{item.name}</div>
                      <div className="text-[11px] text-slate-400 truncate leading-none mt-0.5">{item.desc}</div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Secondary System Nav */}
        <div>
          {!collapsed && (
            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              System Utilities
            </div>
          )}
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              if (item.requiresAdminOrStaff && isFieldAgent) return null;
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#0A0F1D]">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-emerald-500/40"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0A0F1D]"></span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1">
              <div className="text-sm font-bold text-slate-200 truncate">
                {activeUserPerspective === 'superadmin'
                  ? 'Nana Kwame Addo'
                  : activeUserPerspective === 'staff'
                  ? 'Abena Osei (Staff)'
                  : 'Kwame Boateng (Field Agent)'}
              </div>
              <div className="text-xs text-slate-400 truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="capitalize">{activeUserPerspective.replace('_', ' ')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
