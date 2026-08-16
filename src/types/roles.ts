// Enhanced Types for Staff, Field Agents, Roles & Password Management

export type PermissionKey =
  | 'budget_manage'
  | 'partners_manage'
  | 'raise_funds_manage'
  | 'farmers_manage'
  | 'inputs_manage'
  | 'mechanization_manage'
  | 'harvest_manage'
  | 'retrieval_manage'
  | 'trade_manage'
  | 'money_back_manage'
  | 'settings_manage';

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  createdBy: 'superadmin' | 'staff';
  permissions: PermissionKey[];
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  userType: 'staff' | 'field_agent';
  assignedBy: string;
  phone: string;
  region: string;
  status: 'Active' | 'Inactive';
  passwordHash?: string;
  lastPasswordReset?: string;
  createdAt: string;
}
