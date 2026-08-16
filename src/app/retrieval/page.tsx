'use client';

import DashboardLayout from '../layout-wrapper';
import { mockCommodityRetrievals } from '@/lib/mock-data';
import { RotateCcw, Plus, Truck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RetrievalModule() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <RotateCcw className="w-4 h-4" />
            Module 08 / In-Kind Loan Recovery & Logistics
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Commodity Retrieval & Waybill Dispatch</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Automate in-kind debt deductions from harvested crop bags and track haulage waybills to regional depots.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-purple-950/40 text-sm">
          <Plus className="w-4 h-4" />
          <span>Generate Waybill</span>
        </button>
      </div>

      {/* Retrieval Waybills Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Aggregation Recovery Ledger</h3>
          <span className="text-xs text-slate-400">Farmer Bag Offsets vs In-Kind Debt</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Waybill No</th>
                <th className="p-4">Farmer / Cluster</th>
                <th className="p-4">Retrieved Commodity</th>
                <th className="p-4">Bags (50kg)</th>
                <th className="p-4">Retrieved Value (GHS)</th>
                <th className="p-4">Loan Offset (GHS)</th>
                <th className="p-4">Hauler / Vehicle</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockCommodityRetrievals.map((ret) => (
                <tr key={ret.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-purple-400">{ret.waybillNo}</td>
                  <td className="p-4 font-bold text-white">
                    <div>{ret.farmerName}</div>
                    <div className="text-xs text-slate-400">{ret.cooperativeCluster}</div>
                  </td>
                  <td className="p-4 text-slate-200">{ret.commodity}</td>
                  <td className="p-4 font-mono font-bold text-white">{ret.bagsRetrieved} Bags</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">GH₵ {ret.retrievedValueGHS.toLocaleString()}</td>
                  <td className="p-4 font-mono font-bold text-rose-400">GH₵ {ret.inKindDebtGHS.toLocaleString()}</td>
                  <td className="p-4 text-xs text-slate-300">
                    <div>{ret.driverName}</div>
                    <div className="font-mono text-slate-400">{ret.vehicleRegNo}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        ret.status === 'Received at Depot'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {ret.status}
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
