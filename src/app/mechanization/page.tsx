'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { MechanizationMap } from '@/components/map/MechanizationMap';
import { MechanizationLog } from '@/types/schema';
import {
  MapPin,
  Plus,
  Radio,
  ShieldCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  X,
  Fuel,
  Activity,
  Layers,
} from 'lucide-react';

export default function MechanizationModule() {
  const {
    mechanizationLogs,
    farmers,
    farms,
    bookMechanizationJob,
    toggleMechanizationStatus,
    updateMechanizationLog,
    deleteEntity,
  } = useAppState();

  // Modals state
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLog, setEditingLog] = useState<MechanizationLog | null>(null);

  // Dispatch Form State
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');
  const [machineryType, setMachineryType] = useState<
    'Tractor (Plowing)' | 'Harrower' | 'Planter' | 'Drone Spraying' | 'Combine Harvester'
  >('Tractor (Plowing)');
  const [operatorName, setOperatorName] = useState('Fuseini Dawuda (Tractor #4)');
  const [acresCovered, setAcresCovered] = useState('10');
  const [fuelConsumedLitres, setFuelConsumedLitres] = useState('85');
  const [ratePerAcreGHS, setRatePerAcreGHS] = useState('200');

  // Edit/Reassign Form State
  const [editMachineryType, setEditMachineryType] = useState<
    'Tractor (Plowing)' | 'Harrower' | 'Planter' | 'Drone Spraying' | 'Combine Harvester'
  >('Tractor (Plowing)');
  const [editOperatorName, setEditOperatorName] = useState('');
  const [editAcresCovered, setEditAcresCovered] = useState('0');
  const [editFuelConsumed, setEditFuelConsumed] = useState('0');
  const [editStatus, setEditStatus] = useState<'In Progress' | 'Completed'>('In Progress');

  // Lookup farmer farms
  const selectedFarmerFarms = farms.filter((f) => f.farmerId === selectedFarmerId);
  const activeFarm = selectedFarmerFarms[0] || farms[0];

  const totalCostCalculated = (Number(acresCovered) || 0) * (Number(ratePerAcreGHS) || 0);

  const handleFarmerChange = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    const farmerFarm = farms.find((f) => f.farmerId === farmerId);
    if (farmerFarm) {
      setAcresCovered(farmerFarm.acreage.toString());
    }
  };

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookMechanizationJob(
      {
        machineryType,
        operatorName,
        acresCovered: Number(acresCovered) || 10,
        fuelConsumedLitres: Number(fuelConsumedLitres) || 0,
      },
      selectedFarmerId,
      totalCostCalculated
    );
    setShowDispatchModal(false);
  };

  const openEditModal = (log: MechanizationLog) => {
    setEditingLog(log);
    setEditMachineryType(log.machineryType);
    setEditOperatorName(log.operatorName);
    setEditAcresCovered(log.acresCovered.toString());
    setEditFuelConsumed(log.fuelConsumedLitres.toString());
    setEditStatus(log.status === 'Completed' ? 'Completed' : 'In Progress');
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;
    updateMechanizationLog(editingLog.id, {
      machineryType: editMachineryType,
      operatorName: editOperatorName,
      acresCovered: Number(editAcresCovered) || editingLog.acresCovered,
      fuelConsumedLitres: Number(editFuelConsumed) || 0,
      status: editStatus as any,
    });
    setShowEditModal(false);
    setEditingLog(null);
  };

  const activeJobsCount = mechanizationLogs.filter((l) => l.status === 'In Progress').length;
  const completedJobsCount = mechanizationLogs.filter((l) => l.status === 'Completed').length;
  const totalAcresMechanized = mechanizationLogs.reduce((acc, curr) => acc + curr.acresCovered, 0);
  const totalFuelUsed = mechanizationLogs.reduce((acc, curr) => acc + curr.fuelConsumedLitres, 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <MapPin className="w-4 h-4" />
            Module 06 / GPS Telematics & Land Prep
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Live Mechanization & Fleet Tracking</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Monitor farm preparation, plowing, harrowing, planting, and drone spraying in real-time.
          </p>
        </div>

        <button
          onClick={() => setShowDispatchModal(true)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-950/40 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch Machinery</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Active Dispatches</span>
            <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">{activeJobsCount} Jobs</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Completed Jobs</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">{completedJobsCount} Jobs</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Mechanized</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">{totalAcresMechanized} Acres</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Fuel Logged</span>
            <div className="text-2xl font-extrabold text-sky-400 font-mono mt-1">{totalFuelUsed} Litres</div>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Fuel className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/30 flex items-center justify-between text-xs text-slate-300 mt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">System GPS Telematics:</span>{' '}
            <code className="text-indigo-400 font-mono">WGS84 Live Polygon Feed</code>
            <span className="text-slate-400 ml-3">Active Hubs: Tamale, Ejura, Techiman & Savelugu Clusters</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Telemetry Online
        </span>
      </div>

      {/* Geospatial Map Container */}
      <div className="space-y-3 mt-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            Active Field Machinery Telematics Map
          </h3>
          <span className="text-xs text-slate-400">
            <strong className="text-amber-400">Amber</strong> = In Progress | <strong className="text-emerald-400">Emerald</strong> = Completed
          </span>
        </div>
        <MechanizationMap logs={mechanizationLogs} />
      </div>

      {/* Job Card Operational Logs */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-white text-base">Tractor & Drone Job Cards</h3>
            <span className="text-xs text-slate-400">Telematics Logs, Operator Assignments & In-Kind Debt Debits</span>
          </div>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 font-bold">
            {mechanizationLogs.length} Job Cards Recorded
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Job Card ID</th>
                <th className="p-4">Farm Code & Owner</th>
                <th className="p-4">Machinery Activity</th>
                <th className="p-4">Operator / Equipment</th>
                <th className="p-4">Acreage & Fuel</th>
                <th className="p-4">Service Cost</th>
                <th className="p-4">Status & Quick Toggle</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mechanizationLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-indigo-400">{log.jobCardId}</td>
                  <td className="p-4 font-bold text-white">
                    <div>{log.farmerName}</div>
                    <div className="text-xs text-slate-400 font-mono font-normal">{log.farmCode}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
                      {log.machineryType}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-300 font-medium">{log.operatorName}</td>
                  <td className="p-4">
                    <div className="font-mono font-bold text-emerald-400 text-xs">{log.acresCovered} Acres</div>
                    <div className="font-mono text-amber-400 text-xs">{log.fuelConsumedLitres} Litres Fuel</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-white text-xs">
                    GH₵ {(log.costGHS || log.acresCovered * 200).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleMechanizationStatus(log.id)}
                      title="Click to toggle status"
                      className={`group flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition border ${
                        log.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                    >
                      {log.status === 'Completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                      )}
                      <span>{log.status}</span>
                      <span className="text-[10px] opacity-60 ml-1 group-hover:opacity-100">(Click to Switch)</span>
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(log)}
                        title="Modify / Reassign Machinery"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 border border-slate-700 transition text-xs flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Reassign</span>
                      </button>
                      <button
                        onClick={() => deleteEntity('mechanization', log.id)}
                        title="Delete Job Card"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Machinery Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">Dispatch Farm Machinery</h3>
                <p className="text-xs text-slate-400">Deploy tractor or drone equipment to outgrower farm polygon.</p>
              </div>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1">Select Outgrower Farmer</label>
                <select
                  value={selectedFarmerId}
                  onChange={(e) => handleFarmerChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                >
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.fullName} - {f.community} ({f.region} Region)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Assigned Farm Code:</span>
                  <strong className="text-indigo-400 font-mono">{activeFarm ? activeFarm.farmCode : 'GFM-001'}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Farm GPS Coordinates:</span>
                  <strong className="text-white font-mono">{activeFarm ? `${activeFarm.gpsLat.toFixed(4)}, ${activeFarm.gpsLng.toFixed(4)}` : '9.4005, -0.9855'}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Machinery Activity</label>
                  <select
                    value={machineryType}
                    onChange={(e: any) => setMachineryType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Tractor (Plowing)">Tractor (Plowing)</option>
                    <option value="Harrower">Harrower</option>
                    <option value="Planter">Planter</option>
                    <option value="Drone Spraying">Drone Spraying</option>
                    <option value="Combine Harvester">Combine Harvester</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Operator / Equipment</label>
                  <input
                    type="text"
                    required
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="e.g. Fuseini Dawuda / AgriFly"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Acres to Cover</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={acresCovered}
                    onChange={(e) => setAcresCovered(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Est. Fuel (L)</label>
                  <input
                    type="number"
                    required
                    value={fuelConsumedLitres}
                    onChange={(e) => setFuelConsumedLitres(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Rate/Acre (GHS)</label>
                  <input
                    type="number"
                    required
                    value={ratePerAcreGHS}
                    onChange={(e) => setRatePerAcreGHS(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex justify-between items-center">
                <span>Total Service Cost Debited to Farmer:</span>
                <strong className="font-mono font-bold text-sm text-white">GH₵ {totalCostCalculated.toLocaleString()}</strong>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-indigo-500 text-slate-950 rounded-xl hover:bg-indigo-400 transition"
                >
                  Confirm & Dispatch Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Reassign Modal */}
      {showEditModal && editingLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">Modify Job Card / Reassign</h3>
                <p className="text-xs font-mono text-indigo-400">{editingLog.jobCardId} - {editingLog.farmerName}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Machinery Activity</label>
                  <select
                    value={editMachineryType}
                    onChange={(e: any) => setEditMachineryType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Tractor (Plowing)">Tractor (Plowing)</option>
                    <option value="Harrower">Harrower</option>
                    <option value="Planter">Planter</option>
                    <option value="Drone Spraying">Drone Spraying</option>
                    <option value="Combine Harvester">Combine Harvester</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Assigned Operator</label>
                  <input
                    type="text"
                    required
                    value={editOperatorName}
                    onChange={(e) => setEditOperatorName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Acres Covered</label>
                  <input
                    type="number"
                    required
                    value={editAcresCovered}
                    onChange={(e) => setEditAcresCovered(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Fuel Used (L)</label>
                  <input
                    type="number"
                    required
                    value={editFuelConsumed}
                    onChange={(e) => setEditFuelConsumed(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1">Job Status</label>
                  <select
                    value={editStatus}
                    onChange={(e: any) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-indigo-500 text-slate-950 rounded-xl hover:bg-indigo-400 transition"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
