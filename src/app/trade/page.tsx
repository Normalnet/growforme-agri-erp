'use client';

import DashboardLayout from '../layout-wrapper';
import { mockTradeOrders } from '@/lib/mock-data';
import { ShoppingBag, Plus, Building2, CheckCircle2, DollarSign, Clock } from 'lucide-react';

export default function TradeModule() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <ShoppingBag className="w-4 h-4" />
            Module 09 / Institutional Trade & Market Exchange
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Sell to Trade Department</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage off-taker contracts (GCX, processors, exporters), spot/futures price matching, and sales releases.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-950/40 text-sm">
          <Plus className="w-4 h-4" />
          <span>New Off-Taker Contract</span>
        </button>
      </div>

      {/* Trade Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockTradeOrders.map((trd) => {
          const fulfillmentPct = (trd.fulfilledQuantityMT / trd.quantityMT) * 100;
          return (
            <div key={trd.id} className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold text-blue-400">{trd.contractNo}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {trd.contractType}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-white mt-3">{trd.offtakerName}</h3>
                <div className="text-xs text-slate-400">{trd.offtakerType}</div>

                <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Commodity:</span>
                    <span className="font-bold text-slate-200">{trd.commodity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Price / MT:</span>
                    <span className="font-mono font-bold text-emerald-400">GH₵ {trd.pricePerMTGHS.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contract Total:</span>
                    <span className="font-mono font-bold text-white">GH₵ {trd.totalValueGHS.toLocaleString()}</span>
                  </div>
                </div>

                {/* Fulfillment Progress */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Fulfillment</span>
                    <span className="text-blue-400">{trd.fulfilledQuantityMT} / {trd.quantityMT} MT ({fulfillmentPct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${fulfillmentPct}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Deadline: <strong className="text-slate-200">{trd.deliveryDeadline}</strong></span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${trd.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                  {trd.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
