'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { GHANA_REGIONS_DISTRICTS, COOPERATIVE_CLUSTERS } from '@/lib/ghana-data';
import { UserCheck, Plus, MapPin, Award, ShieldCheck, Trash2, X } from 'lucide-react';

export default function FarmersModule() {
  const { farmers, farms, addFarmerWithFarm, deleteEntity } = useAppState();
  const [selectedFarmer, setSelectedFarmer] = useState(farmers[0] || { id: '', fullName: 'No Farmers' });
  const [showModal, setShowModal] = useState(false);

  // Standalone Registration Form State
  const [fullName, setFullName] = useState('');
  const [ghanaCardNo, setGhanaCardNo] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  const [momoNetwork, setMomoNetwork] = useState<'MTN MoMo' | 'Telecel Cash' | 'AT Money'>('MTN MoMo');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');

  // Cascading Location Selectors
  const [selectedRegion, setSelectedRegion] = useState<string>('Northern Region');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Tamale Metro');
  const [community, setCommunity] = useState('Nyankpala');
  const [cooperativeCluster, setCooperativeCluster] = useState(COOPERATIVE_CLUSTERS[0]);

  // Farm Asset details
  const [crop, setCrop] = useState('Yellow Maize');
  const [acreage, setAcreage] = useState('12');
  const [soilType, setSoilType] = useState('Sandy Loam');
  const [tenureAgreement, setTenureAgreement] = useState<'Freehold' | 'Leasehold' | 'Sharecropping (Abunu/Abusa)'>('Freehold');
  const [gpsLat, setGpsLat] = useState('9.4005');
  const [gpsLng, setGpsLng] = useState('-0.9855');

  const handleRegionChange = (reg: string) => {
    setSelectedRegion(reg);
    const districts = GHANA_REGIONS_DISTRICTS[reg] || [];
    setSelectedDistrict(districts[0] || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFarmerWithFarm(
      {
        fullName,
        ghanaCardNo: ghanaCardNo || `GHA-${Math.floor(100000000 + Math.random() * 900000000)}-${Math.floor(Math.random() * 9)}`,
        momoNumber,
        momoNetwork,
        gender,
        community,
        district: selectedDistrict,
        region: selectedRegion.replace(' Region', ''),
        cooperativeCluster,
      },
      { crop, acreage: Number(acreage), soilType, tenureAgreement, gpsLat: Number(gpsLat), gpsLng: Number(gpsLng) }
    );
    setShowModal(false);
    setFullName('');
    setGhanaCardNo('');
    setMomoNumber('');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <UserCheck className="w-4 h-4" />
            Outgrower Profiling Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Farmer Profiles & Digitized Assets</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Register outgrower farmers with Ghana Card KYC, Mobile Money accounts, and GPS farm boundaries.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/40 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Farmer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Farmer List */}
        <div className="glass-card rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">Outgrower Registry ({farmers.length})</h3>
          <div className="space-y-2 max-h-[500px] lg:max-h-[600px] overflow-y-auto pr-1">
            {farmers.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedFarmer(f)}
                className={`p-3.5 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                  selectedFarmer?.id === f.id
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
                <div className="text-right flex items-center gap-2">
                  <div>
                    <div className="text-xs font-mono font-bold text-amber-400">{f.agronomicScore} Score</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{f.momoNetwork}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEntity('farmer', f.id);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail Pane */}
        {selectedFarmer && (
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl border border-slate-800 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-800 pb-4 gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">{selectedFarmer.fullName}</h2>
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Ghana Card Verified
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Cluster: <strong className="text-slate-200">{selectedFarmer.cooperativeCluster}</strong>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-xs text-slate-400">In-Kind Debt Burden</div>
                  <div className="text-lg sm:text-xl font-extrabold text-rose-400 font-mono">
                    GH₵ {selectedFarmer.totalLoansInKindGHS?.toLocaleString() || 0}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Ghana Card ID</div>
                  <div className="font-mono font-bold text-white text-xs mt-1">{selectedFarmer.ghanaCardNo}</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Mobile Money Account</div>
                  <div className="font-mono font-bold text-emerald-400 text-xs mt-1">
                    {selectedFarmer.momoNumber} ({selectedFarmer.momoNetwork})
                  </div>
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

              <h4 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Digitized Farm Assets
              </h4>

              {farms.filter((f) => f.farmerId === selectedFarmer.id).map((farm) => (
                <div key={farm.id} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-extrabold text-white text-sm">{farm.farmCode}</span>
                      <span className="text-xs text-slate-400 ml-2">({farm.crop} • {farm.acreage} Acres)</span>
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-max">
                      Tenure: {farm.tenureAgreement}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                    <span>GPS Lat: <strong className="text-slate-200">{farm.gpsLat}</strong></span>
                    <span>GPS Lng: <strong className="text-slate-200">{farm.gpsLng}</strong></span>
                    <span>Soil: <strong className="text-slate-200">{farm.soilType}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-xl p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg">Register Outgrower Farmer</h3>
                <p className="text-xs text-slate-400">Complete KYC & Location Profiling</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ibrahim Musah"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Ghana Card PIN</label>
                  <input
                    type="text"
                    placeholder="GHA-723491823-1"
                    value={ghanaCardNo}
                    onChange={(e) => setGhanaCardNo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Cascading Location Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Region</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    {Object.keys(GHANA_REGIONS_DISTRICTS).map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    {(GHANA_REGIONS_DISTRICTS[selectedRegion] || []).map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Community</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nyankpala"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">MoMo Number</label>
                  <input
                    type="text"
                    required
                    placeholder="0241234567"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Network</label>
                  <select
                    value={momoNetwork}
                    onChange={(e: any) => setMomoNetwork(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="MTN MoMo">MTN MoMo</option>
                    <option value="Telecel Cash">Telecel Cash</option>
                    <option value="AT Money">AT Money</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e: any) => setGender(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Cooperative Cluster</label>
                  <select
                    value={cooperativeCluster}
                    onChange={(e) => setCooperativeCluster(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                  >
                    {COOPERATIVE_CLUSTERS.map((cluster) => (
                      <option key={cluster} value={cluster}>
                        {cluster}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Tenure Agreement</label>
                  <select
                    value={tenureAgreement}
                    onChange={(e: any) => setTenureAgreement(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="Freehold">Freehold</option>
                    <option value="Leasehold">Leasehold</option>
                    <option value="Sharecropping (Abunu/Abusa)">Sharecropping (Abunu/Abusa)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <h4 className="font-bold text-white text-xs uppercase mb-2">Farm Asset GPS Boundary</h4>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Acreage</label>
                    <input
                      type="number"
                      value={acreage}
                      onChange={(e) => setAcreage(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">GPS Lat</label>
                    <input
                      type="text"
                      value={gpsLat}
                      onChange={(e) => setGpsLat(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">GPS Lng</label>
                    <input
                      type="text"
                      value={gpsLng}
                      onChange={(e) => setGpsLng(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400">
                  Register & Verify Ghana Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
