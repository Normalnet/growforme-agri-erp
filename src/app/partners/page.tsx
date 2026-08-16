'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { mockPartners } from '@/lib/mock-data';
import { Users, Plus, Star, ShieldCheck, FileCheck, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react';

export default function PartnersModule() {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [partners, setPartners] = useState(mockPartners);

  const filteredPartners = filterCategory === 'All'
    ? partners
    : partners.filter((p) => p.category === filterCategory);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Users className="w-4 h-4" />
            Module 02 / Ecosystem Vetting
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Certified Partners & Suppliers</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Onboard, vet, and manage certified input suppliers, warehouse operators, and mechanization hubs.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-amber-950/40 text-sm">
          <Plus className="w-4 h-4" />
          <span>Onboard New Partner</span>
        </button>
      </div>

      {/* Filter Category Bar */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Aggregator', 'Input Supplier', 'Logistics Contractor', 'Warehouse Operator', 'Seed Breeder'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              filterCategory === cat
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Partner Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-full text-xs font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{partner.rating.toFixed(1)}</span>
                </div>
              </div>

              <h3 className="font-extrabold text-white text-lg mt-4">{partner.name}</h3>
              <div className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 mt-1">
                {partner.category}
              </div>

              <div className="space-y-2 mt-4 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-medium text-slate-200">{partner.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-medium text-slate-200">{partner.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Contracts:</span>
                  <span className="font-mono font-bold text-emerald-400">GH₵ {partner.totalContractsGHS.toLocaleString()}</span>
                </div>
              </div>

              {/* Compliance Bar */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-400">Vetting Compliance Score</span>
                  <span className="text-emerald-400">{partner.complianceScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${partner.complianceScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  partner.slaStatus === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {partner.slaStatus === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                SLA {partner.slaStatus}
              </span>

              <button className="text-xs font-bold text-slate-300 hover:text-white underline underline-offset-4">
                View KYC & Legal Docs
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
