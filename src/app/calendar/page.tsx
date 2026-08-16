'use client';

import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { Calendar as CalendarIcon, Clock, MapPin, Wheat } from 'lucide-react';

export default function CalendarPage() {
  const { cycles } = useAppState();

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <CalendarIcon className="w-4 h-4" />
            System Utility / Seasonal Timeline
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Calendar & Crop Cycles</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Track key agronomic dates, land prep deadlines, input distribution schedules, and harvest windows.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Active Crop Cycle Timelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cycles.map((c) => (
            <div key={c.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-extrabold text-white">{c.name}</h4>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{c.region} Region • {c.crop}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {c.status}
                </span>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Season Planting Start</span>
                  <strong className="text-white font-mono text-sm mt-0.5 block">{c.startDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Expected Harvest Window</span>
                  <strong className="text-amber-400 font-mono text-sm mt-0.5 block">{c.endDate}</strong>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex justify-between">
                <span>Target Acreage: <strong className="text-slate-200">{c.targetAcreage} Acres</strong></span>
                <span>Total Budget: <strong className="text-emerald-400 font-mono">GH₵ {c.budgetTotalGHS.toLocaleString()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
