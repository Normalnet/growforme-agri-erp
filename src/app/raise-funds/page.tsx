'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { FundingCampaign } from '@/types/schema';
import {
  TrendingUp,
  Plus,
  Award,
  X,
  Wallet,
  Users,
  ShieldCheck,
  CheckCircle2,
  Percent,
  Trash2,
} from 'lucide-react';

export default function RaiseFundsModule() {
  const { campaigns, investments, cycles, addInvestment, addFundingCampaign, deleteEntity } = useAppState();

  // Modals
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<FundingCampaign | null>(null);

  // Sponsor Form State
  const [investorName, setInvestorName] = useState('');
  const [investorType, setInvestorType] = useState<'Retail' | 'Institutional'>('Retail');
  const [amountGHS, setAmountGHS] = useState('5000');

  // Create Campaign Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCycleId, setNewCycleId] = useState(cycles[0]?.id || '');
  const [newCrop, setNewCrop] = useState('Maize');
  const [newTargetAmountGHS, setNewTargetAmountGHS] = useState('750000');
  const [newExpectedROI, setNewExpectedROI] = useState('18.5');
  const [newMinInvestmentGHS, setNewMinInvestmentGHS] = useState('1000');
  const [newDaysRemaining, setNewDaysRemaining] = useState('45');

  const openSponsorModal = (campaign: FundingCampaign) => {
    setSelectedCampaign(campaign);
    setAmountGHS(campaign.minInvestmentGHS.toString());
    setShowSponsorModal(true);
  };

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;
    addInvestment({
      campaignId: selectedCampaign.id,
      investorName,
      investorType,
      amountGHS: Number(amountGHS),
    });
    setShowSponsorModal(false);
    setInvestorName('');
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFundingCampaign({
      title: newTitle || `${newCrop} Expansion Escrow Fund`,
      cycleId: newCycleId,
      crop: newCrop,
      targetAmountGHS: Number(newTargetAmountGHS) || 500000,
      expectedROI: Number(newExpectedROI) || 18,
      minInvestmentGHS: Number(newMinInvestmentGHS) || 1000,
      daysRemaining: Number(newDaysRemaining) || 30,
    });
    setShowCreateModal(false);
    setNewTitle('');
  };

  // Aggregated KPIs
  const totalTargetCapital = campaigns.reduce((acc, curr) => acc + curr.targetAmountGHS, 0);
  const totalRaisedCapital = campaigns.reduce((acc, curr) => acc + curr.raisedAmountGHS, 0);
  const totalInvestorsCount = investments.length;
  const averageROI =
    campaigns.length > 0
      ? (campaigns.reduce((acc, curr) => acc + curr.expectedROI, 0) / campaigns.length).toFixed(1)
      : '18.0';

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
            Structure agricultural crowd-funding campaigns, set dynamic ROI mechanisms, and track investor commitments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-teal-950/40 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Financial Escrow KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Target Capital Pool</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              GH₵ {totalTargetCapital.toLocaleString()}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Raised in Escrow</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              GH₵ {totalRaisedCapital.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">
              {totalTargetCapital > 0 ? ((totalRaisedCapital / totalTargetCapital) * 100).toFixed(1) : 0}% Subscribed
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Average Investor ROI</span>
            <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">{averageROI}%</div>
            <span className="text-[11px] text-slate-400">Contractual Yield</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Sponsors</span>
            <div className="text-2xl font-extrabold text-sky-400 font-mono mt-1">{totalInvestorsCount} Investors</div>
            <span className="text-[11px] text-slate-400">Retail & Institutional</span>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-4 mt-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Active Farm Cycle Campaigns</h3>
          <span className="text-xs text-slate-400">{campaigns.length} Open Escrow Pools</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((c) => {
            const progress = (c.raisedAmountGHS / (c.targetAmountGHS || 1)) * 100;
            return (
              <div
                key={c.id}
                className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {c.crop} Campaign
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {c.expectedROI}% ROI
                    </span>
                  </div>

                  <h4 className="text-lg font-extrabold text-white mt-3">{c.title}</h4>

                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Raised: GH₵ {c.raisedAmountGHS.toLocaleString()}</span>
                      <span className="text-white font-mono">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, progress)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-400 flex justify-between pt-1">
                      <span>Target: GH₵ {c.targetAmountGHS.toLocaleString()}</span>
                      <span>{c.totalInvestors} Sponsors</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Min. Entry:</span>
                    <strong className="text-slate-200">GH₵ {c.minInvestmentGHS.toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openSponsorModal(c)}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition text-xs"
                    >
                      Sponsor Cycle
                    </button>
                    <button
                      onClick={() => deleteEntity('campaign', c.id)}
                      title="Delete Campaign"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-white text-base">Investor Escrow Ledger</h3>
            <span className="text-xs text-slate-400">Direct Capital Commitments & Dynamic ROI Payout Forecasts</span>
          </div>
          <span className="text-xs text-teal-400 font-mono bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 font-bold">
            {investments.length} Active Commitments
          </span>
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
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {investments.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white">{inv.investorName}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {inv.investorType}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{inv.campaignTitle}</td>
                  <td className="p-4 font-mono font-bold text-white">GH₵ {inv.amountGHS.toLocaleString()}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">
                    GH₵ {inv.expectedReturnGHS.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold">
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteEntity('investment', inv.id)}
                      title="Delete Investment Record"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sponsor / Investment Modal */}
      {showSponsorModal && selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">Sponsor {selectedCampaign.title}</h3>
                <p className="text-xs text-teal-400 font-mono">
                  Fixed Escrow Contract • {selectedCampaign.expectedROI}% ROI
                </p>
              </div>
              <button onClick={() => setShowSponsorModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSponsorSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1">Sponsor / Investor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kofi Mensah / Africa Agri Ventures"
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Investor Classification</label>
                  <select
                    value={investorType}
                    onChange={(e: any) => setInvestorType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-teal-500"
                  >
                    <option value="Retail">Retail Investor</option>
                    <option value="Institutional">Institutional Fund</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Sponsorship Amount (GHS)</label>
                  <input
                    type="number"
                    required
                    min={selectedCampaign.minInvestmentGHS}
                    value={amountGHS}
                    onChange={(e) => setAmountGHS(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl text-xs text-amber-300 border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span>Contractual ROI Rate:</span>
                  <strong className="text-white">{selectedCampaign.expectedROI}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Gross Payout at Harvest Waterfall:</span>
                  <strong className="text-emerald-400 font-mono font-bold">
                    GH₵ {(Number(amountGHS || 0) * (1 + selectedCampaign.expectedROI / 100)).toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSponsorModal(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-teal-500 text-slate-950 rounded-xl hover:bg-teal-400 transition"
                >
                  Confirm & Fund Escrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">Create New Capital Campaign</h3>
                <p className="text-xs text-slate-400">Launch crowd-sponsorship with custom ROI return mechanism.</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nyankpala White Maize Growth Fund"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Target Crop</label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-teal-500"
                  >
                    <option value="Maize">Maize</option>
                    <option value="Soybeans">Soybeans</option>
                    <option value="Cashew">Cashew</option>
                    <option value="Rice">Rice</option>
                    <option value="Sorghum">Sorghum</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Linked Season Cycle</label>
                  <select
                    value={newCycleId}
                    onChange={(e) => setNewCycleId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-teal-500"
                  >
                    {cycles.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.region})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Target Escrow Pool (GHS)</label>
                  <input
                    type="number"
                    required
                    value={newTargetAmountGHS}
                    onChange={(e) => setNewTargetAmountGHS(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Expected Investor ROI (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newExpectedROI}
                    onChange={(e) => setNewExpectedROI(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Min. Entry Ticket (GHS)</label>
                  <input
                    type="number"
                    required
                    value={newMinInvestmentGHS}
                    onChange={(e) => setNewMinInvestmentGHS(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Days Remaining</label>
                  <input
                    type="number"
                    required
                    value={newDaysRemaining}
                    onChange={(e) => setNewDaysRemaining(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-teal-500 text-slate-950 rounded-xl hover:bg-teal-400 transition"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

