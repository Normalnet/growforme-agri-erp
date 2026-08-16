'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { RotateCcw, Plus, X } from 'lucide-react';

export default function RetrievalModule() {
  const { retrievals, farmers, createWaybillRetrieval } = useAppState();
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');
  const [commodity, setCommodity] = useState('Yellow Maize (50kg Bags)');
  const [bagsRetrieved, setBagsRetrieved] = useState('100');
  const [retrievedValueGHS, setRetrievedValueGHS] = useState('15000');
  const [driverName, setDriverName] = useState('Kofi Mensah (10-Ton Truck)');
  const [vehicleRegNo, setVehicleRegNo] = useState('NR 4022-25');
  const [destinationDepot, setDestinationDepot] = useState('Tamale GCX Depot');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bags = Number(bagsRetrieved);
    const val = Number(retrievedValueGHS);
    createWaybillRetrieval(
      { commodity, driverName, vehicleRegNo, destinationDepot },
      selectedFarmerId,
      bags,
      val
    );
    setShowModal(false);
  };

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

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-purple-950/40 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Waybill</span>
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Aggregation Recovery Ledger</h3>
          <span className="text-xs text-slate-400">{retrievals.length} Waybills</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Waybill No</th>
                <th className="p-4">Farmer & Cluster</th>
                <th className="p-4">Commodity</th>
                <th className="p-4">Bags (50kg)</th>
                <th className="p-4">Retrieved Value</th>
                <th className="p-4">Loan Debt Offset</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {retrievals.map((ret) => (
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
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {ret.status}
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
              <h3 className="font-extrabold text-white text-lg">Generate Waybill & Offset Debt</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Farmer / Cluster</label>
                <select
                  value={selectedFarmerId}
                  onChange={(e) => setSelectedFarmerId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                >
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.fullName} (Active Debt: GH₵ {f.totalLoansInKindGHS})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Retrieved Bags</label>
                  <input
                    type="number"
                    required
                    value={bagsRetrieved}
                    onChange={(e) => setBagsRetrieved(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Retrieved Value (GHS)</label>
                  <input
                    type="number"
                    required
                    value={retrievedValueGHS}
                    onChange={(e) => setRetrievedValueGHS(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Driver Name & Vehicle</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Destination Depot</label>
                  <input
                    type="text"
                    required
                    value={destinationDepot}
                    onChange={(e) => setDestinationDepot(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl text-xs text-emerald-400 border border-slate-800">
                Generating this waybill automatically liquidates <strong>GH₵ {retrievedValueGHS}</strong> from the farmer's outstanding debt balance!
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-purple-500 text-slate-950 rounded-xl hover:bg-purple-400">
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
