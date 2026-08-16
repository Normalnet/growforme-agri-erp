'use client';

import { Search, Bell, Globe, ChevronDown, CheckCircle2, ShieldCheck, Shield, X, ArrowRight, Menu } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import { useState, useMemo } from 'react';
import Link from 'next/link';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const {
    activeUserPerspective,
    setActiveUserPerspective,
    farmers,
    retrievals,
    disbursements,
    tradeOrders,
    partners,
    cycles,
  } = useAppState();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const perspectives = [
    { key: 'superadmin', label: 'Super Admin' },
    { key: 'staff', label: 'Staff Member' },
    { key: 'field_agent', label: 'Field Agent' },
  ];

  // Dynamic Multi-Entity Global Search Engine
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();

    const results: { type: string; title: string; subtitle: string; link: string }[] = [];

    farmers.forEach((f) => {
      if (
        f.fullName.toLowerCase().includes(q) ||
        f.ghanaCardNo.toLowerCase().includes(q) ||
        f.momoNumber.includes(q) ||
        f.community.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Farmer Profile',
          title: f.fullName,
          subtitle: `Card: ${f.ghanaCardNo} • ${f.community}, ${f.region}`,
          link: '/farmers',
        });
      }
    });

    retrievals.forEach((r) => {
      if (
        r.waybillNo.toLowerCase().includes(q) ||
        r.farmerName.toLowerCase().includes(q) ||
        r.driverName.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Waybill & Retrieval',
          title: r.waybillNo,
          subtitle: `${r.farmerName} • ${r.bagsRetrieved} Bags • ${r.destinationDepot}`,
          link: '/retrieval',
        });
      }
    });

    disbursements.forEach((d) => {
      if (
        d.voucherCode.toLowerCase().includes(q) ||
        d.farmerName.toLowerCase().includes(q) ||
        d.depotName.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Input Voucher',
          title: d.voucherCode,
          subtitle: `${d.farmerName} • Cost: GH₵ ${d.totalCostGHS}`,
          link: '/inputs',
        });
      }
    });

    tradeOrders.forEach((t) => {
      if (
        t.contractNo.toLowerCase().includes(q) ||
        t.offtakerName.toLowerCase().includes(q) ||
        t.commodity.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Off-taker Contract',
          title: t.contractNo,
          subtitle: `${t.offtakerName} • ${t.commodity} (${t.quantityMT} MT)`,
          link: '/trade',
        });
      }
    });

    partners.forEach((p) => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.contactPerson.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Agri Partner',
          title: p.name,
          subtitle: `${p.category} • Contact: ${p.contactPerson}`,
          link: '/partners',
        });
      }
    });

    cycles.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.crop.toLowerCase().includes(q)) {
        results.push({
          type: 'Crop Cycle',
          title: c.name,
          subtitle: `${c.crop} • Region: ${c.region} • ${c.status}`,
          link: '/budget',
        });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery, farmers, retrievals, disbursements, tradeOrders, partners, cycles]);

  return (
    <header className="h-16 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 gap-3">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        aria-label="Toggle Navigation Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Dynamic Working Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md relative">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search Card, Waybill #, Voucher..."
            className="w-full pl-9 sm:pl-10 pr-8 sm:pr-9 py-1.5 sm:py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute top-12 left-0 right-0 bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-800 flex justify-between">
              <span>Matches Found ({searchResults.length})</span>
              <span className="text-emerald-400">Live Search</span>
            </div>

            {searchResults.length > 0 ? (
              searchResults.map((res, idx) => (
                <Link
                  key={idx}
                  href={res.link}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 transition group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition">
                        {res.title}
                      </span>
                      <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-400 font-mono">
                        {res.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{res.subtitle}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching Ghana Card or record found for "{searchQuery}".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Action Utilities */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ecosystem: <strong className="text-white">Ghana Agribusiness</strong></span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
        </div>

        <button className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>

        {/* Dynamic User Role Perspective Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 text-xs font-semibold text-emerald-400 hover:border-emerald-500/60 transition shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Role: <strong className="text-white capitalize">{activeUserPerspective.replace('_', ' ')}</strong></span>
            <span className="sm:hidden font-bold uppercase">{activeUserPerspective.substring(0, 5)}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800 mb-1">
                Switch Role Perspective
              </div>
              {perspectives.map((p) => (
                <button
                  key={p.key}
                  onClick={() => {
                    setActiveUserPerspective(p.key as any);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left text-xs flex items-center justify-between hover:bg-slate-800 transition ${
                    activeUserPerspective === p.key ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300'
                  }`}
                >
                  <span>{p.label}</span>
                  {activeUserPerspective === p.key && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
