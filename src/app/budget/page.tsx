'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { mockBudgetItems, mockCycles } from '@/lib/mock-data';
import { PieChart, Plus, ArrowUpRight, ArrowDownRight, DollarSign, Wallet, Filter, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function BudgetModule() {
  const [selectedCycle, setSelectedCycle] = useState(mockCycles[0].id);
  const [showNewBudgetModal, setShowNewBudgetModal] = useState(false);

  const currentCycle = mockCycles.find((c) => c.id === selectedCycle) || mockCycles[0];
  const items = mockBudgetItems.filter((i) => i.cycleId === selectedCycle);

  const totalBudget = items.reduce((acc, curr) => acc + curr.budgetedAmountGHS, 0);
  const totalActual = items.reduce((acc, curr) => acc + curr.actualAmountGHS, 0);
  const netVariance = totalBudget - totalActual;

  const chartData = items.map((i) => ({
    category: i.category,
    Budgeted: i.budgetedAmountGHS / 1000,
    Actual: i.actualAmountGHS / 1000,
  }));

  return (
    <DashboardLayout>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <PieChart className="w-4 h-4" />
            Module 01 / Financial Planning
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Seasonal Operational Budget</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Plan crop cycle budgets, track field expenses, and conduct burn-rate variance analysis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            aria-label="Select Seasonal Crop Cycle"
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2.5 font-medium focus:ring-1 focus:ring-emerald-500"
          >
            {mockCycles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.crop})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowNewBudgetModal(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/40 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Line Item</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start text-slate-400 text-xs font-semibold uppercase">
            <span>Total Cycle Allocation</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            GH₵ {totalBudget.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Target Acreage: {currentCycle.targetAcreage.toLocaleString()} Acres</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start text-slate-400 text-xs font-semibold uppercase">
            <span>Actual Spend To-Date</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            GH₵ {totalActual.toLocaleString()}
          </div>
          <div className="text-xs text-amber-400 mt-1 flex items-center gap-1">
            <span>{((totalActual / totalBudget) * 100).toFixed(1)}% of Budget Disbursed</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start text-slate-400 text-xs font-semibold uppercase">
            <span>Variance Balance</span>
            {netVariance >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className={`text-2xl font-extrabold mt-2 ${netVariance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            GH₵ {Math.abs(netVariance).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {netVariance >= 0 ? 'Favorable Under-Run' : 'Cost Overrun Warning'}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start text-slate-400 text-xs font-semibold uppercase">
            <span>Active Outgrowers</span>
            <CheckCircle className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {currentCycle.totalFarmers} Farmers
          </div>
          <div className="text-xs text-sky-400 mt-1">Region: {currentCycle.region} Ghana</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <span>Budgeted vs. Actual Spend Breakdown (in GHS '000s)</span>
        </h3>
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
          <span className="text-xs text-slate-400">Showing {items.length} Category Allocations</span>
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
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Under Budget'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.status === 'On Track'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {item.status}
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
