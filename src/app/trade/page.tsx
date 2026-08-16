'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { ShoppingBag, Plus, X, Trash2 } from 'lucide-react';

export default function TradeModule() {
  const { tradeOrders, createTradeContract, deleteEntity } = useAppState();
  const [showModal, setShowModal] = useState(false);

  // Form State with strict enum union types
  const [offtakerName, setOfftakerName] = useState('');
  const [offtakerType, setOfftakerType] = useState<'Ghana Commodity Exchange (GCX)' | 'Industrial Processor' | 'Exporter' | 'Local Feed Mill'>('Ghana Commodity Exchange (GCX)');
  const [commodity, setCommodity] = useState('Grade A Yellow Maize');
  const [quantityMT, setQuantityMT] = useState('500');
  const [pricePerMTGHS, setPricePerMTGHS] = useState('3200');
  const [contractType, setContractType] = useState<'Spot Contract' | 'Futures Contract'>('Spot Contract');
  const [deliveryDeadline, setDeliveryDeadline] = useState('2026-11-30');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTradeContract({
      offtakerName,
      offtakerType,
      commodity,
      quantityMT: Number(quantityMT),
      pricePerMTGHS: Number(pricePerMTGHS),
      contractType,
      deliveryDeadline,
    });
    setShowModal(false);
    setOfftakerName('');
  };

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

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-950/40 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Off-Taker Contract</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tradeOrders.map((trd) => {
          const fulfillmentPct = (trd.fulfilledQuantityMT / trd.quantityMT) * 100;
          return (
            <div key={trd.id} className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold text-blue-400">{trd.contractNo}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {trd.contractType}
                    </span>
                    <button onClick={() => deleteEntity('trade', trd.id)} className="p-1 text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {trd.status}
                </span>
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
              <h3 className="font-extrabold text-white text-lg">Create Off-Taker Trade Contract</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Off-Taker / Buyer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ghana Commodity Exchange (GCX)"
                  value={offtakerName}
                  onChange={(e) => setOfftakerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Off-Taker Type</label>
                  <select
                    value={offtakerType}
                    onChange={(e: any) => setOfftakerType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  >
                    <option value="Ghana Commodity Exchange (GCX)">GCX Exchange</option>
                    <option value="Industrial Processor">Industrial Processor</option>
                    <option value="Exporter">Exporter</option>
                    <option value="Local Feed Mill">Local Feed Mill</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Contract Type</label>
                  <select
                    value={contractType}
                    onChange={(e: any) => setContractType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  >
                    <option value="Spot Contract">Spot Contract</option>
                    <option value="Futures Contract">Futures Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Quantity (MT)</label>
                  <input
                    type="number"
                    required
                    value={quantityMT}
                    onChange={(e) => setQuantityMT(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Price per MT (GHS)</label>
                  <input
                    type="number"
                    required
                    value={pricePerMTGHS}
                    onChange={(e) => setPricePerMTGHS(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-blue-500 text-slate-950 rounded-xl hover:bg-blue-400">
                  Execute Trade Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
