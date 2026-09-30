'use client';

import React, { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { TradeOrder } from '@/types/schema';
import {
  ShoppingBag,
  Plus,
  X,
  Trash2,
  DollarSign,
  CheckCircle2,
  Clock,
  CreditCard,
  Building,
} from 'lucide-react';

export default function TradeModule() {
  const { tradeOrders, cycles, createTradeContract, updateTradePaymentStatus, deleteEntity } = useAppState();
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<TradeOrder | null>(null);

  // Contract Form State
  const [cycleName, setCycleName] = useState(cycles[0]?.name || 'Northern Maize & Soy Outgrower 2026');
  const [offtakerName, setOfftakerName] = useState('');
  const [offtakerType, setOfftakerType] = useState<
    'Ghana Commodity Exchange (GCX)' | 'Industrial Processor' | 'Exporter' | 'Local Feed Mill'
  >('Ghana Commodity Exchange (GCX)');
  const [commodity, setCommodity] = useState('Grade A Yellow Maize');
  const [quantityMT, setQuantityMT] = useState('500');
  const [pricePerMTGHS, setPricePerMTGHS] = useState('3200');
  const [contractType, setContractType] = useState<'Spot Contract' | 'Futures Contract'>('Spot Contract');
  const [deliveryDeadline, setDeliveryDeadline] = useState('2026-11-30');

  // Payment Form State
  const [paymentStatus, setPaymentStatus] = useState<'Pending' | 'Partially Paid' | 'Fully Paid'>('Fully Paid');
  const [paymentAmountGHS, setPaymentAmountGHS] = useState('0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTradeContract({
      cycleName,
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

  const openPaymentModal = (trd: TradeOrder) => {
    setSelectedTrade(trd);
    setPaymentStatus(trd.paymentStatus || 'Fully Paid');
    setPaymentAmountGHS(trd.amountPaidGHS ? trd.amountPaidGHS.toString() : trd.totalValueGHS.toString());
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrade) return;
    updateTradePaymentStatus(selectedTrade.id, paymentStatus, Number(paymentAmountGHS) || 0);
    setShowPaymentModal(false);
    setSelectedTrade(null);
  };

  const totalContractValue = tradeOrders.reduce((acc, t) => acc + t.totalValueGHS, 0);
  const totalPaidValue = tradeOrders.reduce((acc, t) => acc + (t.amountPaidGHS || 0), 0);
  const totalVolumeMT = tradeOrders.reduce((acc, t) => acc + t.quantityMT, 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <ShoppingBag className="w-4 h-4" />
            Module 09 / Institutional Trade & Market Exchange
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Off-Taker Trade Agreements & Revenue Intake</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage off-taker contracts (GCX, processors, exporters) and track cash receipts feeding into Money Back settlements.
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

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Contracted Volume</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">{totalVolumeMT.toLocaleString()} MT</div>
            <div className="text-xs text-blue-400 mt-0.5">{tradeOrders.length} Active Contracts</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Contract Value</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              GH₵ {totalContractValue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Committed Buyer Value</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Realized Cash Received</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              GH₵ {totalPaidValue.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-500 mt-0.5">
              {((totalPaidValue / (totalContractValue || 1)) * 100).toFixed(0)}% Realized for Waterfall
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Trade Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {tradeOrders.map((trd) => {
          const fulfillmentPct = (trd.fulfilledQuantityMT / trd.quantityMT) * 100;
          const paidAmount = trd.amountPaidGHS || 0;
          const paymentPct = (paidAmount / (trd.totalValueGHS || 1)) * 100;

          return (
            <div
              key={trd.id}
              className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold text-blue-400">{trd.contractNo}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {trd.contractType}
                    </span>
                    <button
                      onClick={() => deleteEntity('trade', trd.id)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-white mt-2">{trd.offtakerName}</h3>
                <div className="text-xs text-slate-400">{trd.offtakerType}</div>
                {trd.cycleName && (
                  <div className="text-[11px] text-indigo-400 mt-0.5 font-semibold">
                    Cycle: {trd.cycleName}
                  </div>
                )}

                <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Commodity:</span>
                    <span className="font-bold text-slate-200">{trd.commodity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Price / MT:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      GH₵ {trd.pricePerMTGHS.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contract Total:</span>
                    <span className="font-mono font-bold text-white">
                      GH₵ {trd.totalValueGHS.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Delivery Fulfillment Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-400">Physical Delivery</span>
                    <span className="text-blue-400">
                      {trd.fulfilledQuantityMT} / {trd.quantityMT} MT ({fulfillmentPct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${fulfillmentPct}%` }}></div>
                  </div>
                </div>

                {/* Payment Receipt Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-400">Payment Received</span>
                    <span
                      className={
                        trd.paymentStatus === 'Fully Paid'
                          ? 'text-emerald-400'
                          : trd.paymentStatus === 'Partially Paid'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }
                    >
                      GH₵ {paidAmount.toLocaleString()} ({paymentPct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        trd.paymentStatus === 'Fully Paid'
                          ? 'bg-emerald-500'
                          : trd.paymentStatus === 'Partially Paid'
                          ? 'bg-amber-500'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${Math.min(100, paymentPct)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                    trd.paymentStatus === 'Fully Paid'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : trd.paymentStatus === 'Partially Paid'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {trd.paymentStatus || 'Pending Payment'}
                </span>

                <button
                  onClick={() => openPaymentModal(trd)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition flex items-center gap-1"
                >
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  <span>Update Payment</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Trade Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">Create Off-Taker Trade Contract</h3>
                <p className="text-xs text-slate-400">Institutional spot or futures contract matching.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <SearchableSelect
                  label="Linked Crop Season Cycle"
                  options={cycles.map((c) => ({
                    value: c.name,
                    label: c.name,
                    subtext: `${c.crop} • ${c.region}`,
                  }))}
                  value={cycleName}
                  onChange={setCycleName}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Off-Taker / Buyer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ghana Commodity Exchange (GCX)"
                  value={offtakerName}
                  onChange={(e) => setOfftakerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <SearchableSelect
                    label="Off-Taker Type"
                    options={[
                      { value: 'Ghana Commodity Exchange (GCX)', label: 'GCX Exchange' },
                      { value: 'Industrial Processor', label: 'Industrial Processor' },
                      { value: 'Exporter', label: 'Exporter' },
                      { value: 'Local Feed Mill', label: 'Local Feed Mill' },
                    ]}
                    value={offtakerType}
                    onChange={(v: any) => setOfftakerType(v)}
                  />
                </div>
                <div>
                  <SearchableSelect
                    label="Contract Type"
                    options={[
                      { value: 'Spot Contract', label: 'Spot Contract' },
                      { value: 'Futures Contract', label: 'Futures Contract' },
                    ]}
                    value={contractType}
                    onChange={(v: any) => setContractType(v)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Quantity (MT) *</label>
                  <input
                    type="number"
                    required
                    value={quantityMT}
                    onChange={(e) => setQuantityMT(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Price per MT (GHS) *</label>
                  <input
                    type="number"
                    required
                    value={pricePerMTGHS}
                    onChange={(e) => setPricePerMTGHS(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl flex justify-between items-center text-xs border border-slate-800">
                <span className="text-slate-400">Total Contract Value:</span>
                <strong className="text-white font-mono text-sm">
                  GH₵ {((Number(quantityMT) || 0) * (Number(pricePerMTGHS) || 0)).toLocaleString()}
                </strong>
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
                  className="px-5 py-2 text-xs font-bold bg-blue-500 text-slate-950 rounded-xl hover:bg-blue-400 transition"
                >
                  Execute Trade Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record / Update Payment Modal */}
      {showPaymentModal && selectedTrade && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">Record Off-Taker Payment</h3>
                <p className="text-xs font-mono text-blue-400">{selectedTrade.contractNo} - {selectedTrade.offtakerName}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <SearchableSelect
                  label="Payment Status"
                  options={[
                    { value: 'Fully Paid', label: 'Fully Paid (100% Received)', badge: 'Settled' },
                    { value: 'Partially Paid', label: 'Partially Paid', badge: 'In Progress' },
                    { value: 'Pending', label: 'Pending Payment', badge: 'Unpaid' },
                  ]}
                  value={paymentStatus}
                  onChange={(v: any) => {
                    setPaymentStatus(v);
                    if (v === 'Fully Paid') {
                      setPaymentAmountGHS(selectedTrade.totalValueGHS.toString());
                    } else if (v === 'Pending') {
                      setPaymentAmountGHS('0');
                    }
                  }}
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1">Total Cash Amount Received (GHS)</label>
                <input
                  type="number"
                  required
                  value={paymentAmountGHS}
                  onChange={(e) => setPaymentAmountGHS(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono outline-none focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Contract Total: GH₵ {selectedTrade.totalValueGHS.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs">
                Payments recorded here automatically feed as Gross Harvest Revenue into Module 10 (Money Back Waterfall).
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition"
                >
                  Confirm & Update Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
