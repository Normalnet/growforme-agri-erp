// 12 Normalized PostgreSQL Entity Schemas for GrowForMe Agri ERP

export type UserRole = 'admin' | 'field_agent' | 'investor' | 'aggregator' | 'offtaker';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  organization?: string;
  region?: string;
  createdAt: string;
}

export interface SeasonCycle {
  id: string;
  name: string;
  crop: 'Maize' | 'Soybeans' | 'Cashew' | 'Rice' | 'Sorghum';
  region: 'Northern' | 'Ashanti' | 'Bono East' | 'Upper West' | 'Volta';
  startDate: string;
  endDate: string;
  targetAcreage: number;
  allocatedAcreage: number;
  totalFarmers: number;
  budgetTotalGHS: number;
  status: 'Planning' | 'Input Disbursement' | 'Active Cultivation' | 'Harvesting' | 'Retrieval & Sales' | 'Settled';
}

export interface BudgetItem {
  id: string;
  cycleId: string;
  category: 'Inputs' | 'Machinery' | 'Labour' | 'Logistics' | 'Aggregation Fees' | 'Insurance & Ops';
  description: string;
  budgetedAmountGHS: number;
  actualAmountGHS: number;
  varianceGHS: number;
  status: 'Under Budget' | 'On Track' | 'Over Budget';
}

export interface Partner {
  id: string;
  name: string;
  category: 'Aggregator' | 'Warehouse Operator' | 'Input Supplier' | 'Seed Breeder' | 'Logistics Contractor';
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  complianceScore: number; // 0-100%
  slaStatus: 'Active' | 'Under Review' | 'Pending KYC';
  totalContractsGHS: number;
  rating: number;
}

export interface FundingCampaign {
  id: string;
  cycleId: string;
  title: string;
  crop: string;
  targetAmountGHS: number;
  raisedAmountGHS: number;
  expectedROI: number; // %
  minInvestmentGHS: number;
  totalInvestors: number;
  daysRemaining: number;
  status: 'Open' | 'Fully Funded' | 'Disbursed' | 'Settling';
}

export interface Investment {
  id: string;
  campaignId: string;
  campaignTitle: string;
  investorName: string;
  investorType: 'Retail' | 'Institutional';
  amountGHS: number;
  expectedReturnGHS: number;
  date: string;
  status: 'Active' | 'Matured' | 'Payout Processed';
}

export interface Farmer {
  id: string;
  fullName: string;
  ghanaCardNo: string;
  momoNumber: string;
  momoNetwork: 'MTN MoMo' | 'Telecel Cash' | 'AT Money';
  gender: 'Male' | 'Female';
  community: string;
  district: string;
  region: string;
  totalAcreage: number;
  cooperativeCluster: string;
  agronomicScore: number; // 0 - 100
  totalLoansInKindGHS: number;
  activeStatus: 'Verified' | 'Pending Verification' | 'Suspended';
}

export interface FarmAsset {
  id: string;
  farmerId: string;
  farmerName: string;
  farmCode: string;
  crop: string;
  acreage: number;
  soilType: string;
  tenureAgreement: 'Freehold' | 'Leasehold' | 'Sharecropping (Abunu/Abusa)';
  gpsLat: number;
  gpsLng: number;
  polygonCoordinates?: [number, number][];
  status: 'Prepared' | 'Planted' | 'Harvest Ready';
}

export interface InputInventory {
  id: string;
  itemCode: string;
  name: string;
  category: 'Fertilizer' | 'Seed' | 'Agrochemical' | 'Tools';
  warehouseDepot: string;
  totalStock: number;
  allocatedStock: number;
  unit: 'Bags (50kg)' | 'Litres' | 'KG' | 'Units';
  unitCostGHS: number;
}

export interface InputDisbursement {
  id: string;
  voucherCode: string;
  farmerId: string;
  farmerName: string;
  depotName: string;
  items: { item: string; quantity: number; costGHS: number }[];
  totalCostGHS: number;
  verificationMethod: 'OTP' | 'QR Code' | 'Ghana Card Scan';
  status: 'Issued' | 'Picked Up' | 'Redeemed' | 'Cancelled';
  disbursedDate: string;
}

export interface MechanizationLog {
  id: string;
  jobCardId: string;
  farmId: string;
  farmCode: string;
  farmerName: string;
  machineryType: 'Tractor (Plowing)' | 'Harrower' | 'Planter' | 'Drone Spraying' | 'Combine Harvester';
  operatorName: string;
  acresCovered: number;
  fuelConsumedLitres: number;
  startTime: string;
  endTime: string;
  status: 'In Progress' | 'Completed' | 'Maintenance Required';
  lat: number;
  lng: number;
  costGHS: number;
}

export interface HarvestBatch {
  id: string;
  batchNo: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  expectedYieldKg: number;
  actualYieldKg: number;
  moistureContentPct: number;
  foreignMatterPct: number;
  aflatoxinPpb: number;
  eudrCompliant: boolean;
  qualityGrade: 'Grade A' | 'Grade B' | 'Grade C' | 'Rejected';
  warehouseReceiptNo: string;
  dateHarvested: string;
}

export interface CommodityRetrieval {
  id: string;
  waybillNo: string;
  farmerName: string;
  cooperativeCluster: string;
  commodity: string;
  bagsRetrieved: number;
  grossWeightKg: number;
  inKindDebtGHS: number;
  retrievedValueGHS: number;
  driverName: string;
  vehicleRegNo: string;
  destinationDepot: string;
  status: 'Dispatched' | 'In Transit' | 'Received at Depot';
  date: string;
}

export interface TradeOrder {
  id: string;
  contractNo: string;
  offtakerName: string;
  offtakerType: 'Ghana Commodity Exchange (GCX)' | 'Industrial Processor' | 'Exporter' | 'Local Feed Mill';
  commodity: string;
  quantityMT: number;
  pricePerMTGHS: number;
  totalValueGHS: number;
  fulfilledQuantityMT: number;
  contractType: 'Spot Contract' | 'Futures Contract';
  deliveryDeadline: string;
  status: 'Pending' | 'Partially Fulfilled' | 'Completed' | 'Expired';
}

export interface SettlementRecord {
  id: string;
  cycleName: string;
  grossRevenueGHS: number;
  investorPayoutGHS: number;
  inputRecoveryGHS: number;
  aggregatorCommissionGHS: number;
  farmerNetProfitGHS: number;
  settlementDate: string;
  status: 'Waterfall Computed' | 'Settlement Executed' | 'Reconciled';
}
