'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { INPUT_CATALOG } from '@/lib/ghana-data';
import { Truck, Plus, QrCode, Key, Package, CheckCircle2, X } from 'lucide-react';

export default function InputsModule() {
  const { inputs, disbursements, farmers, issueInputVoucher } = useAppState();
  const [showModal, setShowModal] = useState(false);

  // Form State connected to INPUT_CATALOG
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');
  const [depotName, setDepotName] = useState('Tamale Central Depot');
  const [selectedCatalogItem, setSelectedCatalogItem] = useState(INPUT_CATALOG[0].itemCode);
  const [quantity, setQuantity] = useState('10');

  const activeItemObj = INPUT_CATALOG.find((i) => i.itemCode === selectedCatalogItem) || INPUT_CATALOG[0];
  const calculatedTotalCost = Number(quantity) * activeItemObj.unitCostGHS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(quantity);
    issueInputVoucher(
      {
        depotName,
        items: [{ item: activeItemObj.name, quantity: q, costGHS: calculatedTotalCost }],
      },
      selectedFarmerId,
      calculatedTotalCost
    );
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
            <Truck className="w-4 h-4" />
            Module 05 / Input Delivery & In-Kind Credit
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Input Vouchers & Inventory Tracking</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Issue digital vouchers, track warehouse inventory, and verify farmer OTP pickups at agro-dealer depots.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-sky-950/40 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Voucher</span>
        </button>
      </div>

      {/* Warehouse Stock Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Central Agro-Depot Catalog & Inventory Stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INPUT_CATALOG.map((inp) => (
            <div key={inp.itemCode} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                  {inp.itemCode}
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base">{inp.name}</h4>
                <div className="text-xs text-slate-400">Category: {inp.category}</div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between text-xs">
                <span>Unit: <strong className="text-slate-100">{inp.unit}</strong></span>
                <span className="font-mono font-bold text-sky-400">GH₵ {inp.unitCostGHS} / unit</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Farmer Voucher Pickup Ledger</h3>
          <span className="text-xs text-slate-400">OTP / QR Authenticated Pickup Logs</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Voucher Code</th>
                <th className="p-4">Farmer Name</th>
                <th className="p-4">Agro-Depot</th>
                <th className="p-4">Disbursed Items</th>
                <th className="p-4">Total Cost (GHS)</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {disbursements.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-sky-400">{d.voucherCode}</td>
                  <td className="p-4 font-bold text-white">{d.farmerName}</td>
                  <td className="p-4 text-slate-300">{d.depotName}</td>
                  <td className="p-4 text-xs text-slate-300">
                    {d.items.map((i, idx) => (
                      <div key={idx}>• {i.quantity}x {i.item}</div>
                    ))}
                  </td>
                  <td className="p-4 font-mono font-bold text-white">GH₵ {d.totalCostGHS.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-md text-xs font-mono font-semibold text-slate-300">
                      {d.verificationMethod === 'OTP' ? <Key className="w-3 h-3 text-amber-400" /> : <QrCode className="w-3 h-3 text-sky-400" />}
                      {d.verificationMethod}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" />
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Voucher Selector Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-lg">Issue Input Voucher (In-Kind Credit)</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Select Beneficiary Farmer</label>
                <select
                  value={selectedFarmerId}
                  onChange={(e) => setSelectedFarmerId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-sky-500 outline-none"
                >
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.fullName} ({f.community}) - Debt: GH₵ {f.totalLoansInKindGHS}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Select Input Catalog Item</label>
                <select
                  value={selectedCatalogItem}
                  onChange={(e) => setSelectedCatalogItem(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                >
                  {INPUT_CATALOG.map((item) => (
                    <option key={item.itemCode} value={item.itemCode}>
                      {item.name} — GH₵ {item.unitCostGHS} per {item.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Agro-Depot Location</label>
                  <input
                    type="text"
                    required
                    value={depotName}
                    onChange={(e) => setDepotName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Quantity ({activeItemObj.unit})</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl text-xs text-amber-400 border border-slate-800 flex justify-between items-center">
                <span>Computed Voucher Total:</span>
                <strong className="text-white font-mono text-sm">GH₵ {calculatedTotalCost.toLocaleString()}</strong>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-sky-500 text-slate-950 rounded-xl hover:bg-sky-400">
                  Issue Voucher & Send OTP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
