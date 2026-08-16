'use client';

import DashboardLayout from '../layout-wrapper';
import { mockMechanizationLogs } from '@/lib/mock-data';
import { MechanizationMap } from '@/components/map/MechanizationMap';
import { MapPin, Plus, Radio, ShieldCheck } from 'lucide-react';

export default function MechanizationModule() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <MapPin className="w-4 h-4" />
            Module 06 / GPS Telematics & Land Prep
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Live Mechanization & Fleet Tracking</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Monitor farm preparation, plowing, harrowing, planting, and drone spraying in real-time.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-950/40 text-sm">
          <Plus className="w-4 h-4" />
          <span>Dispatch Machinery</span>
        </button>
      </div>

      <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/30 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">System GPS Telematics:</span> <code className="text-indigo-400 font-mono">WGS84 Live Polygon Feed</code>
            <span className="text-slate-400 ml-3">Active Hubs: Tamale, Ejura & Techiman Centers</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
          Telemetry Online
        </span>
      </div>

      {/* Geospatial Map Container */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            Active Field Machinery Telematics Map (Northern & Ashanti Clusters)
          </h3>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
            Live GPS Connected
          </span>
        </div>
        <MechanizationMap logs={mockMechanizationLogs} />
      </div>

      {/* Job Card Operational Logs */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Tractor & Drone Job Cards</h3>
          <span className="text-xs text-slate-400">Telematics Logs & Acreage Completed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Job Card ID</th>
                <th className="p-4">Farm Code & Owner</th>
                <th className="p-4">Machinery Activity</th>
                <th className="p-4">Operator / Equipment</th>
                <th className="p-4">Acres Covered</th>
                <th className="p-4">Fuel Consumed</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockMechanizationLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-indigo-400">{log.jobCardId}</td>
                  <td className="p-4 font-bold text-white">
                    <div>{log.farmerName}</div>
                    <div className="text-xs text-slate-400 font-mono font-normal">{log.farmCode}</div>
                  </td>
                  <td className="p-4 text-slate-200">{log.machineryType}</td>
                  <td className="p-4 text-xs text-slate-300">{log.operatorName}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">{log.acresCovered} Acres</td>
                  <td className="p-4 font-mono text-amber-400 text-xs">{log.fuelConsumedLitres} Litres</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        log.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {log.status}
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
