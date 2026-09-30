'use client';

import React, { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { GHANA_REGIONS_DISTRICTS, COOPERATIVE_CLUSTERS } from '@/lib/ghana-data';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import {
  UserCheck,
  Plus,
  MapPin,
  Award,
  ShieldCheck,
  Trash2,
  X,
  UploadCloud,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  Search,
  Layers,
} from 'lucide-react';

export default function FarmersModule() {
  const { farmers, farms, addFarmerWithFarm, deleteEntity } = useAppState();
  const [selectedFarmer, setSelectedFarmer] = useState(farmers[0] || { id: '', fullName: 'No Farmers' });
  const [showModal, setShowModal] = useState(false);
  const [farmerSearchQuery, setFarmerSearchQuery] = useState('');

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

  // GeoJSON state
  const [geoJsonInput, setGeoJsonInput] = useState('');
  const [parsedPolygon, setParsedPolygon] = useState<[number, number][] | null>(null);
  const [geoJsonStatus, setGeoJsonStatus] = useState<{ valid: boolean; message: string } | null>(null);

  const handleRegionChange = (reg: string) => {
    setSelectedRegion(reg);
    const districts = GHANA_REGIONS_DISTRICTS[reg] || [];
    setSelectedDistrict(districts[0] || '');
  };

  // Helper to parse and calculate properties from GeoJSON
  const parseGeoJsonData = (rawText: string) => {
    try {
      const parsed = JSON.parse(rawText);
      let rawCoords: number[][] = [];

      if (parsed.type === 'FeatureCollection' && parsed.features?.[0]?.geometry) {
        const geom = parsed.features[0].geometry;
        if (geom.type === 'Polygon') rawCoords = geom.coordinates[0];
        else if (geom.type === 'MultiPolygon') rawCoords = geom.coordinates[0][0];
      } else if (parsed.type === 'Feature' && parsed.geometry) {
        const geom = parsed.geometry;
        if (geom.type === 'Polygon') rawCoords = geom.coordinates[0];
        else if (geom.type === 'MultiPolygon') rawCoords = geom.coordinates[0][0];
      } else if (parsed.type === 'Polygon' && Array.isArray(parsed.coordinates)) {
        rawCoords = parsed.coordinates[0];
      } else if (Array.isArray(parsed) && parsed.length > 2) {
        rawCoords = parsed;
      }

      if (rawCoords.length >= 3) {
        // Standard GeoJSON is [lng, lat] - convert to Leaflet [lat, lng]
        const leafletCoords: [number, number][] = rawCoords.map((pt) => {
          // If first number is between -180 and 180 and second is between -90 and 90
          const lng = pt[0];
          const lat = pt[1];
          return [lat, lng];
        });

        // Compute centroid
        const avgLat = leafletCoords.reduce((acc, c) => acc + c[0], 0) / leafletCoords.length;
        const avgLng = leafletCoords.reduce((acc, c) => acc + c[1], 0) / leafletCoords.length;

        // Approximate acreage calculation using spherical polygon area
        let areaSqMeters = 0;
        if (leafletCoords.length > 2) {
          const numPoints = leafletCoords.length;
          let total = 0;
          for (let i = 0; i < numPoints; i++) {
            const j = (i + 1) % numPoints;
            const p1 = leafletCoords[i];
            const p2 = leafletCoords[j];
            // Convert to approximate meters based on lat center
            const x1 = (p1[1] * Math.PI * 6378137 * Math.cos((avgLat * Math.PI) / 180)) / 180;
            const y1 = (p1[0] * Math.PI * 6378137) / 180;
            const x2 = (p2[1] * Math.PI * 6378137 * Math.cos((avgLat * Math.PI) / 180)) / 180;
            const y2 = (p2[0] * Math.PI * 6378137) / 180;
            total += x1 * y2 - x2 * y1;
          }
          areaSqMeters = Math.abs(total / 2);
        }
        const calculatedAcres = areaSqMeters > 0 ? (areaSqMeters / 4046.86).toFixed(1) : acreage;

        setParsedPolygon(leafletCoords);
        setGpsLat(avgLat.toFixed(4));
        setGpsLng(avgLng.toFixed(4));
        if (Number(calculatedAcres) > 0) {
          setAcreage(calculatedAcres);
        }

        setGeoJsonStatus({
          valid: true,
          message: `Polygon mapped successfully (${leafletCoords.length} vertices, ~${calculatedAcres} Acres, Centroid ${avgLat.toFixed(4)}, ${avgLng.toFixed(4)})`,
        });
      } else {
        setGeoJsonStatus({
          valid: false,
          message: 'GeoJSON must contain a Polygon with at least 3 coordinate points.',
        });
      }
    } catch {
      setGeoJsonStatus({
        valid: false,
        message: 'Invalid GeoJSON syntax. Please provide a valid GeoJSON Polygon or FeatureCollection.',
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setGeoJsonInput(content);
      parseGeoJsonData(content);
    };
    reader.readAsText(file);
  };

  const loadSampleGeoJson = () => {
    const sample = {
      type: 'Feature',
      properties: {
        farm: 'Nyankpala Outgrower Block A',
        cluster: 'Tamale West',
        soil: 'Sandy Loam',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.9885, 9.4035],
            [-0.9825, 9.4045],
            [-0.9815, 9.3975],
            [-0.9875, 9.3965],
            [-0.9885, 9.4035],
          ],
        ],
      },
    };
    const sampleStr = JSON.stringify(sample, null, 2);
    setGeoJsonInput(sampleStr);
    parseGeoJsonData(sampleStr);
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
      {
        crop,
        acreage: Number(acreage) || 5,
        soilType,
        tenureAgreement,
        gpsLat: Number(gpsLat) || 9.4005,
        gpsLng: Number(gpsLng) || -0.9855,
        polygonCoordinates: parsedPolygon || undefined,
        geoJsonRaw: geoJsonInput || undefined,
      }
    );
    setShowModal(false);
    setFullName('');
    setGhanaCardNo('');
    setMomoNumber('');
    setGeoJsonInput('');
    setParsedPolygon(null);
    setGeoJsonStatus(null);
  };

  // Filtered Farmer Registry
  const filteredFarmers = farmers.filter(
    (f) =>
      f.fullName.toLowerCase().includes(farmerSearchQuery.toLowerCase()) ||
      f.community.toLowerCase().includes(farmerSearchQuery.toLowerCase()) ||
      f.region.toLowerCase().includes(farmerSearchQuery.toLowerCase()) ||
      f.ghanaCardNo.toLowerCase().includes(farmerSearchQuery.toLowerCase()) ||
      f.cooperativeCluster.toLowerCase().includes(farmerSearchQuery.toLowerCase())
  );

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
            Register outgrower farmers with Ghana Card KYC, Mobile Money, and uploaded GeoJSON farm boundaries for mechanization.
          </p>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            setGeoJsonStatus(null);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/40 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Farmer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Farmer List with Search Filter */}
        <div className="glass-card rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Outgrower Registry ({farmers.length})</h3>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={farmerSearchQuery}
              onChange={(e) => setFarmerSearchQuery(e.target.value)}
              placeholder="Search by name, community, Ghana card..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2 max-h-[500px] lg:max-h-[600px] overflow-y-auto pr-1">
            {filteredFarmers.length > 0 ? (
              filteredFarmers.map((f) => (
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
                      title="Delete Farmer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">No matching farmers found</div>
            )}
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
                Digitized Farm Assets & GeoJSON Boundaries
              </h4>

              {farms.filter((f) => f.farmerId === selectedFarmer.id).map((farm) => (
                <div key={farm.id} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-extrabold text-white text-sm">{farm.farmCode}</span>
                      <span className="text-xs text-slate-400 ml-2">({farm.crop} • {farm.acreage} Acres)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {farm.polygonCoordinates && farm.polygonCoordinates.length > 0 ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          GeoJSON Mapped ({farm.polygonCoordinates.length} vertices)
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Point Coordinate Only
                        </span>
                      )}
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {farm.tenureAgreement}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                    <span>GPS Centroid Lat: <strong className="text-slate-200">{farm.gpsLat}</strong></span>
                    <span>GPS Centroid Lng: <strong className="text-slate-200">{farm.gpsLng}</strong></span>
                    <span>Soil: <strong className="text-slate-200">{farm.soilType}</strong></span>
                  </div>

                  {farm.polygonCoordinates && farm.polygonCoordinates.length > 0 && (
                    <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-400">
                      <div className="text-slate-500 font-bold mb-1">Mechanization Area Boundary Polygon:</div>
                      <div className="truncate text-slate-300">
                        {farm.polygonCoordinates.map((pt) => `[${pt[0]}, ${pt[1]}]`).join(' → ')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Registration Modal with GeoJSON Upload */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-2xl p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg">Register Outgrower Farmer & Farm Boundary</h3>
                <p className="text-xs text-slate-400">KYC Profiling with GIS GeoJSON Boundary Ingestion</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Full Name *</label>
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

              {/* Cascading Location Selectors with Searchable Select */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <SearchableSelect
                    label="Region"
                    options={Object.keys(GHANA_REGIONS_DISTRICTS).map((reg) => ({
                      value: reg,
                      label: reg,
                    }))}
                    value={selectedRegion}
                    onChange={handleRegionChange}
                  />
                </div>
                <div>
                  <SearchableSelect
                    label="District"
                    options={(GHANA_REGIONS_DISTRICTS[selectedRegion] || []).map((dist) => ({
                      value: dist,
                      label: dist,
                    }))}
                    value={selectedDistrict}
                    onChange={setSelectedDistrict}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Community *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nyankpala"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">MoMo Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="0241234567"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none font-mono focus:border-emerald-500"
                  />
                </div>
                <div>
                  <SearchableSelect
                    label="MoMo Network"
                    options={[
                      { value: 'MTN MoMo', label: 'MTN MoMo', badge: 'MTN' },
                      { value: 'Telecel Cash', label: 'Telecel Cash', badge: 'Telecel' },
                      { value: 'AT Money', label: 'AT Money', badge: 'AT' },
                    ]}
                    value={momoNetwork}
                    onChange={(v: any) => setMomoNetwork(v)}
                  />
                </div>
                <div>
                  <SearchableSelect
                    label="Gender"
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                    ]}
                    value={gender}
                    onChange={(v: any) => setGender(v)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <SearchableSelect
                    label="Cooperative Cluster"
                    options={COOPERATIVE_CLUSTERS.map((c) => ({
                      value: c,
                      label: c,
                    }))}
                    value={cooperativeCluster}
                    onChange={setCooperativeCluster}
                  />
                </div>
                <div>
                  <SearchableSelect
                    label="Tenure Agreement"
                    options={[
                      { value: 'Freehold', label: 'Freehold' },
                      { value: 'Leasehold', label: 'Leasehold' },
                      { value: 'Sharecropping (Abunu/Abusa)', label: 'Sharecropping (Abunu/Abusa)' },
                    ]}
                    value={tenureAgreement}
                    onChange={(v: any) => setTenureAgreement(v)}
                  />
                </div>
              </div>

              {/* GeoJSON Upload & GIS Farm Boundary Section */}
              <div className="border-t border-slate-800 pt-3 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-white text-xs uppercase">
                      Farm Asset GeoJSON Upload (Mapped for Mechanization)
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={loadSampleGeoJson}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-semibold self-start sm:self-auto"
                  >
                    + Load Sample GeoJSON
                  </button>
                </div>

                {/* File Dropzone / Paste Area */}
                <div className="bg-slate-900/90 border border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-3.5 space-y-3 transition">
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition">
                      <UploadCloud className="w-4 h-4 text-emerald-400" />
                      <span>Choose .geojson / .json file</span>
                      <input
                        type="file"
                        accept=".geojson,.json,application/json"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-400">or paste raw GeoJSON below:</span>
                  </div>

                  <textarea
                    rows={3}
                    placeholder='{"type": "Polygon", "coordinates": [[[lng1, lat1], [lng2, lat2], [lng3, lat3], [lng1, lat1]]]}'
                    value={geoJsonInput}
                    onChange={(e) => {
                      setGeoJsonInput(e.target.value);
                      if (e.target.value.trim()) {
                        parseGeoJsonData(e.target.value);
                      } else {
                        setGeoJsonStatus(null);
                        setParsedPolygon(null);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500"
                  />

                  {geoJsonStatus && (
                    <div
                      className={`p-2.5 rounded-lg text-xs flex items-center gap-2 border ${
                        geoJsonStatus.valid
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {geoJsonStatus.valid ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{geoJsonStatus.message}</span>
                    </div>
                  )}
                </div>

                {/* Acreage and Centroid Auto-filled Coordinates */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Acreage (Acres)</label>
                    <input
                      type="number"
                      value={acreage}
                      onChange={(e) => setAcreage(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">GPS Lat (Centroid)</label>
                    <input
                      type="text"
                      value={gpsLat}
                      onChange={(e) => setGpsLat(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none font-mono focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">GPS Lng (Centroid)</label>
                    <input
                      type="text"
                      value={gpsLng}
                      onChange={(e) => setGpsLng(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none font-mono focus:border-emerald-500"
                    />
                  </div>
                </div>
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
                  className="px-5 py-2 text-xs font-bold bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition"
                >
                  Register & Digitize Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
