'use client';

import DashboardLayout from '../layout-wrapper';
import { mockInputs, mockDisbursements } from '@/lib/mock-data';
import { Truck, Plus, QrCode, Key, Package, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function InputsModule() {
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

        <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-sky-950/40 text-sm">
          <Plus className="w-4 h-4" />
          <span>Issue New Voucher</span>
        </button>
      </div>

      {/* Warehouse Stock Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Central Agro-Depot Stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockInputs.map((inp) => (
            <div key={inp.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
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
                <div className="text-xs text-slate-400">{inp.warehouseDepot}</div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between text-xs">
                <span>Stock: <strong className="text-slate-100">{inp.allocatedStock} / {inp.totalStock} {inp.unit}</strong></span>
                <span className="font-mono font-bold text-sky-400">GH₵ {inp.unitCostGHS} / unit</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disbursement Voucher Log */}
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
                <th className="p-4">Agro-Depot Location</th>
                <th className="p-4">Disbursed Items</th>
                <th className="p-4">Total Cost (GHS)</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockDisbursements.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-sky-400">{d.voucherCode}</td>
                  <td className="p-4 font-bold text-white">{d.farmerName}</td>
                  <td className="p-4 text-slate-300">{d.depotName}</td>
                  <td className="p-4 text-xs text-slate-300">
                    {d.items.map((i, idx) => (
                      <div key={idx}>
                        • {i.quantity}x {i.item}
                      </div>
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
    </DashboardLayout>
  );
}
