'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../layout-wrapper';
import { useAppState, ALL_PERMISSIONS } from '@/context/AppStateContext';
import { PermissionKey, StaffUser } from '@/types/roles';
import {
  Settings,
  ShieldCheck,
  Database,
  Users,
  Plus,
  Key,
  Edit,
  Trash2,
  X,
  UserPlus,
  Lock,
  CheckCircle2,
  Save,
  ShieldAlert,
  RotateCcw,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const {
    databaseUrl,
    updateDatabaseUrl,
    customRoles,
    staffUsers,
    activeUserPerspective,
    addCustomRole,
    addStaffUser,
    updateStaffUser,
    resetUserPassword,
    deleteStaffUser,
  } = useAppState();

  const isSuperAdmin = activeUserPerspective === 'superadmin';
  const isStaff = activeUserPerspective === 'staff';
  const isFieldAgent = activeUserPerspective === 'field_agent';

  useEffect(() => {
    if (isFieldAgent) {
      router.push('/');
    }
  }, [isFieldAgent, router]);

  // Database URL Edit State
  const [dbUrlInput, setDbUrlInput] = useState(databaseUrl);
  const [dbSavedMessage, setDbSavedMessage] = useState(false);

  // Modals state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [selectedResetUser, setSelectedResetUser] = useState<StaffUser | null>(null);

  // Password Reset State
  const [customResetPass, setCustomResetPass] = useState('');
  const [generatedPassResult, setGeneratedPassResult] = useState<string | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);

  // New Custom Role Form State
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionKey[]>([]);

  // User Form State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userRegion, setUserRegion] = useState('Northern Region');
  const [selectedRoleId, setSelectedRoleId] = useState(customRoles[1]?.id || '');
  const [createdUserType, setCreatedUserType] = useState<'staff' | 'field_agent'>(
    isSuperAdmin ? 'staff' : 'field_agent'
  );

  const handleSaveDbUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    updateDatabaseUrl(dbUrlInput);
    setDbSavedMessage(true);
    setTimeout(() => setDbSavedMessage(false), 3000);
  };

  const handlePermissionToggle = (permKey: PermissionKey) => {
    if (selectedPermissions.includes(permKey)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permKey));
    } else {
      setSelectedPermissions([...selectedPermissions, permKey]);
    }
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomRole({
      name: roleName,
      description: roleDescription,
      permissions: selectedPermissions,
    });
    setShowRoleModal(false);
    setRoleName('');
    setRoleDescription('');
    setSelectedPermissions([]);
  };

  const openCreateUserModal = () => {
    setEditingUser(null);
    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setUserRegion('Northern Region');
    setSelectedRoleId(customRoles[1]?.id || '');
    setCreatedUserType(isSuperAdmin ? 'staff' : 'field_agent');
    setShowUserModal(true);
  };

  const openEditUserModal = (user: StaffUser) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserPhone(user.phone);
    setUserRegion(user.region);
    setSelectedRoleId(user.roleId);
    setCreatedUserType(user.userType);
    setShowUserModal(true);
  };

  const openResetPasswordModal = (user: StaffUser) => {
    setSelectedResetUser(user);
    setCustomResetPass('');
    setGeneratedPassResult(null);
    setCopiedPass(false);
    setShowResetModal(true);
  };

  const handleExecutePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResetUser) return;
    const newPass = resetUserPassword(selectedResetUser.id, customResetPass || undefined);
    setGeneratedPassResult(newPass);
  };

  const handleCopyPassword = () => {
    if (generatedPassResult) {
      navigator.clipboard.writeText(generatedPassResult);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2500);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateStaffUser(editingUser.id, {
        name: userName,
        email: userEmail,
        phone: userPhone,
        region: userRegion,
        roleId: selectedRoleId,
        userType: createdUserType,
      });
    } else {
      addStaffUser({
        name: userName,
        email: userEmail,
        phone: userPhone,
        region: userRegion,
        roleId: selectedRoleId,
        userType: isSuperAdmin ? createdUserType : 'field_agent',
      });
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  if (isFieldAgent) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center glass-card rounded-2xl border border-rose-500/30 space-y-3">
          <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Access Denied (403 Protected Route)</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Field Agents do not have permission to view or modify system settings, database URLs, or role assignments.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Settings className="w-4 h-4" />
            System Utility / Configuration & RBAC
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Settings & Role Management</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Configure live PostgreSQL database links, define custom roles, edit staff accounts, and reset user passwords.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Active Session: <strong className="text-white uppercase">{activeUserPerspective}</strong></span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Database URL Settings */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            Live PostgreSQL Connection String
          </h3>
          {!isSuperAdmin && (
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> Read-Only for Staff (Super Admin Access Required to Edit)
            </span>
          )}
        </div>

        <form onSubmit={handleSaveDbUrl} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              disabled={!isSuperAdmin}
              value={dbUrlInput}
              onChange={(e) => setDbUrlInput(e.target.value)}
              className={`w-full font-mono text-xs px-4 py-3 rounded-xl border transition outline-none ${
                isSuperAdmin
                  ? 'bg-slate-900 border-slate-700 text-emerald-400 focus:border-emerald-500'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            />
          </div>

          {isSuperAdmin && (
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">
                Supports Supabase, Neon, AWS RDS, or self-hosted PostgreSQL.
              </span>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Database URL</span>
              </button>
            </div>
          )}

          {dbSavedMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Database Connection URL successfully updated & persisted!</span>
            </div>
          )}
        </form>
      </div>

      {/* SECTION 2: Dynamic User Provisioning, Editing & Password Reset */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" />
              Staff & Field Agent Registry
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isSuperAdmin
                ? 'Super Admin can create/edit Staff members and Field Agents, and reset passwords.'
                : 'Staff can provision Field Agents and reset Field Agent passwords.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSuperAdmin && (
              <button
                onClick={() => setShowRoleModal(true)}
                className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Create Custom Role</span>
              </button>
            )}

            <button
              onClick={openCreateUserModal}
              className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSuperAdmin ? 'Provision Staff / Field Agent' : 'Create Field Agent'}</span>
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">User Name & Email</th>
                <th className="p-4">User Category</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Region</th>
                <th className="p-4">Password Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {staffUsers.map((u) => {
                const canManageThisUser = isSuperAdmin || (isStaff && u.userType === 'field_agent');
                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-bold text-white">
                      <div>{u.name}</div>
                      <div className="text-xs text-slate-400 font-mono font-normal">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          u.userType === 'staff'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {u.userType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-200">{u.roleName}</td>
                    <td className="p-4 text-xs text-slate-300">{u.region}</td>
                    <td className="p-4 text-xs text-slate-400 font-mono">
                      {u.lastPasswordReset ? `Reset ${u.lastPasswordReset}` : 'Active'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {canManageThisUser && (
                          <>
                            <button
                              onClick={() => openEditUserModal(u)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500 transition"
                              title="Edit User Profile & Role"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openResetPasswordModal(u)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 hover:bg-amber-500/10 transition"
                              title="Reset Forgotten Password"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteStaffUser(u.id)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/50 transition"
                              title="Deactivate Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {!canManageThisUser && (
                          <span className="text-xs text-slate-500 italic">Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Dynamic Role & Feature Permissions Matrix */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-400" />
          Active Feature Role Definitions & Access Rights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {customRoles.map((r) => (
            <div key={r.id} className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-white text-base">{r.name}</h4>
                  <div className="text-xs text-slate-400">{r.description}</div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  By {r.createdBy}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Feature Permissions:</div>
                <div className="flex flex-wrap gap-1">
                  {r.permissions.map((pKey) => {
                    const permObj = ALL_PERMISSIONS.find((p) => p.key === pKey);
                    return (
                      <span
                        key={pKey}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        {permObj ? permObj.module : pKey}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Reset Forgotten Password */}
      {showResetModal && selectedResetUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">Reset User Password</h3>
                <p className="text-xs text-amber-400">Target User: {selectedResetUser.name} ({selectedResetUser.email})</p>
              </div>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!generatedPassResult ? (
              <form onSubmit={handleExecutePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    New Password (Leave blank to generate secure token)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GfM#2026@SecurePass"
                    value={customResetPass}
                    onChange={(e) => setCustomResetPass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono outline-none"
                  />
                </div>

                <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-400 border border-slate-800">
                  Executing this reset will override the current login credentials and dispatch a temporary password reset log.
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowResetModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 font-bold flex items-center gap-1.5">
                    <Key className="w-4 h-4" />
                    <span>Reset & Issue Credentials</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-sm font-bold text-white">Password Successfully Reset!</div>
                  <p className="text-xs text-slate-300">Share these temporary login credentials with {selectedResetUser.name}:</p>
                  
                  <div className="p-3 bg-slate-900 rounded-xl font-mono text-sm text-emerald-400 font-bold flex items-center justify-between border border-slate-800 mt-2">
                    <span>{generatedPassResult}</span>
                    <button
                      onClick={handleCopyPassword}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                    >
                      {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPass ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="px-5 py-2 text-xs font-bold bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Create Custom Role */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-lg">Create Custom Feature Role</h3>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aggregation Logistics Supervisor"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="Describe scope of responsibilities"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Select Accessible Feature Modules</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800 max-h-56 overflow-y-auto">
                  {ALL_PERMISSIONS.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.key);
                    return (
                      <div
                        key={perm.key}
                        onClick={() => handlePermissionToggle(perm.key)}
                        className={`p-2.5 rounded-lg cursor-pointer text-xs font-semibold flex items-center justify-between border transition ${
                          isChecked
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <span>{perm.module}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowRoleModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400">
                  Save Role Definition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Create / Edit User Account */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-lg">
                {editingUser
                  ? `Edit User: ${editingUser.name}`
                  : isSuperAdmin
                  ? 'Provision Staff / Field Agent'
                  : 'Create Field Agent'}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yaw Opare"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-sky-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="user@growforme.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+233 24 111 2233"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
              </div>

              {isSuperAdmin && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">User Account Category</label>
                  <select
                    value={createdUserType}
                    onChange={(e: any) => setCreatedUserType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  >
                    <option value="staff">Staff Member (Regional Manager)</option>
                    <option value="field_agent">Field Agent (Community Officer)</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Assign Role</label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  >
                    {customRoles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Assigned Region</label>
                  <input
                    type="text"
                    required
                    value={userRegion}
                    onChange={(e) => setUserRegion(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-sky-500 text-slate-950 rounded-xl hover:bg-sky-400 font-bold">
                  {editingUser ? 'Save User Changes' : 'Provision User Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
