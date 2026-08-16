'use client';

import DashboardLayout from '../layout-wrapper';
import { mockCampaigns, mockInvestments } from '@/lib/mock-data';
import { TrendingUp, Plus, DollarSign, Users, Award, ShieldAlert } from 'lucide-react';

export default function RaiseFundsModule() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
            <TrendingUp className="w-4 h-4" />
            Module 03 / Crowd-Sponsorship & Capital
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Capital Raising & Escrow Pool</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Structure agricultural crowd-funding campaigns, track investor commitments, and calculate seasonal ROI returns.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-teal-950/40 text-sm">
          <Plus className="w-4 h-4" />
          <span>Launch Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white">Active Farm Cycle Campaigns</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockCampaigns.map((c) => {
            const progress = (c.raisedAmountGHS / c.targetAmountGHS) * 100;
            return (
              <div key={c.id} className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {c.crop} Campaign
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {c.expectedROI}% Target ROI
                    </span>
                  </div>

                  <h4 className="text-lg font-extrabold text-white mt-3">{c.title}</h4>

                  {/* Progress Bar */}
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Raised: GH₵ {c.raisedAmountGHS.toLocaleString()}</span>
                      <span className="text-white">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="text-xs text-slate-400 flex justify-between pt-1">
                      <span>Target: GH₵ {c.targetAmountGHS.toLocaleString()}</span>
                      <span>{c.totalInvestors} Sponsors</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Min. Entry: <strong className="text-slate-200">GH₵ {c.minInvestmentGHS.toLocaleString()}</strong></span>
                  <span className="font-bold text-teal-400 uppercase bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                    {c.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Investor Commitment Ledger */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Investor Escrow Ledger</h3>
          <span className="text-xs text-slate-400">Retail & Institutional Commitments</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Sponsor / Investor</th>
                <th className="p-4">Investor Type</th>
                <th className="p-4">Campaign Title</th>
                <th className="p-4">Commitment (GHS)</th>
                <th className="p-4">Expected Return (GHS)</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockInvestments.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white">{inv.investorName}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${inv.investorType === 'Institutional' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'}`}>
                      {inv.investorType}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{inv.campaignTitle}</td>
                  <td className="p-4 font-mono font-bold text-white">GH₵ {inv.amountGHS.toLocaleString()}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">GH₵ {inv.expectedReturnGHS.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold">
                      {inv.status}
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
