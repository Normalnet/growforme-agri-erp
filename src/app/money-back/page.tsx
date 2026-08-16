'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { DollarSign, CheckCircle2, Layers, Send, X } from 'lucide-react';

export default function MoneyBackModule() {
  const { settlements, cycles, executeWaterfallSettlement } = useAppState();
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [cycleName, setCycleName] = useState(cycles[0]?.name || 'Northern Maize Cycle');
  const [grossRevenue, setGrossRevenue] = useState('5000000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeWaterfallSettlement(cycleName, Number(grossRevenue));
    setShowModal(false);
  };

  const rev = Number(grossRevenue) || 0;

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

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/40 text-sm"
        >
          <Send className="w-4 h-4" />
          <span>Execute Revenue Waterfall</span>
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
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Tier 1: Investor Principal + ROI (60%)</div>
            <div className="text-2xl font-extrabold text-white font-mono">GH₵ {settlements[0] ? settlements[0].investorPayoutGHS.toLocaleString() : '6,100,000'}</div>
            <p className="text-xs text-slate-400">Escrow return to sponsors.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">Tier 2: Input Recovery (15%)</div>
            <div className="text-2xl font-extrabold text-white font-mono">GH₵ {settlements[0] ? settlements[0].inputRecoveryGHS.toLocaleString() : '1,200,000'}</div>
            <p className="text-xs text-slate-400">Liquidates input credit.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Tier 3: Aggregator Commission (5%)</div>
            <div className="text-2xl font-extrabold text-white font-mono">GH₵ {settlements[0] ? settlements[0].aggregatorCommissionGHS.toLocaleString() : '490,000'}</div>
            <p className="text-xs text-slate-400">Aggregation partner commission.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Tier 4: Farmer Net Profit (20%)</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">GH₵ {settlements[0] ? settlements[0].farmerNetProfitGHS.toLocaleString() : '2,010,000'}</div>
            <p className="text-xs text-slate-400">Bulk Mobile Money payout.</p>
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Seasonal Settlement Waterfall Ledger</h3>
          <span className="text-xs text-slate-400">MTN MoMo & Bank Status</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Crop Cycle</th>
                <th className="p-4">Gross Revenue</th>
                <th className="p-4">Investor Payout</th>
                <th className="p-4">Input Recovery</th>
                <th className="p-4">Aggregator Fee</th>
                <th className="p-4">Farmer Net Payout</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {settlements.map((stl) => (
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-lg">Execute Revenue Waterfall Payout</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Select Crop Cycle</label>
                <select
                  value={cycleName}
                  onChange={(e) => setCycleName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                >
                  {cycles.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Gross Harvest Revenue (GHS)</label>
                <input
                  type="number"
                  required
                  value={grossRevenue}
                  onChange={(e) => setGrossRevenue(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                />
              </div>

              <div className="p-4 bg-slate-900 rounded-xl space-y-2 text-xs border border-slate-800">
                <div className="font-bold text-slate-200">Waterfall Split Breakdown Preview:</div>
                <div className="flex justify-between text-amber-400">
                  <span>Tier 1 Investors (60%):</span>
                  <span className="font-mono font-bold">GH₵ {(rev * 0.60).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sky-400">
                  <span>Tier 2 Inputs (15%):</span>
                  <span className="font-mono font-bold">GH₵ {(rev * 0.15).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-indigo-400">
                  <span>Tier 3 Aggregator (5%):</span>
                  <span className="font-mono font-bold">GH₵ {(rev * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1">
                  <span>Tier 4 Farmers Net MoMo (20%):</span>
                  <span className="font-mono font-bold">GH₵ {(rev * 0.20).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400">
                  Disburse & Reconcile MoMo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
