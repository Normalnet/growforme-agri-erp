'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { PieChart, Plus, ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CheckCircle, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function BudgetModule() {
  const { cycles, budgetItems, addCycleWithCampaign } = useAppState();
  const [selectedCycle, setSelectedCycle] = useState(cycles[0]?.id || '');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [crop, setCrop] = useState<'Maize' | 'Soybeans' | 'Cashew' | 'Rice' | 'Sorghum'>('Maize');
  const [region, setRegion] = useState<'Northern' | 'Ashanti' | 'Bono East' | 'Upper West' | 'Volta'>('Northern');
  const [targetAcreage, setTargetAcreage] = useState('2000');
  const [budgetTotalGHS, setBudgetTotalGHS] = useState('1500000');

  const currentCycle = cycles.find((c) => c.id === selectedCycle) || cycles[0] || {
    id: 'cyc_default',
    name: 'Sample Cycle',
    crop: 'Maize',
    region: 'Northern',
    targetAcreage: 1000,
    allocatedAcreage: 500,
    totalFarmers: 100,
    budgetTotalGHS: 500000,
  };

  const items = budgetItems.filter((i) => i.cycleId === currentCycle?.id);

  const totalBudget = items.length > 0 ? items.reduce((acc, curr) => acc + curr.budgetedAmountGHS, 0) : currentCycle.budgetTotalGHS;
  const totalActual = items.reduce((acc, curr) => acc + curr.actualAmountGHS, 0);
  const netVariance = totalBudget - totalActual;

  const chartData = items.length > 0
    ? items.map((i) => ({
        category: i.category,
        Budgeted: i.budgetedAmountGHS / 1000,
        Actual: i.actualAmountGHS / 1000,
      }))
    : [
        { category: 'Inputs', Budgeted: totalBudget * 0.4 / 1000, Actual: 0 },
        { category: 'Machinery', Budgeted: totalBudget * 0.3 / 1000, Actual: 0 },
        { category: 'Labour', Budgeted: totalBudget * 0.2 / 1000, Actual: 0 },
        { category: 'Logistics', Budgeted: totalBudget * 0.1 / 1000, Actual: 0 },
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bTotal = Number(budgetTotalGHS);
    addCycleWithCampaign(
      { name, crop, region, targetAcreage: Number(targetAcreage), budgetTotalGHS: bTotal },
      [
        { category: 'Inputs', description: 'Certified Hybrid Seeds & NPK Fertilizer', budgetedAmountGHS: bTotal * 0.45 },
        { category: 'Machinery', description: 'Tractor land prep & harrowing', budgetedAmountGHS: bTotal * 0.25 },
        { category: 'Labour', description: 'Outgrower weeding & harvesting labor', budgetedAmountGHS: bTotal * 0.15 },
        { category: 'Logistics', description: 'Depot transit & aggregation fees', budgetedAmountGHS: bTotal * 0.15 },
      ]
    );
    setShowModal(false);
    setName('');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <PieChart className="w-4 h-4" />
            Module 01 / Operational Budget
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Seasonal Operational Budget</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Plan crop cycle budgets, track field expenses, and run automatic campaign fund generation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            aria-label="Select Active Cycle"
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2.5 font-medium focus:ring-1 focus:ring-emerald-500"
          >
            {cycles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.crop})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/40 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Cycle Budget</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start text-slate-400 text-xs font-semibold uppercase">
            <span>Total Allocation</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            GH₵ {totalBudget.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Target: {currentCycle.targetAcreage.toLocaleString()} Acres</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start text-slate-400 text-xs font-semibold uppercase">
            <span>Actual Spend</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            GH₵ {totalActual.toLocaleString()}
          </div>
          <div className="text-xs text-amber-400 mt-1">
            {totalBudget > 0 ? ((totalActual / totalBudget) * 100).toFixed(1) : 0}% Disbursed
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start text-slate-400 text-xs font-semibold uppercase">
            <span>Variance Balance</span>
            {netVariance >= 0 ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-rose-400" />}
          </div>
          <div className={`text-2xl font-extrabold mt-2 font-mono ${netVariance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            GH₵ {Math.abs(netVariance).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">{netVariance >= 0 ? 'Favorable Under-Run' : 'Cost Overrun'}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start text-slate-400 text-xs font-semibold uppercase">
            <span>Active Outgrowers</span>
            <CheckCircle className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            {currentCycle.totalFarmers} Farmers
          </div>
          <div className="text-xs text-sky-400 mt-1">Region: {currentCycle.region}</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">Budgeted vs. Actual Spend (in GHS '000s)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="category" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', color: '#F8FAFC' }} />
              <Legend />
              <Bar dataKey="Budgeted" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Actual" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Expense Ledger Items</h3>
          <span className="text-xs text-slate-400">{items.length} Allocations</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Budgeted (GHS)</th>
                <th className="p-4">Actual (GHS)</th>
                <th className="p-4">Variance</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white">{item.category}</td>
                  <td className="p-4 text-slate-300">{item.description}</td>
                  <td className="p-4 font-mono font-medium text-slate-200">GH₵ {item.budgetedAmountGHS.toLocaleString()}</td>
                  <td className="p-4 font-mono font-medium text-amber-400">GH₵ {item.actualAmountGHS.toLocaleString()}</td>
                  <td className={`p-4 font-mono font-semibold ${item.varianceGHS >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    GH₵ {item.varianceGHS.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-lg">Create New Seasonal Cycle & Campaign</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Cycle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Savelugu Soy Outgrower 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Crop Type</label>
                  <select
                    value={crop}
                    onChange={(e: any) => setCrop(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Maize">Maize</option>
                    <option value="Soybeans">Soybeans</option>
                    <option value="Cashew">Cashew</option>
                    <option value="Rice">Rice</option>
                    <option value="Sorghum">Sorghum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Region</label>
                  <select
                    value={region}
                    onChange={(e: any) => setRegion(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Northern">Northern</option>
                    <option value="Ashanti">Ashanti</option>
                    <option value="Bono East">Bono East</option>
                    <option value="Upper West">Upper West</option>
                    <option value="Volta">Volta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Target Acreage</label>
                  <input
                    type="number"
                    required
                    value={targetAcreage}
                    onChange={(e) => setTargetAcreage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Total Budget (GHS)</label>
                  <input
                    type="number"
                    required
                    value={budgetTotalGHS}
                    onChange={(e) => setBudgetTotalGHS(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
                >
                  Save & Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
