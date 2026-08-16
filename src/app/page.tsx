'use client';

import Link from 'next/link';
import DashboardLayout from './layout-wrapper';
import { modulesNav } from '@/components/layout/Sidebar';
import { useAppState } from '@/context/AppStateContext';
import { Sprout, ArrowUpRight, ChevronRight, RotateCcw, Users, DollarSign, TrendingUp, ShoppingBag, MapPin, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { farmers, farms, tradeOrders, campaigns, settlements, retrievals, disbursements, resetToDefaultSeed } = useAppState();

  // Dynamic Traceable Metrics Computed from Active State
  const totalFarmers = farmers.length;
  const activeAcreage = farms.reduce((acc, f) => acc + f.acreage, 0);
  const totalVolumeGHS = tradeOrders.reduce((acc, t) => acc + t.totalValueGHS, 0);
  const totalRaisedGHS = campaigns.reduce((acc, c) => acc + c.raisedAmountGHS, 0);
  const totalSettledRevenue = settlements.reduce((acc, s) => acc + s.grossRevenueGHS, 0);
  const totalInKindDebt = farmers.reduce((acc, f) => acc + f.totalLoansInKindGHS, 0);

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
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={resetToDefaultSeed}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              Reset State to Default Ghanaian Seed Data
            </button>

            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Live State Engine Connected
            </span>
          </div>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block opacity-10 pointer-events-none">
          <Sprout className="w-96 h-96 text-emerald-400" />
        </div>
      </div>

      {/* Dynamic Traceable KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Link href="/farmers" className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start text-xs text-slate-400 font-semibold uppercase">
            <span>Acreage Under Management</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">{activeAcreage.toLocaleString()} Acres</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Across {farms.length} Digitized Farms</span>
          </div>
        </Link>

        <Link href="/farmers" className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start text-xs text-slate-400 font-semibold uppercase">
            <span>Registered Outgrowers</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">{totalFarmers} Farmers</div>
          <div className="text-xs text-slate-400 mt-1">Ghana Card & MoMo Verified</div>
        </Link>

        <Link href="/trade" className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start text-xs text-slate-400 font-semibold uppercase">
            <span>Off-Takers Trade Volume</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">GH₵ {(totalVolumeGHS / 1000000).toFixed(2)}M</div>
          <div className="text-xs text-sky-400 mt-1">GCX & Export Contracts</div>
        </Link>

        <Link href="/raise-funds" className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start text-xs text-slate-400 font-semibold uppercase">
            <span>Capital Raised To-Date</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2 font-mono">GH₵ {(totalRaisedGHS / 1000000).toFixed(2)}M</div>
          <div className="text-xs text-emerald-400 mt-1">100% Escrow Protected</div>
        </Link>
      </div>

      {/* Dynamic Traceable Activity Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase">Active In-Kind Loan Credit</div>
          <div className="text-xl font-extrabold text-rose-400 font-mono">GH₵ {totalInKindDebt.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500">Tracked in Inputs & Mechanization Hubs</div>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase">Issued Input Vouchers</div>
          <div className="text-xl font-extrabold text-sky-400 font-mono">{disbursements.length} Vouchers Issued</div>
          <div className="text-[11px] text-slate-500">OTP pickup verified at agro-depots</div>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase">Settled Gross Revenue</div>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">GH₵ {totalSettledRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500">Waterfall payouts reconciled</div>
        </div>
      </div>

      {/* Operational Hub Navigation Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">Operational Hubs</h2>
          <span className="text-xs font-semibold text-slate-400">Click any hub to launch view</span>
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
                    <span className="text-xs font-mono font-bold text-slate-400">{module.slug.toUpperCase()}</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-400 transition">
                    {module.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{module.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-bold group-hover:text-emerald-400 transition">
                  <span>Open Hub View</span>
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
