'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { mockFarmers, mockFarms } from '@/lib/mock-data';
import { UserCheck, Plus, CreditCard, MapPin, Award, Phone, ShieldCheck, CheckCircle } from 'lucide-react';

export default function FarmersModule() {
  const [selectedFarmer, setSelectedFarmer] = useState(mockFarmers[0]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <UserCheck className="w-4 h-4" />
            Module 04 / Outgrower KYC & Profiling
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Farmer Profiles & Digitized Assets</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Register outgrower farmers with Ghana Card KYC, Mobile Money details, and GPS farm polygons.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/40 text-sm">
          <Plus className="w-4 h-4" />
          <span>Register New Farmer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Farmer List */}
        <div className="glass-card rounded-2xl border border-slate-800 p-5 space-y-4">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">Outgrower Registry</h3>
          <div className="space-y-2">
            {mockFarmers.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedFarmer(f)}
                className={`p-3.5 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                  selectedFarmer.id === f.id
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-100 flex items-center gap-2">
                    <span>{f.fullName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                      {f.gender}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {f.community}, {f.region} • <strong className="text-emerald-400">{f.totalAcreage} Acres</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-amber-400">{f.agronomicScore} Score</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{f.momoNetwork}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Farmer Profile Detail & Asset Mapping */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl border border-slate-800 p-6">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-white">{selectedFarmer.fullName}</h2>
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Ghana Card Verified
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Cooperative Cluster: <strong className="text-slate-200">{selectedFarmer.cooperativeCluster}</strong>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">In-Kind Debt Burden</div>
                <div className="text-xl font-extrabold text-rose-400 font-mono">
                  GH₵ {selectedFarmer.totalLoansInKindGHS.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Profile Grid Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Ghana Card ID</div>
                <div className="font-mono font-bold text-white text-xs mt-1">{selectedFarmer.ghanaCardNo}</div>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Mobile Money Account</div>
                <div className="font-mono font-bold text-emerald-400 text-xs mt-1">{selectedFarmer.momoNumber} ({selectedFarmer.momoNetwork})</div>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Agronomic Score</div>
                <div className="font-bold text-amber-400 text-xs mt-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {selectedFarmer.agronomicScore} / 100
                </div>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">District / Region</div>
                <div className="font-bold text-slate-200 text-xs mt-1">{selectedFarmer.district}, {selectedFarmer.region}</div>
              </div>
            </div>

            {/* Digitized Farm Asset Mapping */}
            <h4 className="font-bold text-white text-base mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Digitized Farm Boundary & Geo-Polygon
            </h4>

            {mockFarms.filter((f) => f.farmerId === selectedFarmer.id).map((farm) => (
              <div key={farm.id} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-white text-sm">{farm.farmCode}</span>
                    <span className="text-xs text-slate-400 ml-2">({farm.crop} • {farm.acreage} Acres)</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Tenure: {farm.tenureAgreement}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-4">
                  <span>GPS Lat: <strong className="text-slate-200">{farm.gpsLat}</strong></span>
                  <span>GPS Lng: <strong className="text-slate-200">{farm.gpsLng}</strong></span>
                  <span>Soil Type: <strong className="text-slate-200">{farm.soilType}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
