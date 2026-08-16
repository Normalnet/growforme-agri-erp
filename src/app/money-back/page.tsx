'use client';

import DashboardLayout from '../layout-wrapper';
import { mockSettlements } from '@/lib/mock-data';
import { DollarSign, CheckCircle2, ArrowDownRight, Layers, Phone, Send, ShieldCheck, PieChart } from 'lucide-react';

export default function MoneyBackModule() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <DollarSign className="w-4 h-4" />
            Module 10 / Revenue Waterfall & MoMo Disbursements
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Money Back & Profit Settlement</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Automate revenue distribution: Investor ROI, Input Recovery, Aggregator Fees, & Bulk MoMo Farmer Payouts.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/40 text-sm">
          <Send className="w-4 h-4" />
          <span>Execute Bulk MoMo Payout</span>
        </button>
      </div>

      {/* 4-Tier Waterfall Visualization Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Automated Revenue Waterfall Distribution Logic
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Tier 1: Investor Principal + ROI</div>
            <div className="text-2xl font-extrabold text-white font-mono">GH₵ 6,100,000</div>
            <p className="text-xs text-slate-400">Escrow return to retail & institutional sponsors.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">Tier 2: Input & Mech Recovery</div>
            <div className="text-2xl font-extrabold text-white font-mono">GH₵ 1,200,000</div>
            <p className="text-xs text-slate-400">Liquidates Yara seeds, fertilizer, and tractor credit.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Tier 3: Aggregator Commission</div>
            <div className="text-2xl font-extrabold text-white font-mono">GH₵ 490,000</div>
            <p className="text-xs text-slate-400">5% aggregation fee to local partner hub.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Tier 4: Farmer Net Profit</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">GH₵ 2,010,000</div>
            <p className="text-xs text-slate-400">Net payout transferred directly to Mobile Money.</p>
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Seasonal Settlement Waterfall Ledger</h3>
          <span className="text-xs text-slate-400">MTN MoMo & Telecel Settlement Status</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Crop Cycle</th>
                <th className="p-4">Gross Revenue (GHS)</th>
                <th className="p-4">Investor Payout</th>
                <th className="p-4">Input Recovery</th>
                <th className="p-4">Aggregator Fee</th>
                <th className="p-4">Farmer Net Payout</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockSettlements.map((stl) => (
                <tr key={stl.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white">{stl.cycleName}</td>
                  <td className="p-4 font-mono font-bold text-white">GH₵ {stl.grossRevenueGHS.toLocaleString()}</td>
                  <td className="p-4 font-mono text-amber-400 text-xs">GH₵ {stl.investorPayoutGHS.toLocaleString()}</td>
                  <td className="p-4 font-mono text-sky-400 text-xs">GH₵ {stl.inputRecoveryGHS.toLocaleString()}</td>
                  <td className="p-4 font-mono text-indigo-400 text-xs">GH₵ {stl.aggregatorCommissionGHS.toLocaleString()}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">GH₵ {stl.farmerNetProfitGHS.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" />
                      {stl.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
