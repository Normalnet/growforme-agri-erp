'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { SeasonCycle } from '@/types/schema';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Wheat,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  CalendarDays,
  Activity,
  Layers,
  X,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const STATUS_ORDER: SeasonCycle['status'][] = [
  'Planning',
  'Input Disbursement',
  'Active Cultivation',
  'Harvesting',
  'Retrieval & Sales',
  'Settled',
];

export default function CalendarPage() {
  const { cycles, addCycleOnly, updateCycleTimeline, deleteEntity } = useAppState();

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCycle, setEditingCycle] = useState<SeasonCycle | null>(null);

  // Add Form State
  const [name, setName] = useState('');
  const [crop, setCrop] = useState<'Maize' | 'Soybeans' | 'Cashew' | 'Rice' | 'Sorghum'>('Maize');
  const [region, setRegion] = useState<'Northern' | 'Ashanti' | 'Bono East' | 'Upper West' | 'Volta'>('Northern');
  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [targetAcreage, setTargetAcreage] = useState('1500');
  const [budgetTotalGHS, setBudgetTotalGHS] = useState('850000');
  const [status, setStatus] = useState<SeasonCycle['status']>('Planning');

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editTargetAcreage, setEditTargetAcreage] = useState('');
  const [editBudgetTotalGHS, setEditBudgetTotalGHS] = useState('');
  const [editStatus, setEditStatus] = useState<SeasonCycle['status']>('Planning');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCycleOnly({
      name: name || `${region} ${crop} Cycle 2026`,
      crop,
      region,
      startDate,
      endDate,
      targetAcreage: Number(targetAcreage) || 1000,
      budgetTotalGHS: Number(budgetTotalGHS) || 500000,
      status,
    });
    setShowAddModal(false);
    setName('');
  };

  const openEditModal = (c: SeasonCycle) => {
    setEditingCycle(c);
    setEditName(c.name);
    setEditStartDate(c.startDate);
    setEditEndDate(c.endDate);
    setEditTargetAcreage(c.targetAcreage.toString());
    setEditBudgetTotalGHS(c.budgetTotalGHS.toString());
    setEditStatus(c.status);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCycle) return;
    updateCycleTimeline(editingCycle.id, {
      name: editName,
      startDate: editStartDate,
      endDate: editEndDate,
      targetAcreage: Number(editTargetAcreage) || editingCycle.targetAcreage,
      budgetTotalGHS: Number(editBudgetTotalGHS) || editingCycle.budgetTotalGHS,
      status: editStatus,
    });
    setShowEditModal(false);
    setEditingCycle(null);
  };

  // Helper to compute milestone dates dynamically from start/end dates
  const calculateMilestones = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffDays = Math.max(30, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const d1 = new Date(start.getTime() - 10 * 86400000); // Land prep
    const d2 = start; // Input disbursement
    const d3 = new Date(start.getTime() + Math.floor(diffDays * 0.45) * 86400000); // Agronomist audit
    const d4 = new Date(start.getTime() + Math.floor(diffDays * 0.85) * 86400000); // Harvest gate
    const d5 = end; // Retrieval & Off-taker
    const d6 = new Date(end.getTime() + 14 * 86400000); // Settlement

    return [
      { phase: '1. Land Prep & Plowing', date: formatDate(d1), badge: 'Pre-Planting' },
      { phase: '2. Input Voucher Pickup', date: formatDate(d2), badge: 'Disbursement' },
      { phase: '3. Mid-Cycle Agronomy Audit', date: formatDate(d3), badge: 'Cultivation' },
      { phase: '4. Harvest Gate & EUDR Lab', date: formatDate(d4), badge: 'Harvest' },
      { phase: '5. Retrieval & Off-Taker Trade', date: formatDate(d5), badge: 'Logistics' },
      { phase: '6. 4-Tier Waterfall Payout', date: formatDate(d6), badge: 'Settlement' },
    ];
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <CalendarIcon className="w-4 h-4" />
            System Utility / Seasonal Timeline & Lifecycle Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Calendar & Crop Cycles</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Configure dynamic agronomic dates, land prep deadlines, input disbursement phases, and harvest windows.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-amber-950/40 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Season Timeline</span>
        </button>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Active Cycles</span>
            <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">{cycles.length} Cycles</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Target Acreage</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              {cycles.reduce((acc, curr) => acc + curr.targetAcreage, 0).toLocaleString()} Acres
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Seasonal Budgets</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              GH₵ {cycles.reduce((acc, curr) => acc + curr.budgetTotalGHS, 0).toLocaleString()}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Outgrower Allocation</span>
            <div className="text-2xl font-extrabold text-sky-400 font-mono mt-1">
              {cycles.reduce((acc, curr) => acc + curr.totalFarmers, 0)} Farmers
            </div>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Wheat className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Cycle Cards */}
      <div className="space-y-6 mt-8">
        <h3 className="text-lg font-bold text-white">Configured Crop Cycle Timelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cycles.map((c) => {
            const milestones = calculateMilestones(c.startDate, c.endDate);
            const currentPhaseIndex = STATUS_ORDER.indexOf(c.status);

            return (
              <div key={c.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-extrabold text-white">{c.name}</h4>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{c.region} Region • {c.crop}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {c.status}
                      </span>
                      <button
                        onClick={() => openEditModal(c)}
                        title="Edit Timeline & Phase"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteEntity('cycle', c.id)}
                        title="Delete Cycle"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Lifecycle Phase Progression Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <div className="flex justify-between text-[11px] text-slate-400 font-semibold mb-1.5">
                      <span>Lifecycle Phase Progression</span>
                      <span className="text-amber-400">{c.status}</span>
                    </div>
                    <div className="grid grid-cols-6 gap-1">
                      {STATUS_ORDER.map((st, idx) => {
                        const isPastOrCurrent = idx <= currentPhaseIndex;
                        return (
                          <div
                            key={st}
                            title={st}
                            className={`h-2 rounded-full transition ${
                              isPastOrCurrent ? 'bg-amber-400' : 'bg-slate-800'
                            }`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Core Dates */}
                  <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 grid grid-cols-2 gap-4 text-xs mt-4">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Season Planting Start:</span>
                      <strong className="text-white font-mono text-sm mt-0.5 block">{c.startDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Expected Harvest Window:</span>
                      <strong className="text-amber-400 font-mono text-sm mt-0.5 block">{c.endDate}</strong>
                    </div>
                  </div>

                  {/* Dynamic Milestones Timeline */}
                  <div className="mt-4 space-y-2">
                    <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                      Dynamic Agronomic Milestones
                    </span>
                    <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
                      {milestones.map((m, i) => (
                        <div key={i} className="flex justify-between items-center py-0.5 text-slate-300">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>{m.phase}</span>
                          </div>
                          <span className="font-mono text-slate-400 text-[11px]">{m.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex justify-between pt-3 border-t border-slate-800">
                  <span>Target Acreage: <strong className="text-slate-200">{c.targetAcreage} Acres</strong></span>
                  <span>Total Budget: <strong className="text-emerald-400 font-mono">GH₵ {c.budgetTotalGHS.toLocaleString()}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Cycle Timeline Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">Add New Season Timeline</h3>
                <p className="text-xs text-slate-400">Define planting start dates, harvest windows, and targets.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1">Cycle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tamale Maize Outgrower 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Crop Type</label>
                  <select
                    value={crop}
                    onChange={(e: any) => setCrop(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="Maize">Maize</option>
                    <option value="Soybeans">Soybeans</option>
                    <option value="Cashew">Cashew</option>
                    <option value="Rice">Rice</option>
                    <option value="Sorghum">Sorghum</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Region</label>
                  <select
                    value={region}
                    onChange={(e: any) => setRegion(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="Northern">Northern</option>
                    <option value="Ashanti">Ashanti</option>
                    <option value="Bono East">Bono East</option>
                    <option value="Upper West">Upper West</option>
                    <option value="Volta">Volta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Planting Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Harvest Window End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Target Acreage</label>
                  <input
                    type="number"
                    required
                    value={targetAcreage}
                    onChange={(e) => setTargetAcreage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Budget Allocation (GHS)</label>
                  <input
                    type="number"
                    required
                    value={budgetTotalGHS}
                    onChange={(e) => setBudgetTotalGHS(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1">Initial Lifecycle Status</label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                >
                  {STATUS_ORDER.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 transition"
                >
                  Save Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Cycle Timeline Modal */}
      {showEditModal && editingCycle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">Modify Timeline & Lifecycle Phase</h3>
                <p className="text-xs font-mono text-amber-400">{editingCycle.name}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1">Cycle Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Planting Start Date</label>
                  <input
                    type="date"
                    required
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Harvest Window End Date</label>
                  <input
                    type="date"
                    required
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Target Acreage</label>
                  <input
                    type="number"
                    required
                    value={editTargetAcreage}
                    onChange={(e) => setEditTargetAcreage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Budget Allocation (GHS)</label>
                  <input
                    type="number"
                    required
                    value={editBudgetTotalGHS}
                    onChange={(e) => setEditBudgetTotalGHS(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1">Current Lifecycle Phase</label>
                <select
                  value={editStatus}
                  onChange={(e: any) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-bold"
                >
                  {STATUS_ORDER.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 transition"
                >
                  Update Timeline & Phase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

