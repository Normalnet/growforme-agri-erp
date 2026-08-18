'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SeasonCycle,
  BudgetItem,
  Partner,
  FundingCampaign,
  Investment,
  Farmer,
  FarmAsset,
  InputInventory,
  InputDisbursement,
  MechanizationLog,
  HarvestBatch,
  CommodityRetrieval,
  TradeOrder,
  SettlementRecord,
} from '@/types/schema';
import { CustomRole, StaffUser, PermissionKey } from '@/types/roles';
import {
  mockCycles,
  mockBudgetItems,
  mockPartners,
  mockCampaigns,
  mockInvestments,
  mockFarmers,
  mockFarms,
  mockInputs,
  mockDisbursements,
  mockMechanizationLogs,
  mockHarvestBatches,
  mockCommodityRetrievals,
  mockTradeOrders,
  mockSettlements,
} from '@/lib/mock-data';

export const ALL_PERMISSIONS: { key: PermissionKey; label: string; module: string }[] = [
  { key: 'budget_manage', label: 'Manage Budgets & Line Items', module: 'Module 1: Budget' },
  { key: 'partners_manage', label: 'Onboard & Vet Partners', module: 'Module 2: Partners' },
  { key: 'raise_funds_manage', label: 'Manage Campaigns & Escrow', module: 'Module 3: Raise Funds' },
  { key: 'farmers_manage', label: 'Register Farmers & GIS Assets', module: 'Module 4: Farmers' },
  { key: 'inputs_manage', label: 'Issue Input Vouchers & Stock', module: 'Module 5: Inputs' },
  { key: 'mechanization_manage', label: 'Dispatch Machinery & Telematics', module: 'Module 6: Mechanization' },
  { key: 'harvest_manage', label: 'Log Harvest Weighing & EUDR', module: 'Module 7: Harvest' },
  { key: 'retrieval_manage', label: 'Generate Waybills & Loan Offset', module: 'Module 8: Retrieval' },
  { key: 'trade_manage', label: 'Execute Off-Taker Trade Contracts', module: 'Module 9: Trade' },
  { key: 'money_back_manage', label: 'Execute Revenue Waterfall & MoMo', module: 'Module 10: Money Back' },
  { key: 'settings_manage', label: 'System Settings & DB Config', module: 'Settings' },
];

export const defaultRoles: CustomRole[] = [
  {
    id: 'role_superadmin',
    name: 'Super Admin',
    description: 'Full unconstrained access to all system modules, DB URLs, and role management.',
    createdBy: 'superadmin',
    permissions: ALL_PERMISSIONS.map((p) => p.key),
  },
  {
    id: 'role_staff_regional',
    name: 'Regional Staff Manager',
    description: 'Can manage outgrower operations, issue vouchers, and create Field Agents.',
    createdBy: 'superadmin',
    permissions: ['farmers_manage', 'inputs_manage', 'mechanization_manage', 'harvest_manage', 'retrieval_manage'],
  },
  {
    id: 'role_field_agent',
    name: 'Field Officer',
    description: 'Registers farmers and records farm-gate harvests in community clusters.',
    createdBy: 'staff',
    permissions: ['farmers_manage', 'harvest_manage'],
  },
];

export const defaultStaffUsers: StaffUser[] = [
  {
    id: 'stf_01',
    name: 'Abena Osei',
    email: 'abena.osei@growforme.com',
    roleId: 'role_staff_regional',
    roleName: 'Regional Staff Manager',
    userType: 'staff',
    assignedBy: 'Super Admin',
    phone: '+233 24 555 0192',
    region: 'Northern Region',
    status: 'Active',
    lastPasswordReset: '2026-01-15',
    createdAt: '2026-01-15',
  },
  {
    id: 'stf_02',
    name: 'Kwame Boateng',
    email: 'kwame.b@growforme.com',
    roleId: 'role_field_agent',
    roleName: 'Field Officer',
    userType: 'field_agent',
    assignedBy: 'Abena Osei (Staff)',
    phone: '+233 20 112 8899',
    region: 'Ashanti Region',
    status: 'Active',
    lastPasswordReset: '2026-02-01',
    createdAt: '2026-02-01',
  },
];

interface AppStateContextType {
  cycles: SeasonCycle[];
  budgetItems: BudgetItem[];
  partners: Partner[];
  campaigns: FundingCampaign[];
  investments: Investment[];
  farmers: Farmer[];
  farms: FarmAsset[];
  inputs: InputInventory[];
  disbursements: InputDisbursement[];
  mechanizationLogs: MechanizationLog[];
  harvestBatches: HarvestBatch[];
  retrievals: CommodityRetrieval[];
  tradeOrders: TradeOrder[];
  settlements: SettlementRecord[];

  databaseUrl: string;
  updateDatabaseUrl: (newUrl: string) => void;

  customRoles: CustomRole[];
  staffUsers: StaffUser[];
  activeUserPerspective: 'superadmin' | 'staff' | 'field_agent';
  setActiveUserPerspective: (perspective: 'superadmin' | 'staff' | 'field_agent') => void;

  addCustomRole: (roleData: Partial<CustomRole>) => void;
  addStaffUser: (userData: Partial<StaffUser>) => void;
  updateStaffUser: (id: string, updatedData: Partial<StaffUser>) => void;
  resetUserPassword: (id: string, newPassword?: string) => string;
  deleteStaffUser: (id: string) => void;

  addCycleWithCampaign: (cycleData: Partial<SeasonCycle>, budgetItemsData: Partial<BudgetItem>[]) => void;
  addCycleOnly: (cycleData: Partial<SeasonCycle>) => void;
  updateCycleTimeline: (id: string, updatedData: Partial<SeasonCycle>) => void;
  addFundingCampaign: (campaignData: Partial<FundingCampaign>) => void;
  addFarmerWithFarm: (farmerData: Partial<Farmer>, farmData: Partial<FarmAsset>) => void;
  addPartner: (partnerData: Partial<Partner>) => void;
  addInvestment: (investmentData: Partial<Investment>) => void;
  issueInputVoucher: (voucherData: Partial<InputDisbursement>, farmerId: string, costGHS: number) => void;
  bookMechanizationJob: (jobData: Partial<MechanizationLog>, farmerId: string, costGHS: number) => void;
  toggleMechanizationStatus: (id: string) => void;
  updateMechanizationLog: (id: string, updatedData: Partial<MechanizationLog>) => void;
  logHarvestBatch: (batchData: Partial<HarvestBatch>) => void;
  createWaybillRetrieval: (retrievalData: Partial<CommodityRetrieval>, farmerId: string, bags: number, valueGHS: number) => void;
  createTradeContract: (tradeData: Partial<TradeOrder>) => void;
  executeWaterfallSettlement: (cycleName: string, grossRevenue: number) => void;

  deleteEntity: (type: string, id: string) => void;
  resetToDefaultSeed: () => void;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

const STORAGE_KEY = 'growforme_erp_app_state_v4';

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cycles, setCycles] = useState<SeasonCycle[]>(mockCycles);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(mockBudgetItems);
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [campaigns, setCampaigns] = useState<FundingCampaign[]>(mockCampaigns);
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  const [farmers, setFarmers] = useState<Farmer[]>(mockFarmers);
  const [farms, setFarms] = useState<FarmAsset[]>(mockFarms);
  const [inputs, setInputs] = useState<InputInventory[]>(mockInputs);
  const [disbursements, setDisbursements] = useState<InputDisbursement[]>(mockDisbursements);
  const [mechanizationLogs, setMechanizationLogs] = useState<MechanizationLog[]>(mockMechanizationLogs);
  const [harvestBatches, setHarvestBatches] = useState<HarvestBatch[]>(mockHarvestBatches);
  const [retrievals, setRetrievals] = useState<CommodityRetrieval[]>(mockCommodityRetrievals);
  const [tradeOrders, setTradeOrders] = useState<TradeOrder[]>(mockTradeOrders);
  const [settlements, setSettlements] = useState<SettlementRecord[]>(mockSettlements);

  const [databaseUrl, setDatabaseUrl] = useState<string>(
    'postgresql://postgres:password@localhost:5432/growforme_db?schema=public'
  );
  const [customRoles, setCustomRoles] = useState<CustomRole[]>(defaultRoles);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(defaultStaffUsers);
  const [activeUserPerspective, setActiveUserPerspective] = useState<'superadmin' | 'staff' | 'field_agent'>('superadmin');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cycles) setCycles(parsed.cycles);
        if (parsed.budgetItems) setBudgetItems(parsed.budgetItems);
        if (parsed.partners) setPartners(parsed.partners);
        if (parsed.campaigns) setCampaigns(parsed.campaigns);
        if (parsed.investments) setInvestments(parsed.investments);
        if (parsed.farmers) setFarmers(parsed.farmers);
        if (parsed.farms) setFarms(parsed.farms);
        if (parsed.inputs) setInputs(parsed.inputs);
        if (parsed.disbursements) setDisbursements(parsed.disbursements);
        if (parsed.mechanizationLogs) setMechanizationLogs(parsed.mechanizationLogs);
        if (parsed.harvestBatches) setHarvestBatches(parsed.harvestBatches);
        if (parsed.retrievals) setRetrievals(parsed.retrievals);
        if (parsed.tradeOrders) setTradeOrders(parsed.tradeOrders);
        if (parsed.settlements) setSettlements(parsed.settlements);
        if (parsed.databaseUrl) setDatabaseUrl(parsed.databaseUrl);
        if (parsed.customRoles) setCustomRoles(parsed.customRoles);
        if (parsed.staffUsers) setStaffUsers(parsed.staffUsers);
      }
    } catch (e) {
      console.error('Failed to load persisted state:', e);
    }
  }, []);

  const persistState = (newState: any) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  };

  const updateDatabaseUrl = (newUrl: string) => {
    setDatabaseUrl(newUrl);
    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl: newUrl, customRoles, staffUsers });
  };

  const addCustomRole = (roleData: Partial<CustomRole>) => {
    const newRole: CustomRole = {
      id: `role_${Date.now()}`,
      name: roleData.name || 'Custom Role',
      description: roleData.description || 'Custom permission set',
      createdBy: activeUserPerspective === 'superadmin' ? 'superadmin' : 'staff',
      permissions: roleData.permissions || ['farmers_manage'],
    };
    const updated = [...customRoles, newRole];
    setCustomRoles(updated);
    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles: updated, staffUsers });
  };

  const addStaffUser = (userData: Partial<StaffUser>) => {
    const roleObj = customRoles.find((r) => r.id === userData.roleId) || customRoles[1];
    const newUser: StaffUser = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'New Staff Member',
      email: userData.email || 'user@growforme.com',
      roleId: roleObj.id,
      roleName: roleObj.name,
      userType: userData.userType || (activeUserPerspective === 'superadmin' ? 'staff' : 'field_agent'),
      assignedBy: activeUserPerspective === 'superadmin' ? 'Super Admin' : 'Staff Member',
      phone: userData.phone || '+233 24 000 0000',
      region: userData.region || 'Northern Region',
      status: 'Active',
      lastPasswordReset: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...staffUsers, newUser];
    setStaffUsers(updated);
    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers: updated });
  };

  const updateStaffUser = (id: string, updatedData: Partial<StaffUser>) => {
    const roleObj = customRoles.find((r) => r.id === updatedData.roleId);
    const updated = staffUsers.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          ...updatedData,
          roleName: roleObj ? roleObj.name : u.roleName,
        };
      }
      return u;
    });
    setStaffUsers(updated);
    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers: updated });
  };

  const resetUserPassword = (id: string, newPassword?: string) => {
    const generatedPass = newPassword || `GfM#${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date().toISOString().split('T')[0];

    const updated = staffUsers.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          lastPasswordReset: today,
        };
      }
      return u;
    });

    setStaffUsers(updated);
    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers: updated });
    return generatedPass;
  };

  const deleteStaffUser = (id: string) => {
    const updated = staffUsers.filter((u) => u.id !== id);
    setStaffUsers(updated);
    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers: updated });
  };

  const addCycleWithCampaign = (cycleData: Partial<SeasonCycle>, budgetItemsData: Partial<BudgetItem>[]) => {
    const cycleId = `cyc_${Date.now()}`;
    const newCycle: SeasonCycle = {
      id: cycleId,
      name: cycleData.name || 'New Crop Cycle',
      crop: cycleData.crop || 'Maize',
      region: cycleData.region || 'Northern',
      startDate: cycleData.startDate || new Date().toISOString().split('T')[0],
      endDate: cycleData.endDate || new Date().toISOString().split('T')[0],
      targetAcreage: Number(cycleData.targetAcreage) || 1000,
      allocatedAcreage: 0,
      totalFarmers: 0,
      budgetTotalGHS: Number(cycleData.budgetTotalGHS) || 500000,
      status: 'Planning',
    };

    const newBudgets: BudgetItem[] = budgetItemsData.map((b, idx) => ({
      id: `b_${Date.now()}_${idx}`,
      cycleId,
      category: b.category || 'Inputs',
      description: b.description || 'Budget allocation',
      budgetedAmountGHS: Number(b.budgetedAmountGHS) || 50000,
      actualAmountGHS: 0,
      varianceGHS: Number(b.budgetedAmountGHS) || 50000,
      status: 'Under Budget',
    }));

    const newCampaign: FundingCampaign = {
      id: `camp_${Date.now()}`,
      cycleId,
      title: `${newCycle.name} Fund`,
      crop: newCycle.crop,
      targetAmountGHS: newCycle.budgetTotalGHS,
      raisedAmountGHS: 0,
      expectedROI: 18.0,
      minInvestmentGHS: 1000,
      totalInvestors: 0,
      daysRemaining: 30,
      status: 'Open',
    };

    const updatedCycles = [newCycle, ...cycles];
    const updatedBudgets = [...newBudgets, ...budgetItems];
    const updatedCampaigns = [newCampaign, ...campaigns];

    setCycles(updatedCycles);
    setBudgetItems(updatedBudgets);
    setCampaigns(updatedCampaigns);

    persistState({ cycles: updatedCycles, budgetItems: updatedBudgets, campaigns: updatedCampaigns, partners, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const addCycleOnly = (cycleData: Partial<SeasonCycle>) => {
    const cycleId = `cyc_${Date.now()}`;
    const newCycle: SeasonCycle = {
      id: cycleId,
      name: cycleData.name || 'New Crop Cycle',
      crop: cycleData.crop || 'Maize',
      region: cycleData.region || 'Northern',
      startDate: cycleData.startDate || new Date().toISOString().split('T')[0],
      endDate: cycleData.endDate || new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
      targetAcreage: Number(cycleData.targetAcreage) || 1000,
      allocatedAcreage: 0,
      totalFarmers: 0,
      budgetTotalGHS: Number(cycleData.budgetTotalGHS) || 500000,
      status: cycleData.status || 'Planning',
    };
    const updatedCycles = [newCycle, ...cycles];
    setCycles(updatedCycles);
    persistState({ cycles: updatedCycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const updateCycleTimeline = (id: string, updatedData: Partial<SeasonCycle>) => {
    const updatedCycles = cycles.map((c) => {
      if (c.id === id) {
        return { ...c, ...updatedData };
      }
      return c;
    });
    setCycles(updatedCycles);
    persistState({ cycles: updatedCycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const addFarmerWithFarm = (farmerData: Partial<Farmer>, farmData: Partial<FarmAsset>) => {
    const farmerId = `frm_${Date.now()}`;
    const newFarmer: Farmer = {
      id: farmerId,
      fullName: farmerData.fullName || 'Unnamed Farmer',
      ghanaCardNo: farmerData.ghanaCardNo || `GHA-${Math.floor(Math.random() * 900000000)}-${Math.floor(Math.random() * 9)}`,
      momoNumber: farmerData.momoNumber || '0240000000',
      momoNetwork: farmerData.momoNetwork || 'MTN MoMo',
      gender: farmerData.gender || 'Male',
      community: farmerData.community || 'Tamale',
      district: farmerData.district || 'Tamale Metro',
      region: farmerData.region || 'Northern',
      totalAcreage: Number(farmData.acreage) || 5,
      cooperativeCluster: farmerData.cooperativeCluster || 'Northern Grain Cluster',
      agronomicScore: 85,
      totalLoansInKindGHS: 0,
      activeStatus: 'Verified',
    };

    const newFarm: FarmAsset = {
      id: `f_asset_${Date.now()}`,
      farmerId,
      farmerName: newFarmer.fullName,
      farmCode: `GFM-${newFarmer.region.substring(0, 2).toUpperCase()}-${newFarmer.community.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900)}`,
      crop: farmData.crop || 'Maize',
      acreage: Number(farmData.acreage) || 5,
      soilType: farmData.soilType || 'Loam',
      tenureAgreement: farmData.tenureAgreement || 'Freehold',
      gpsLat: Number(farmData.gpsLat) || 9.4005,
      gpsLng: Number(farmData.gpsLng) || -0.9855,
      status: 'Prepared',
    };

    const updatedFarmers = [newFarmer, ...farmers];
    const updatedFarms = [newFarm, ...farms];

    setFarmers(updatedFarmers);
    setFarms(updatedFarms);

    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers: updatedFarmers, farms: updatedFarms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const addPartner = (partnerData: Partial<Partner>) => {
    const newPartner: Partner = {
      id: `p_${Date.now()}`,
      name: partnerData.name || 'New Agribusiness Partner',
      category: partnerData.category || 'Aggregator',
      contactPerson: partnerData.contactPerson || 'Contact Representative',
      phone: partnerData.phone || '+233 24 000 0000',
      email: partnerData.email || 'info@partner.com',
      location: partnerData.location || 'Accra',
      complianceScore: 95,
      slaStatus: 'Active',
      totalContractsGHS: Number(partnerData.totalContractsGHS) || 100000,
      rating: 5.0,
    };
    const updatedPartners = [newPartner, ...partners];
    setPartners(updatedPartners);
    persistState({ cycles, budgetItems, partners: updatedPartners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const addInvestment = (invData: Partial<Investment>) => {
    const amount = Number(invData.amountGHS) || 5000;
    const campaign = campaigns.find((c) => c.id === invData.campaignId) || campaigns[0];
    const expectedReturn = amount * (1 + campaign.expectedROI / 100);

    const newInv: Investment = {
      id: `inv_${Date.now()}`,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      investorName: invData.investorName || 'Retail Investor',
      investorType: invData.investorType || 'Retail',
      amountGHS: amount,
      expectedReturnGHS: expectedReturn,
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    const updatedCampaigns = campaigns.map((c) =>
      c.id === campaign.id
        ? { ...c, raisedAmountGHS: c.raisedAmountGHS + amount, totalInvestors: c.totalInvestors + 1 }
        : c
    );

    const updatedInvestments = [newInv, ...investments];
    setCampaigns(updatedCampaigns);
    setInvestments(updatedInvestments);

    persistState({ cycles, budgetItems, partners, campaigns: updatedCampaigns, investments: updatedInvestments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const addFundingCampaign = (campaignData: Partial<FundingCampaign>) => {
    const newCamp: FundingCampaign = {
      id: `camp_${Date.now()}`,
      cycleId: campaignData.cycleId || (cycles[0]?.id || 'cyc_01'),
      title: campaignData.title || 'New Crowdfunding Campaign',
      crop: campaignData.crop || 'Maize',
      targetAmountGHS: Number(campaignData.targetAmountGHS) || 500000,
      raisedAmountGHS: 0,
      expectedROI: Number(campaignData.expectedROI) || 18,
      minInvestmentGHS: Number(campaignData.minInvestmentGHS) || 1000,
      totalInvestors: 0,
      daysRemaining: Number(campaignData.daysRemaining) || 30,
      status: 'Open',
    };
    const updatedCampaigns = [newCamp, ...campaigns];
    setCampaigns(updatedCampaigns);
    persistState({ cycles, budgetItems, partners, campaigns: updatedCampaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const issueInputVoucher = (voucherData: Partial<InputDisbursement>, farmerId: string, costGHS: number) => {
    const farmer = farmers.find((f) => f.id === farmerId) || farmers[0];
    const newDisb: InputDisbursement = {
      id: `disb_${Date.now()}`,
      voucherCode: `GFM-VOUCH-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerId: farmer.id,
      farmerName: farmer.fullName,
      depotName: voucherData.depotName || 'Tamale Depot',
      items: voucherData.items || [{ item: 'Yara NPK 15-15-15', quantity: 5, costGHS: costGHS }],
      totalCostGHS: costGHS,
      verificationMethod: 'OTP',
      status: 'Picked Up',
      disbursedDate: new Date().toISOString().split('T')[0],
    };

    const updatedFarmers = farmers.map((f) =>
      f.id === farmer.id ? { ...f, totalLoansInKindGHS: f.totalLoansInKindGHS + costGHS } : f
    );

    const updatedDisb = [newDisb, ...disbursements];
    setFarmers(updatedFarmers);
    setDisbursements(updatedDisb);

    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers: updatedFarmers, farms, inputs, disbursements: updatedDisb, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const bookMechanizationJob = (jobData: Partial<MechanizationLog>, farmerId: string, costGHS: number) => {
    const farmer = farmers.find((f) => f.id === farmerId) || farmers[0];
    const farm = farms.find((f) => f.farmerId === farmer.id) || farms[0];

    const newLog: MechanizationLog = {
      id: `mech_${Date.now()}`,
      jobCardId: `JC-TRAC-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      farmId: farm ? farm.id : 'f_asset_01',
      farmCode: farm ? farm.farmCode : 'GFM-CODE-01',
      farmerName: farmer.fullName,
      machineryType: jobData.machineryType || 'Tractor (Plowing)',
      operatorName: jobData.operatorName || 'AgriService Operator',
      acresCovered: Number(jobData.acresCovered) || 10,
      fuelConsumedLitres: Number(jobData.fuelConsumedLitres) || 80,
      startTime: '08:00 AM',
      endTime: '04:00 PM',
      status: 'In Progress',
      lat: farm ? farm.gpsLat : 9.4005,
      lng: farm ? farm.gpsLng : -0.9855,
      costGHS,
    };

    const updatedFarmers = farmers.map((f) =>
      f.id === farmer.id ? { ...f, totalLoansInKindGHS: f.totalLoansInKindGHS + costGHS } : f
    );

    const updatedLogs = [newLog, ...mechanizationLogs];
    setFarmers(updatedFarmers);
    setMechanizationLogs(updatedLogs);

    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers: updatedFarmers, farms, inputs, disbursements, mechanizationLogs: updatedLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const toggleMechanizationStatus = (id: string) => {
    const updatedLogs = mechanizationLogs.map((log) => {
      if (log.id === id) {
        const nextStatus = log.status === 'Completed' ? 'In Progress' : 'Completed';
        return { ...log, status: nextStatus as any };
      }
      return log;
    });
    setMechanizationLogs(updatedLogs);
    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs: updatedLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const updateMechanizationLog = (id: string, updatedData: Partial<MechanizationLog>) => {
    const updatedLogs = mechanizationLogs.map((log) => {
      if (log.id === id) {
        return { ...log, ...updatedData };
      }
      return log;
    });
    setMechanizationLogs(updatedLogs);
    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs: updatedLogs, harvestBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const logHarvestBatch = (batchData: Partial<HarvestBatch>) => {
    const newBatch: HarvestBatch = {
      id: `harv_${Date.now()}`,
      batchNo: `GFM-BATCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      farmerId: batchData.farmerId || 'frm_01',
      farmerName: batchData.farmerName || 'Registered Farmer',
      crop: batchData.crop || 'Maize',
      expectedYieldKg: Number(batchData.expectedYieldKg) || 10000,
      actualYieldKg: Number(batchData.actualYieldKg) || 10500,
      moistureContentPct: Number(batchData.moistureContentPct) || 12.5,
      foreignMatterPct: 0.9,
      aflatoxinPpb: 3.5,
      eudrCompliant: true,
      qualityGrade: batchData.qualityGrade || 'Grade A',
      warehouseReceiptNo: `WHR-GCX-${Math.floor(1000 + Math.random() * 9000)}`,
      dateHarvested: new Date().toISOString().split('T')[0],
    };
    const updatedBatches = [newBatch, ...harvestBatches];
    setHarvestBatches(updatedBatches);
    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches: updatedBatches, retrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const createWaybillRetrieval = (retrievalData: Partial<CommodityRetrieval>, farmerId: string, bags: number, valueGHS: number) => {
    const farmer = farmers.find((f) => f.id === farmerId) || farmers[0];

    const newRet: CommodityRetrieval = {
      id: `ret_${Date.now()}`,
      waybillNo: `WAY-GFM-${Math.floor(100 + Math.random() * 900)}`,
      farmerName: farmer.fullName,
      cooperativeCluster: farmer.cooperativeCluster,
      commodity: retrievalData.commodity || 'Maize (50kg Bags)',
      bagsRetrieved: bags,
      grossWeightKg: bags * 50,
      inKindDebtGHS: farmer.totalLoansInKindGHS,
      retrievedValueGHS: valueGHS,
      driverName: retrievalData.driverName || 'Driver Mensah',
      vehicleRegNo: retrievalData.vehicleRegNo || 'NR 1122-24',
      destinationDepot: retrievalData.destinationDepot || 'Tamale Depot',
      status: 'In Transit',
      date: new Date().toISOString().split('T')[0],
    };

    const updatedFarmers = farmers.map((f) =>
      f.id === farmer.id ? { ...f, totalLoansInKindGHS: Math.max(0, f.totalLoansInKindGHS - valueGHS) } : f
    );

    const updatedRetrievals = [newRet, ...retrievals];
    setFarmers(updatedFarmers);
    setRetrievals(updatedRetrievals);

    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers: updatedFarmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals: updatedRetrievals, tradeOrders, settlements, databaseUrl, customRoles, staffUsers });
  };

  const createTradeContract = (tradeData: Partial<TradeOrder>) => {
    const qty = Number(tradeData.quantityMT) || 100;
    const price = Number(tradeData.pricePerMTGHS) || 3500;
    const newTrade: TradeOrder = {
      id: `trd_${Date.now()}`,
      contractNo: `GCX-CONTRACT-${Math.floor(100 + Math.random() * 900)}`,
      offtakerName: tradeData.offtakerName || 'Industrial Processor Ltd',
      offtakerType: tradeData.offtakerType || 'Industrial Processor',
      commodity: tradeData.commodity || 'Yellow Maize',
      quantityMT: qty,
      pricePerMTGHS: price,
      totalValueGHS: qty * price,
      fulfilledQuantityMT: 0,
      contractType: tradeData.contractType || 'Spot Contract',
      deliveryDeadline: tradeData.deliveryDeadline || new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    const updatedTrade = [newTrade, ...tradeOrders];
    setTradeOrders(updatedTrade);
    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders: updatedTrade, settlements, databaseUrl, customRoles, staffUsers });
  };

  const executeWaterfallSettlement = (cycleName: string, grossRevenue: number) => {
    const investorPayout = grossRevenue * 0.60;
    const inputRecovery = grossRevenue * 0.15;
    const aggregatorCommission = grossRevenue * 0.05;
    const farmerNetProfit = grossRevenue * 0.20;

    const newStl: SettlementRecord = {
      id: `stl_${Date.now()}`,
      cycleName,
      grossRevenueGHS: grossRevenue,
      investorPayoutGHS: investorPayout,
      inputRecoveryGHS: inputRecovery,
      aggregatorCommissionGHS: aggregatorCommission,
      farmerNetProfitGHS: farmerNetProfit,
      settlementDate: new Date().toISOString().split('T')[0],
      status: 'Settlement Executed',
    };

    const updatedSettlements = [newStl, ...settlements];
    setSettlements(updatedSettlements);
    persistState({ cycles, budgetItems, partners, campaigns, investments, farmers, farms, inputs, disbursements, mechanizationLogs, harvestBatches, retrievals, tradeOrders, settlements: updatedSettlements, databaseUrl, customRoles, staffUsers });
  };

  const deleteEntity = (type: string, id: string) => {
    if (type === 'farmer') setFarmers(farmers.filter((f) => f.id !== id));
    if (type === 'partner') setPartners(partners.filter((p) => p.id !== id));
    if (type === 'cycle') setCycles(cycles.filter((c) => c.id !== id));
    if (type === 'trade') setTradeOrders(tradeOrders.filter((t) => t.id !== id));
    if (type === 'mechanization') setMechanizationLogs(mechanizationLogs.filter((m) => m.id !== id));
    if (type === 'campaign') setCampaigns(campaigns.filter((c) => c.id !== id));
    if (type === 'investment') setInvestments(investments.filter((i) => i.id !== id));
  };

  const resetToDefaultSeed = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCycles(mockCycles);
    setBudgetItems(mockBudgetItems);
    setPartners(mockPartners);
    setCampaigns(mockCampaigns);
    setInvestments(mockInvestments);
    setFarmers(mockFarmers);
    setFarms(mockFarms);
    setInputs(mockInputs);
    setDisbursements(mockDisbursements);
    setMechanizationLogs(mockMechanizationLogs);
    setHarvestBatches(mockHarvestBatches);
    setRetrievals(mockCommodityRetrievals);
    setTradeOrders(mockTradeOrders);
    setSettlements(mockSettlements);
    setCustomRoles(defaultRoles);
    setStaffUsers(defaultStaffUsers);
  };

  return (
    <AppStateContext.Provider
      value={{
        cycles,
        budgetItems,
        partners,
        campaigns,
        investments,
        farmers,
        farms,
        inputs,
        disbursements,
        mechanizationLogs,
        harvestBatches,
        retrievals,
        tradeOrders,
        settlements,

        databaseUrl,
        updateDatabaseUrl,

        customRoles,
        staffUsers,
        activeUserPerspective,
        setActiveUserPerspective,
        addCustomRole,
        addStaffUser,
        updateStaffUser,
        resetUserPassword,
        deleteStaffUser,

        addCycleWithCampaign,
        addCycleOnly,
        updateCycleTimeline,
        addFundingCampaign,
        addFarmerWithFarm,
        addPartner,
        addInvestment,
        issueInputVoucher,
        bookMechanizationJob,
        toggleMechanizationStatus,
        updateMechanizationLog,
        logHarvestBatch,
        createWaybillRetrieval,
        createTradeContract,
        executeWaterfallSettlement,
        deleteEntity,
        resetToDefaultSeed,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
