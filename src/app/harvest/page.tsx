'use client';

import DashboardLayout from '../layout-wrapper';
import { mockHarvestBatches } from '@/lib/mock-data';
import { Wheat, Plus, ShieldCheck, CheckCircle2, Award, FileText } from 'lucide-react';

export default function HarvestModule() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Wheat className="w-4 h-4" />
            Module 07 / Farm Gate Yield & Quality Control
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Harvest & Batch Grading</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Log farm-gate weighing, moisture content %, aflatoxin testing, and EUDR deforestation compliance.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-amber-950/40 text-sm">
          <Plus className="w-4 h-4" />
          <span>New Intake Receipt</span>
        </button>
      </div>

      {/* Harvest Batch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockHarvestBatches.map((batch) => (
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
                <div className="font-mono font-bold text-white text-sm mt-0.5">{batch.actualYieldKg.toLocaleString()} KG</div>
              </div>
              <div>
                <div className="text-slate-400">Moisture Content</div>
                <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">{batch.moistureContentPct}%</div>
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
        ))}
      </div>
    </DashboardLayout>
  );
}
