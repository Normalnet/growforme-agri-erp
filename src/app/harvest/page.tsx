'use client';

import React, { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { Wheat, Plus, ShieldCheck, X, Scale } from 'lucide-react';

export default function HarvestModule() {
  const { harvestBatches, farmers, logHarvestBatch } = useAppState();
  const [showModal, setShowModal] = useState(false);

  // Form State in Metric Tonnes (MT)
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');
  const [crop, setCrop] = useState('Yellow Maize');
  const [actualYieldMT, setActualYieldMT] = useState('25.0');
  const [expectedYieldMT, setExpectedYieldMT] = useState('24.0');
  const [moistureContentPct, setMoistureContentPct] = useState('12.5');
  const [qualityGrade, setQualityGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const farmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];
    const actualMT = Number(actualYieldMT) || 25.0;
    const expMT = Number(expectedYieldMT) || 24.0;

    logHarvestBatch({
      farmerId: farmer.id,
      farmerName: farmer.fullName,
      crop,
      actualYieldMT: actualMT,
      expectedYieldMT: expMT,
      actualYieldKg: Math.round(actualMT * 1000),
      expectedYieldKg: Math.round(expMT * 1000),
      moistureContentPct: Number(moistureContentPct),
      qualityGrade,
    });
    setShowModal(false);
  };

  const totalHarvestMT = harvestBatches.reduce(
    (acc, b) => acc + (b.actualYieldMT || (b.actualYieldKg ? b.actualYieldKg / 1000 : 0)),
    0
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Wheat className="w-4 h-4" />
            Module 07 / Farm Gate Yield & Quality Control
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Harvest & Batch Grading (MT Standard)</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Log farm-gate weighing in Metric Tonnes (MT), moisture content %, aflatoxin testing, and EUDR compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Total Intake: <strong className="font-mono text-white text-sm">{totalHarvestMT.toFixed(1)} MT</strong></span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-amber-950/40 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Intake Receipt</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {harvestBatches.map((batch) => {
          const yieldMT = batch.actualYieldMT || (batch.actualYieldKg ? batch.actualYieldKg / 1000 : 0);
          return (
            <div key={batch.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400">{batch.batchNo}</span>
                  <h3 className="text-xl font-extrabold text-white mt-1">{batch.farmerName}</h3>
                  <div className="text-xs text-slate-400">Crop: {batch.crop}</div>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
                  {batch.qualityGrade}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                <div>
                  <div className="text-slate-400">Actual Weight</div>
                  <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">
                    {yieldMT.toFixed(2)} MT
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    ({(yieldMT * 1000).toLocaleString()} KG)
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Moisture Content</div>
                  <div className="font-mono font-bold text-slate-200 text-sm mt-0.5">{batch.moistureContentPct}%</div>
                </div>
                <div>
                  <div className="text-slate-400">Aflatoxin (ppb)</div>
                  <div className="font-mono font-bold text-teal-400 text-sm mt-0.5">{batch.aflatoxinPpb} ppb</div>
                </div>
                <div>
                  <div className="text-slate-400">Foreign Matter</div>
                  <div className="font-mono font-bold text-slate-200 text-sm mt-0.5">{batch.foreignMatterPct}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>EUDR Deforestation Verified</span>
                </div>
                <div className="text-slate-400 font-mono">WHR: {batch.warehouseReceiptNo}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">Log Farm Gate Harvest (MT Standard)</h3>
                <p className="text-xs text-slate-400">Record intake weighing and quality verification in Metric Tonnes.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <SearchableSelect
                  label="Select Outgrower Farmer"
                  options={farmers.map((f) => ({
                    value: f.id,
                    label: f.fullName,
                    subtext: `${f.community}, ${f.region}`,
                    badge: `${f.totalAcreage} Ac`,
                  }))}
                  value={selectedFarmerId}
                  onChange={setSelectedFarmerId}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Crop</label>
                  <input
                    type="text"
                    required
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <SearchableSelect
                    label="Quality Grade"
                    options={[
                      { value: 'Grade A', label: 'Grade A', badge: 'Premium' },
                      { value: 'Grade B', label: 'Grade B', badge: 'Standard' },
                      { value: 'Grade C', label: 'Grade C', badge: 'Industrial' },
                    ]}
                    value={qualityGrade}
                    onChange={(v: any) => setQualityGrade(v)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Actual Weight (Metric Tonnes / MT) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={actualYieldMT}
                    onChange={(e) => setActualYieldMT(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none font-mono focus:border-amber-500"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    = {(Number(actualYieldMT || 0) * 1000).toLocaleString()} KG ({(Number(actualYieldMT || 0) * 20).toFixed(0)} bags @ 50kg)
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Moisture Content (%)</label>
                  <input
                    type="text"
                    required
                    value={moistureContentPct}
                    onChange={(e) => setMoistureContentPct(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none font-mono focus:border-amber-500"
                  />
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
                  className="px-5 py-2 text-xs font-bold bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 transition"
                >
                  Generate Warehouse Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
