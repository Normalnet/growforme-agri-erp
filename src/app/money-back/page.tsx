'use client';

import React, { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { FarmerSettlementItem } from '@/types/schema';
import {
  DollarSign,
  CheckCircle2,
  Layers,
  Send,
  X,
  TrendingUp,
  AlertCircle,
  FileCheck2,
  Lock,
  Smartphone,
  Info,
  Scale,
} from 'lucide-react';

export default function MoneyBackModule() {
  const {
    settlements,
    cycles,
    tradeOrders,
    farmers,
    disbursements,
    mechanizationLogs,
    retrievals,
    executeWaterfallSettlement,
    executeFarmerSettlementPayout,
  } = useAppState();

  const [showModal, setShowModal] = useState(false);
  const [selectedCycleName, setSelectedCycleName] = useState(cycles[0]?.name || 'Northern Maize & Soy Outgrower 2026');
  const [revenueSourceType, setRevenueSourceType] = useState<'realized' | 'contracted' | 'custom'>('realized');
  const [customRevenue, setCustomRevenue] = useState('');
  const [selectedSettlementForDetails, setSelectedSettlementForDetails] = useState<string | null>(null);

  // Derive Trade Orders linked to the selected cycle
  const linkedTradeOrders = tradeOrders.filter(
    (t) => t.cycleName === selectedCycleName || !t.cycleName || t.cycleName.toLowerCase().includes(selectedCycleName.toLowerCase())
  );

  const realizedTradeRevenue = linkedTradeOrders.reduce((acc, t) => acc + (t.amountPaidGHS || 0), 0);
  const contractedTradeRevenue = linkedTradeOrders.reduce((acc, t) => acc + t.totalValueGHS, 0);

  const activeGrossRevenue =
    revenueSourceType === 'realized'
      ? realizedTradeRevenue || contractedTradeRevenue || 2860000
      : revenueSourceType === 'contracted'
      ? contractedTradeRevenue || 2860000
      : Number(customRevenue) || 0;

  // Compute individual farmer dues based on what has been spent on the farmer vs what was gotten from the farmer
  const computedFarmerDues: FarmerSettlementItem[] = farmers.map((farmer) => {
    // 1. What we have spent on the farmer
    const farmerDisbursements = disbursements.filter(
      (d) => d.farmerId === farmer.id || d.farmerName === farmer.fullName
    );
    const inputCost = farmerDisbursements.reduce((acc, d) => acc + d.totalCostGHS, 0);

    const farmerMechLogs = mechanizationLogs.filter(
      (m) => m.farmerName === farmer.fullName
    );
    const mechCost = farmerMechLogs.reduce((acc, m) => acc + (m.costGHS || m.acresCovered * 200), 0);

    const totalSpent = inputCost + mechCost;

    // 2. What was gotten from the farmer
    const farmerRetrievals = retrievals.filter(
      (r) => r.farmerId === farmer.id || r.farmerName === farmer.fullName
    );
    const harvestValue = farmerRetrievals.reduce((acc, r) => acc + r.retrievedValueGHS, 0);
    const harvestWeight = farmerRetrievals.reduce(
      (acc, r) => acc + (r.grossWeightMT || (r.grossWeightKg ? r.grossWeightKg / 1000 : r.bagsRetrieved * 0.05)),
      0
    );

    // 3. Profit or loss made
    const netProfitOrLoss = harvestValue - totalSpent;
    const farmerDue = netProfitOrLoss > 0 ? netProfitOrLoss : 0;

    return {
      farmerId: farmer.id,
      farmerName: farmer.fullName,
      momoNumber: farmer.momoNumber,
      momoNetwork: farmer.momoNetwork,
      totalSpentGHS: totalSpent,
      inputCostGHS: inputCost,
      mechanizationCostGHS: mechCost,
      harvestRetrievedValueGHS: harvestValue,
      harvestWeightMT: harvestWeight,
      netProfitOrLossGHS: netProfitOrLoss,
      farmerDueGHS: farmerDue,
      status: 'Pending Execution',
    };
  });

  const totalFarmerDuesSum = computedFarmerDues.reduce((acc, f) => acc + f.farmerDueGHS, 0);

  const handleComputeWaterfall = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceIds = linkedTradeOrders.map((t) => t.id);
    executeWaterfallSettlement(selectedCycleName, activeGrossRevenue, computedFarmerDues, sourceIds);
    setShowModal(false);
  };

  const handleExecutePayout = (settlementId: string) => {
    executeFarmerSettlementPayout(settlementId);
  };

  const latestSettlement = settlements[0];
  const activeSettlementDisplay = selectedSettlementForDetails
    ? settlements.find((s) => s.id === selectedSettlementForDetails) || latestSettlement
    : latestSettlement;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <DollarSign className="w-4 h-4" />
            Module 10 / Revenue Waterfall & Farmer Dues Settlement
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Money Back & Executed Farmer Dues</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Gross Harvest Revenue derived directly from Trade Agreements. Computes exact farmer dues (Spent vs Gotten) prior to execution.
          </p>
        </div>

        <button
          onClick={() => {
            setCustomRevenue(activeGrossRevenue.toString());
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/40 text-sm"
        >
          <Send className="w-4 h-4" />
          <span>Compute Seasonal Waterfall</span>
        </button>
      </div>

      {/* 4-Tier Waterfall Visualization Cards */}
      <div className="space-y-4 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Waterfall Distribution for: <span className="text-emerald-400">{activeSettlementDisplay?.cycleName || 'Current Cycle'}</span>
          </h3>
          <span className="text-xs text-slate-400">
            Gross Revenue:{' '}
            <strong className="text-white font-mono">
              GH₵ {activeSettlementDisplay ? activeSettlementDisplay.grossRevenueGHS.toLocaleString() : '0'}
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Tier 1: Investor Principal + ROI (60%)
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              GH₵ {activeSettlementDisplay ? activeSettlementDisplay.investorPayoutGHS.toLocaleString() : '0'}
            </div>
            <p className="text-xs text-slate-400">Escrow return to campaign sponsors.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Tier 2: Input Recovery (15%)
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              GH₵ {activeSettlementDisplay ? activeSettlementDisplay.inputRecoveryGHS.toLocaleString() : '0'}
            </div>
            <p className="text-xs text-slate-400">Liquidates agro-dealer input credit.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Tier 3: Aggregator Commission (5%)
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              GH₵ {activeSettlementDisplay ? activeSettlementDisplay.aggregatorCommissionGHS.toLocaleString() : '0'}
            </div>
            <p className="text-xs text-slate-400">Aggregation hub handling fee.</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2 bg-emerald-500/5 border-emerald-500/30">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Tier 4: Farmer Net Profit (20%)
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              GH₵ {activeSettlementDisplay ? activeSettlementDisplay.farmerNetProfitGHS.toLocaleString() : '0'}
            </div>
            <p className="text-xs text-slate-400">Calculated per farmer dues ledger.</p>
          </div>
        </div>
      </div>

      {/* Farmer Dues & Settlement Breakdown Ledger */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Outgrower Farmer Dues & Profit/Loss Ledger</h3>
            </div>
            <span className="text-xs text-slate-400">
              Shows exact amounts spent on each farmer (Inputs + Mech) vs retrieved harvest value, calculating net profit/loss and due payout.
            </span>
          </div>

          {activeSettlementDisplay && (
            <div className="flex items-center gap-2">
              {activeSettlementDisplay.status === 'Settlement Executed' ? (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  MoMo Payouts Executed & Settled
                </span>
              ) : (
                <button
                  onClick={() => handleExecutePayout(activeSettlementDisplay.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-emerald-950/40 flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize & Execute MoMo Payouts</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Outgrower Farmer</th>
                <th className="p-4">Mobile Money</th>
                <th className="p-4">What Was Spent (Inputs + Mech)</th>
                <th className="p-4">What Was Gotten (Harvest)</th>
                <th className="p-4">Profit / Loss</th>
                <th className="p-4">Farmer Due (Net Payout)</th>
                <th className="p-4">Execution Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(activeSettlementDisplay?.farmerDuesList && activeSettlementDisplay.farmerDuesList.length > 0
                ? activeSettlementDisplay.farmerDuesList
                : computedFarmerDues
              ).map((due) => (
                <tr key={due.farmerId} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white">
                    <div>{due.farmerName}</div>
                  </td>
                  <td className="p-4 text-xs font-mono">
                    <div className="text-emerald-400 font-semibold">{due.momoNumber}</div>
                    <div className="text-slate-400 text-[10px]">{due.momoNetwork}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono font-bold text-rose-400 text-xs">
                      GH₵ {due.totalSpentGHS.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Inputs: GH₵ {due.inputCostGHS.toLocaleString()} | Mech: GH₵ {due.mechanizationCostGHS.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono font-bold text-emerald-400 text-xs">
                      GH₵ {due.harvestRetrievedValueGHS.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {due.harvestWeightMT.toFixed(2)} MT Retrieved
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-xs">
                    <span className={due.netProfitOrLossGHS >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {due.netProfitOrLossGHS >= 0
                        ? `+GH₵ ${due.netProfitOrLossGHS.toLocaleString()} (Profit)`
                        : `-GH₵ ${Math.abs(due.netProfitOrLossGHS).toLocaleString()} (Loss)`}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-mono font-extrabold text-white text-sm bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 w-max">
                      GH₵ {due.farmerDueGHS.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        due.status === 'MoMo Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : due.status === 'Loss Recorded'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {due.status === 'MoMo Paid' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : due.status === 'Loss Recorded' ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                      {due.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlements History Ledger */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Historical Settlement Batches</h3>
          <span className="text-xs text-slate-400">{settlements.length} Recorded Batches</span>
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
                <th className="p-4">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {settlements.map((stl) => (
                <tr
                  key={stl.id}
                  onClick={() => setSelectedSettlementForDetails(stl.id)}
                  className={`cursor-pointer transition ${
                    activeSettlementDisplay?.id === stl.id ? 'bg-emerald-500/10' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="p-4 font-bold text-white">
                    <div>{stl.cycleName}</div>
                    <div className="text-[11px] text-slate-400">{stl.settlementDate}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">GH₵ {stl.grossRevenueGHS.toLocaleString()}</td>
                  <td className="p-4 font-mono text-amber-400 text-xs">GH₵ {stl.investorPayoutGHS.toLocaleString()}</td>
                  <td className="p-4 font-mono text-sky-400 text-xs">GH₵ {stl.inputRecoveryGHS.toLocaleString()}</td>
                  <td className="p-4 font-mono text-indigo-400 text-xs">GH₵ {stl.aggregatorCommissionGHS.toLocaleString()}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">GH₵ {stl.farmerNetProfitGHS.toLocaleString()}</td>
                  <td className="p-4">
                    {stl.status === 'Settlement Executed' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        Executed
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExecutePayout(stl.id);
                        }}
                        className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs px-2.5 py-1 rounded-full border border-amber-500/30 font-semibold flex items-center gap-1 w-max"
                      >
                        <Lock className="w-3 h-3" />
                        Authorize MoMo
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compute Waterfall Modal linked to Trade Agreements */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-2xl p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">Compute Revenue Waterfall from Trade Agreements</h3>
                <p className="text-xs text-slate-400">
                  Gross revenue is pulled directly from off-taker contracts without separate guesswork.
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleComputeWaterfall} className="space-y-4 text-xs">
              <div>
                <SearchableSelect
                  label="Select Crop Cycle"
                  options={cycles.map((c) => ({
                    value: c.name,
                    label: c.name,
                    subtext: `${c.crop} • ${c.region}`,
                  }))}
                  value={selectedCycleName}
                  onChange={setSelectedCycleName}
                />
              </div>

              {/* Linked Trade Agreements Summary */}
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase text-xs flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-blue-400" />
                    Linked Trade Agreements ({linkedTradeOrders.length})
                  </span>
                  <span className="text-slate-400 text-[11px]">Auto-derived Revenue</span>
                </div>

                <div className="space-y-1.5">
                  {linkedTradeOrders.map((t) => (
                    <div
                      key={t.id}
                      className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[11px]"
                    >
                      <div>
                        <span className="font-bold text-slate-200">{t.offtakerName}</span>
                        <span className="text-slate-400 ml-2">({t.contractNo} • {t.quantityMT} MT)</span>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-emerald-400 font-bold">
                          GH₵ {(t.amountPaidGHS || 0).toLocaleString()} Paid
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Total: GH₵ {t.totalValueGHS.toLocaleString()} ({t.paymentStatus || 'Pending'})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Source Selector */}
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1">Gross Revenue Basis</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRevenueSourceType('realized')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      revenueSourceType === 'realized'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">Realized Cash Received</div>
                    <div className="font-mono text-emerald-400 text-[11px] mt-0.5">
                      GH₵ {realizedTradeRevenue.toLocaleString()}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRevenueSourceType('contracted')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      revenueSourceType === 'contracted'
                        ? 'bg-blue-500/15 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">Total Contract Value</div>
                    <div className="font-mono text-blue-400 text-[11px] mt-0.5">
                      GH₵ {contractedTradeRevenue.toLocaleString()}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRevenueSourceType('custom')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      revenueSourceType === 'custom'
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">Custom Override</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Enter Value</div>
                  </button>
                </div>
              </div>

              {revenueSourceType === 'custom' && (
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Custom Gross Revenue (GHS)</label>
                  <input
                    type="number"
                    value={customRevenue}
                    onChange={(e) => setCustomRevenue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Waterfall Split Breakdown Preview */}
              <div className="p-4 bg-slate-900 rounded-xl space-y-2 text-xs border border-slate-800">
                <div className="font-bold text-slate-200">Waterfall Split Breakdown Preview:</div>
                <div className="flex justify-between text-amber-400">
                  <span>Tier 1 Investors (60%):</span>
                  <span className="font-mono font-bold">GH₵ {(activeGrossRevenue * 0.6).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sky-400">
                  <span>Tier 2 Inputs Recovery (15%):</span>
                  <span className="font-mono font-bold">GH₵ {(activeGrossRevenue * 0.15).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-indigo-400">
                  <span>Tier 3 Aggregator Commission (5%):</span>
                  <span className="font-mono font-bold">GH₵ {(activeGrossRevenue * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1.5">
                  <span>Tier 4 Outgrower Net MoMo Pool (20%):</span>
                  <span className="font-mono font-bold">GH₵ {(activeGrossRevenue * 0.2).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>
                  Note: Payouts are computed here in draft status. Mobile Money payments will NOT be executed automatically until explicitly authorized in the ledger.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition"
                >
                  Save Waterfall Computation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
