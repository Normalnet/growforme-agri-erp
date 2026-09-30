'use client';

import React, { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import {
  RotateCcw,
  Plus,
  X,
  Scale,
  TrendingUp,
  Award,
  DollarSign,
  Truck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function RetrievalModule() {
  const { retrievals, farmers, createWaybillRetrieval } = useAppState();
  const [showModal, setShowModal] = useState(false);

  // Form State in Metric Tonnes (MT)
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');
  const [commodity, setCommodity] = useState('Yellow Maize (50kg Bags)');
  const [weightMT, setWeightMT] = useState('6.0');
  const [bagsRetrieved, setBagsRetrieved] = useState('120');
  const [retrievedValueGHS, setRetrievedValueGHS] = useState('18000');
  const [driverName, setDriverName] = useState('Kofi Mensah (10-Ton Truck)');
  const [vehicleRegNo, setVehicleRegNo] = useState('NR 4022-25');
  const [destinationDepot, setDestinationDepot] = useState('Tamale GCX Depot');

  const activeFarmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];

  const handleWeightMTChange = (valMT: string) => {
    setWeightMT(valMT);
    const numMT = Number(valMT) || 0;
    const computedBags = Math.round((numMT * 1000) / 50);
    setBagsRetrieved(computedBags.toString());
    // Auto-calculate market retrieval value @ ~GH₵ 3,000 / MT
    setRetrievedValueGHS((numMT * 3000).toString());
  };

  const handleBagsChange = (bags: string) => {
    setBagsRetrieved(bags);
    const numBags = Number(bags) || 0;
    const computedMT = (numBags * 50) / 1000;
    setWeightMT(computedMT.toString());
    setRetrievedValueGHS((computedMT * 3000).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bags = Number(bagsRetrieved);
    const val = Number(retrievedValueGHS);
    const wMT = Number(weightMT) || (bags * 50) / 1000;

    createWaybillRetrieval(
      {
        commodity,
        driverName,
        vehicleRegNo,
        destinationDepot,
        grossWeightMT: wMT,
        grossWeightKg: Math.round(wMT * 1000),
      },
      selectedFarmerId,
      bags,
      val,
      wMT
    );
    setShowModal(false);
  };

  // Farmer Profitability Analytics
  const farmerProfitabilityData = farmers.map((farmer) => {
    const farmerRetrievals = retrievals.filter(
      (r) => r.farmerId === farmer.id || r.farmerName === farmer.fullName
    );
    const totalRetrievedValue = farmerRetrievals.reduce((acc, r) => acc + r.retrievedValueGHS, 0);
    const totalRetrievedWeightMT = farmerRetrievals.reduce(
      (acc, r) => acc + (r.grossWeightMT || (r.grossWeightKg ? r.grossWeightKg / 1000 : r.bagsRetrieved * 0.05)),
      0
    );
    const totalDebt = farmer.totalLoansInKindGHS;
    const netSurplus = totalRetrievedValue - totalDebt;
    const recoveryRatePct = totalDebt > 0 ? (totalRetrievedValue / totalDebt) * 100 : 100;

    let profitabilityStatus: 'Highly Profitable' | 'Profitable' | 'Break-Even' | 'Under-Recovered' = 'Under-Recovered';
    if (totalRetrievedValue >= totalDebt * 1.5 && totalRetrievedValue > 0) {
      profitabilityStatus = 'Highly Profitable';
    } else if (totalRetrievedValue > totalDebt) {
      profitabilityStatus = 'Profitable';
    } else if (totalRetrievedValue === totalDebt && totalDebt > 0) {
      profitabilityStatus = 'Break-Even';
    }

    return {
      farmer,
      totalRetrievedValue,
      totalRetrievedWeightMT,
      totalDebt,
      netSurplus,
      recoveryRatePct,
      profitabilityStatus,
      retrievalCount: farmerRetrievals.length,
    };
  });

  const totalValueAllRetrievals = retrievals.reduce((acc, r) => acc + r.retrievedValueGHS, 0);
  const totalWeightAllRetrievalsMT = retrievals.reduce(
    (acc, r) => acc + (r.grossWeightMT || (r.grossWeightKg ? r.grossWeightKg / 1000 : r.bagsRetrieved * 0.05)),
    0
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <RotateCcw className="w-4 h-4" />
            Module 08 / In-Kind Loan Recovery & Logistics
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Commodity Retrieval & Farmer Profitability</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Track haulage waybills (MT), determine profitable farmers based on retrieved commodity value vs in-kind loans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-purple-950/40 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Retrieval Waybill</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Commodity Retrieved</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              {totalWeightAllRetrievalsMT.toFixed(1)} MT
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              ({(totalWeightAllRetrievalsMT * 1000).toLocaleString()} KG)
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Retrieved Value</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              GH₵ {totalValueAllRetrievals.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-500 mt-0.5">Liquidates In-Kind Outgrower Credit</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Profitable Outgrowers</span>
            <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
              {farmerProfitabilityData.filter((f) => f.totalRetrievedValue > f.totalDebt).length} / {farmers.length} Farmers
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Exceeding In-Kind Input & Mech Debts</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Farmer Profitability Scorecard & Leaderboard */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Farmer Profitability Analysis (Total Gotten vs Total In-Kind Debt)
            </h3>
            <span className="text-xs text-slate-400">
              Evaluates outgrower profitability by comparing gross retrieved harvest value against all inputs and mechanization debt.
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-bold self-start sm:self-auto">
            Live Settlement Readiness
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Outgrower Farmer</th>
                <th className="p-4">Cluster & Region</th>
                <th className="p-4">Retrieved Harvest (MT)</th>
                <th className="p-4">Total Value Gotten</th>
                <th className="p-4">Remaining Loan Debt</th>
                <th className="p-4">Net Farmer Surplus</th>
                <th className="p-4">Profitability Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {farmerProfitabilityData.map((fp) => (
                <tr key={fp.farmer.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white">
                    <div>{fp.farmer.fullName}</div>
                    <div className="text-xs text-slate-400 font-mono font-normal">{fp.farmer.ghanaCardNo}</div>
                  </td>
                  <td className="p-4 text-xs text-slate-300">
                    <div>{fp.farmer.cooperativeCluster}</div>
                    <div className="text-slate-400">{fp.farmer.region} Region</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {fp.totalRetrievedWeightMT.toFixed(2)} MT
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-400">
                    GH₵ {fp.totalRetrievedValue.toLocaleString()}
                  </td>
                  <td className="p-4 font-mono text-rose-400 text-xs">
                    GH₵ {fp.totalDebt.toLocaleString()}
                  </td>
                  <td className="p-4 font-mono font-bold">
                    <span className={fp.netSurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {fp.netSurplus >= 0 ? `+GH₵ ${fp.netSurplus.toLocaleString()}` : `-GH₵ ${Math.abs(fp.netSurplus).toLocaleString()}`}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        fp.profitabilityStatus === 'Highly Profitable'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : fp.profitabilityStatus === 'Profitable'
                          ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                          : fp.profitabilityStatus === 'Break-Even'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {fp.profitabilityStatus === 'Highly Profitable' || fp.profitabilityStatus === 'Profitable' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      {fp.profitabilityStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table of Waybill Logs */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Aggregation Recovery & Waybill Ledger</h3>
          <span className="text-xs text-slate-400">{retrievals.length} Waybills Recorded</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Waybill No</th>
                <th className="p-4">Farmer & Cluster</th>
                <th className="p-4">Commodity</th>
                <th className="p-4">Retrieved Weight (MT)</th>
                <th className="p-4">Retrieved Value</th>
                <th className="p-4">In-Kind Debt Offset</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {retrievals.map((ret) => {
                const wMT = ret.grossWeightMT || (ret.grossWeightKg ? ret.grossWeightKg / 1000 : ret.bagsRetrieved * 0.05);
                return (
                  <tr key={ret.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-purple-400">{ret.waybillNo}</td>
                    <td className="p-4 font-bold text-white">
                      <div>{ret.farmerName}</div>
                      <div className="text-xs text-slate-400">{ret.cooperativeCluster}</div>
                    </td>
                    <td className="p-4 text-slate-200">{ret.commodity}</td>
                    <td className="p-4">
                      <div className="font-mono font-bold text-white">{wMT.toFixed(2)} MT</div>
                      <div className="text-[11px] text-slate-400 font-mono">({ret.bagsRetrieved} Bags)</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      GH₵ {ret.retrievedValueGHS.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-rose-400 text-xs">
                      GH₵ {ret.inKindDebtGHS.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {ret.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">Generate Retrieval Waybill & Offset Debt</h3>
                <p className="text-xs text-slate-400">Log retrieved commodity in Metric Tonnes to compute farmer profitability.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <SearchableSelect
                  label="Select Farmer / Cluster"
                  options={farmers.map((f) => ({
                    value: f.id,
                    label: f.fullName,
                    subtext: `${f.community} • Active Debt: GH₵ ${f.totalLoansInKindGHS}`,
                    badge: `${f.totalAcreage} Ac`,
                  }))}
                  value={selectedFarmerId}
                  onChange={setSelectedFarmerId}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Weight (Metric Tonnes / MT) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weightMT}
                    onChange={(e) => handleWeightMTChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none font-mono focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Equivalent 50kg Bags
                  </label>
                  <input
                    type="number"
                    required
                    value={bagsRetrieved}
                    onChange={(e) => handleBagsChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none font-mono focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Retrieved Value (GH₵) *
                  </label>
                  <input
                    type="number"
                    required
                    value={retrievedValueGHS}
                    onChange={(e) => setRetrievedValueGHS(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none font-mono focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Destination Depot</label>
                  <input
                    type="text"
                    required
                    value={destinationDepot}
                    onChange={(e) => setDestinationDepot(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Driver Name & Vehicle</label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-purple-500"
                />
              </div>

              {/* Profitability Calculation Live Preview */}
              <div className="p-3 bg-slate-900 rounded-xl space-y-1.5 text-xs border border-slate-800">
                <div className="font-bold text-white">Farmer Profitability Impact Preview:</div>
                <div className="flex justify-between text-slate-300">
                  <span>Current Outstanding In-Kind Debt:</span>
                  <span className="font-mono text-rose-400">GH₵ {activeFarmer?.totalLoansInKindGHS.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Waybill Harvest Value Offset:</span>
                  <span className="font-mono text-emerald-400">+GH₵ {Number(retrievedValueGHS || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-800 pt-1">
                  <span>Resulting Net Surplus / Status:</span>
                  <span
                    className={
                      Number(retrievedValueGHS || 0) >= (activeFarmer?.totalLoansInKindGHS || 0)
                        ? 'text-emerald-400 font-mono'
                        : 'text-amber-400 font-mono'
                    }
                  >
                    {Number(retrievedValueGHS || 0) >= (activeFarmer?.totalLoansInKindGHS || 0)
                      ? `Profitable (+GH₵ ${(Number(retrievedValueGHS || 0) - (activeFarmer?.totalLoansInKindGHS || 0)).toLocaleString()})`
                      : `Under-Recovered (GH₵ ${((activeFarmer?.totalLoansInKindGHS || 0) - Number(retrievedValueGHS || 0)).toLocaleString()} debt remains)`}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-purple-500 text-slate-950 rounded-xl hover:bg-purple-400 transition"
                >
                  Generate Waybill & Offset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
