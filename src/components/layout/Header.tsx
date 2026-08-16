'use client';

import { Search, Bell, Globe, ChevronDown, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [activeRole, setActiveRole] = useState<'admin' | 'field_agent' | 'investor' | 'aggregator' | 'offtaker'>('admin');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles = [
    { key: 'admin', label: 'Super Admin (System HQ)' },
    { key: 'field_agent', label: 'Field Agent (Northern Region)' },
    { key: 'investor', label: 'Investor / Sponsor Portal' },
    { key: 'aggregator', label: 'Aggregator Partner' },
    { key: 'offtaker', label: 'Off-taker (GCX Trader)' },
  ];

  return (
    <header className="h-16 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Left Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Global search (Ghana Card, Waybill #, Farmer ID, Input Voucher)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>
      </div>

      {/* Right Action Utilities & Role Switcher */}
      <div className="flex items-center gap-4">
        {/* Active Agri Region Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ecosystem: <strong className="text-white">Ghana (West Africa)</strong></span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
        </div>

        {/* System Notifications */}
        <button className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>

        {/* Dynamic Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 text-xs font-semibold text-emerald-400 hover:border-emerald-500/60 transition shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Role: <strong className="text-white capitalize">{activeRole.replace('_', ' ')}</strong></span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800 mb-1">
                Switch View Perspective
              </div>
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => {
                    setActiveRole(r.key as any);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-800 transition ${
                    activeRole === r.key ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300'
                  }`}
                >
                  <span>{r.label}</span>
                  {activeRole === r.key && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
