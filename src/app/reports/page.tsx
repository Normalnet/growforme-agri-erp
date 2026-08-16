'use client';

import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { BarChart3, TrendingUp, DollarSign, Wheat, Users, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from 'recharts';

export default function ReportsPage() {
  const { cycles, tradeOrders, settlements, farmers } = useAppState();

  const totalRevenue = settlements.reduce((acc, s) => acc + s.grossRevenueGHS, 0);
  const totalFarmerProfit = settlements.reduce((acc, s) => acc + s.farmerNetProfitGHS, 0);
  const totalTradeValue = tradeOrders.reduce((acc, t) => acc + t.totalValueGHS, 0);

  const reportChartData = cycles.map((c) => ({
    name: c.name.substring(0, 15) + '...',
    Budget: c.budgetTotalGHS / 1000,
    Farmers: c.totalFarmers,
    Acreage: c.allocatedAcreage,
  }));

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <BarChart3 className="w-4 h-4" />
            System Utility / Executive Analytics
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Reports & Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Consolidated operational reports, yield trends, and financial performance metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase">Cumulative Gross Revenue</div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">GH₵ {totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 mt-1">Settled Crop Cycles</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase">Net Outgrower MoMo Payouts</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2 font-mono">GH₵ {totalFarmerProfit.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Disbursed to {farmers.length} Farmers</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase">Active Off-Taker Contracts</div>
          <div className="text-2xl font-extrabold text-blue-400 mt-2 font-mono">GH₵ {totalTradeValue.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">GCX & Export Orders</div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">Seasonal Cycle Budget Allocations (GHS '000s)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', color: '#F8FAFC' }} />
              <Legend />
              <Bar dataKey="Budget" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Acreage" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
