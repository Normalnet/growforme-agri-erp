'use client';

import Link from 'next/link';
import DashboardLayout from './layout-wrapper';
import { modulesNav } from '@/components/layout/Sidebar';
import { mockCycles, mockFarmers, mockTradeOrders, mockSettlements } from '@/lib/mock-data';
import { Sprout, TrendingUp, Users, DollarSign, ArrowUpRight, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Home() {
  const totalFarmers = mockFarmers.length;
  const activeAcreage = mockCycles.reduce((acc, c) => acc + c.allocatedAcreage, 0);
  const totalVolumeGHS = mockTradeOrders.reduce((acc, t) => acc + t.totalValueGHS, 0);

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 p-8 shadow-2xl">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            GrowForMe Agri Finance Ecosystem
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Enterprise Agricultural Financing & Supply Chain ERP
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Integrated outgrower management, digitized farm asset profiling, real-time mechanization telematics, and 4-tier Mobile Money revenue settlement for West African agribusinesses.
          </p>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block opacity-10 pointer-events-none">
          <Sprout className="w-96 h-96 text-emerald-400" />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Acreage Under Management</div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">{activeAcreage.toLocaleString()} Acres</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Northern & Ashanti Clusters</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase">Registered Outgrowers</div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">2,900+ Farmers</div>
          <div className="text-xs text-slate-400 mt-1">Ghana Card KYC Verified</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase">Institutional Off-taker Volume</div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">GH₵ {(totalVolumeGHS / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-sky-400 mt-1">GCX & Export Contracts</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase">Capital Raised To-Date</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2 font-mono">GH₵ 10.5M</div>
          <div className="text-xs text-emerald-400 mt-1">100% Escrow Protected</div>
        </div>
      </div>

      {/* 10 Core Application Hub Navigation Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">The 10 Core Application Hub Modules</h2>
          <span className="text-xs font-semibold text-slate-400">Click any module to launch interface</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modulesNav.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.slug}
                href={`/${module.slug}`}
                className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-slate-900 border ${module.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">Hub {module.slug.toUpperCase()}</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-400 transition">
                    {module.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{module.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-bold group-hover:text-emerald-400 transition">
                  <span>Open Module View</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
