'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { Partner } from '@/types/schema';
import { Users, Plus, ShieldCheck, Award, Star, Phone, Mail, MapPin, FileCheck, CheckCircle2, X } from 'lucide-react';

export default function PartnersModule() {
  const { partners, addPartner } = useAppState();
  const [showModal, setShowModal] = useState(false);

  // Vetting Criteria Checklist State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Partner['category']>('Aggregator');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Tamale');
  const [contractsGHS, setContractsGHS] = useState('250000');

  // Dynamic Vetting Checklist Parameters
  const [hasBusinessRegistration, setHasBusinessRegistration] = useState(true);
  const [hasTaxClearance, setHasTaxClearance] = useState(true);
  const [hasESGPolicy, setHasESGPolicy] = useState(true);
  const [hasTraceabilityProof, setHasTraceabilityProof] = useState(true);

  // Compute Vetting Score (0-100%) dynamically
  const calculatedVettingScore =
    (hasBusinessRegistration ? 25 : 0) +
    (hasTaxClearance ? 25 : 0) +
    (hasESGPolicy ? 25 : 0) +
    (hasTraceabilityProof ? 25 : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPartner({
      name,
      category,
      contactPerson,
      phone,
      email,
      location,
      complianceScore: calculatedVettingScore,
      slaStatus: calculatedVettingScore >= 75 ? 'Active' : 'Under Review',
      totalContractsGHS: Number(contractsGHS),
      rating: (calculatedVettingScore / 20),
    });
    setShowModal(false);
    setName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Users className="w-4 h-4" />
            Partners / Ecosystem Partner Directory
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Partner Onboarding & SLA Vetting</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage input suppliers, mechanization service providers, off-takers, and logistics partners.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-amber-950/40 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard & Vet Partner</span>
        </button>
      </div>

      {/* Vetting Score Explanation Bar */}
      <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">System Vetting Algorithm:</span>{' '}
            <code className="text-amber-400 font-mono">Business Reg (25%) + Tax Clearance (25%) + ESG Policy (25%) + Traceability (25%)</code>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
          Algorithmic Scoring Active
        </span>
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {partners.map((p) => (
          <div key={p.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {p.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {p.complianceScore}% Vetted
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-lg">{p.name}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {p.location}
                </div>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contact: <strong>{p.contactPerson}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{p.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-mono">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{p.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Contracts Value:</span>
              <strong className="text-white font-mono">GH₵ {p.totalContractsGHS.toLocaleString()}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with Vetting Score Checklist */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-lg">Onboard & Vet Agribusiness Partner</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Company / Partner Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ghana Cocoa & Grain Logistics Ltd"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  >
                    <option value="Input Supplier">Input Supplier</option>
                    <option value="Mechanization Provider">Mechanization Provider</option>
                    <option value="Aggregator">Aggregator</option>
                    <option value="Off-Taker">Off-Taker</option>
                    <option value="Financial Institution">Financial Institution</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">HQ Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                />
              </div>

              {/* Dynamic Vetting Criteria Score Checklist */}
              <div>
                <label className="block text-xs font-bold uppercase text-amber-400 mb-2">
                  System SLA Vetting Criteria (Score Checklist)
                </label>
                <div className="space-y-2 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
                    <span>Valid Registrar General Business License (25%)</span>
                    <input
                      type="checkbox"
                      checked={hasBusinessRegistration}
                      onChange={(e) => setHasBusinessRegistration(e.target.checked)}
                      className="w-4 h-4 accent-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
                    <span>Ghana Revenue Authority Tax Clearance Certificate (25%)</span>
                    <input
                      type="checkbox"
                      checked={hasTaxClearance}
                      onChange={(e) => setHasTaxClearance(e.target.checked)}
                      className="w-4 h-4 accent-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
                    <span>ESG & Fair Trade Compliance Policy (25%)</span>
                    <input
                      type="checkbox"
                      checked={hasESGPolicy}
                      onChange={(e) => setHasESGPolicy(e.target.checked)}
                      className="w-4 h-4 accent-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
                    <span>Supply Chain Digital Traceability SLA (25%)</span>
                    <input
                      type="checkbox"
                      checked={hasTraceabilityProof}
                      onChange={(e) => setHasTraceabilityProof(e.target.checked)}
                      className="w-4 h-4 accent-amber-500"
                    />
                  </label>
                </div>
              </div>

              {/* Computed Vetting Score Display */}
              <div className="p-3 bg-slate-900 rounded-xl text-xs flex justify-between items-center border border-slate-800">
                <span className="text-slate-400 font-bold uppercase">Calculated Vetting Score:</span>
                <span className="text-emerald-400 font-mono font-extrabold text-base">{calculatedVettingScore}%</span>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400">
                  Save Partner & Issue SLA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
