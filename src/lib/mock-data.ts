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
  User,
} from '@/types/schema';

export const mockUser: User = {
  id: 'usr_admin_01',
  name: 'Nana Kwame Addo',
  email: 'nana.addo@growforme.com',
  role: 'admin',
  phone: '+233 24 412 3456',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  organization: 'GrowForMe Ghana Ltd',
  region: 'Accra HQ / Northern Regional Operations',
  createdAt: '2025-01-10',
};

export const mockCycles: SeasonCycle[] = [
  {
    id: 'cyc_01',
    name: 'Northern Maize & Soy Outgrower 2026',
    crop: 'Maize',
    region: 'Northern',
    startDate: '2026-04-01',
    endDate: '2026-11-30',
    targetAcreage: 5000,
    allocatedAcreage: 4350,
    totalFarmers: 870,
    budgetTotalGHS: 4250000,
    status: 'Active Cultivation',
  },
  {
    id: 'cyc_02',
    name: 'Ejura Commercial Soybean Cycle B',
    crop: 'Soybeans',
    region: 'Ashanti',
    startDate: '2026-05-15',
    endDate: '2026-12-15',
    targetAcreage: 3000,
    allocatedAcreage: 2800,
    totalFarmers: 450,
    budgetTotalGHS: 2900000,
    status: 'Input Disbursement',
  },
  {
    id: 'cyc_03',
    name: 'Techiman Cashew Export Cluster',
    crop: 'Cashew',
    region: 'Bono East',
    startDate: '2026-01-10',
    endDate: '2026-09-30',
    targetAcreage: 8000,
    allocatedAcreage: 8000,
    totalFarmers: 1200,
    budgetTotalGHS: 6800000,
    status: 'Harvesting',
  },
  {
    id: 'cyc_04',
    name: 'Kpong Commercial Rice Irrigation',
    crop: 'Rice',
    region: 'Volta',
    startDate: '2026-03-01',
    endDate: '2026-10-31',
    targetAcreage: 2500,
    allocatedAcreage: 2100,
    totalFarmers: 380,
    budgetTotalGHS: 3100000,
    status: 'Planning',
  },
];

export const mockBudgetItems: BudgetItem[] = [
  { id: 'b_01', cycleId: 'cyc_01', category: 'Inputs', description: 'Yara NPK 15-15-15 & Hybrid Maize Seeds', budgetedAmountGHS: 1850000, actualAmountGHS: 1790000, varianceGHS: 60000, status: 'Under Budget' },
  { id: 'b_02', cycleId: 'cyc_01', category: 'Machinery', description: 'Tractor land prep, harrowing & planting services', budgetedAmountGHS: 920000, actualAmountGHS: 945000, varianceGHS: -25000, status: 'Over Budget' },
  { id: 'b_03', cycleId: 'cyc_01', category: 'Labour', description: 'Community outgrower weeding & spraying labor', budgetedAmountGHS: 480000, actualAmountGHS: 470000, varianceGHS: 10000, status: 'On Track' },
  { id: 'b_04', cycleId: 'cyc_01', category: 'Logistics', description: 'Depot aggregation transit & hauling fuel', budgetedAmountGHS: 600000, actualAmountGHS: 580000, varianceGHS: 20000, status: 'Under Budget' },
  { id: 'b_05', cycleId: 'cyc_01', category: 'Aggregation Fees', description: 'Aggregator commission & warehouse handling', budgetedAmountGHS: 400000, actualAmountGHS: 390000, varianceGHS: 10000, status: 'Under Budget' },
];

export const mockPartners: Partner[] = [
  { id: 'p_01', name: 'Savannah Agribusiness Hubs', category: 'Aggregator', contactPerson: 'Ibrahim Alhassan', phone: '+233 20 811 9922', email: 'ibrahim@savannahagri.gh', location: 'Tamale, Northern Region', complianceScore: 96, slaStatus: 'Active', totalContractsGHS: 2400000, rating: 4.9 },
  { id: 'p_02', name: 'Yara Ghana Chemicals Ltd', category: 'Input Supplier', contactPerson: 'Akua Mansa Boateng', phone: '+233 24 300 4455', email: 'akua.mansa@yara.com', location: 'Tema Industrial Area', complianceScore: 99, slaStatus: 'Active', totalContractsGHS: 5800000, rating: 5.0 },
  { id: 'p_03', name: 'Northern Mechanization Center', category: 'Logistics Contractor', contactPerson: 'Fusheini Abdul-Rahman', phone: '+233 27 554 1122', email: 'fusheini@nmc.com.gh', location: 'Savelugu', complianceScore: 88, slaStatus: 'Active', totalContractsGHS: 1250000, rating: 4.6 },
  { id: 'p_04', name: 'GCX Certified Depot #04', category: 'Warehouse Operator', contactPerson: 'Kwaku Bonsu', phone: '+233 50 123 7788', email: 'kbonsu@gcx.com.gh', location: 'Ejura', complianceScore: 92, slaStatus: 'Active', totalContractsGHS: 950000, rating: 4.8 },
  { id: 'p_05', name: 'West Africa Seed Co.', category: 'Seed Breeder', contactPerson: 'Dr. Samuel Kojo', phone: '+233 24 990 0011', email: 'skojo@waseed.org', location: 'Sunyani', complianceScore: 78, slaStatus: 'Under Review', totalContractsGHS: 620000, rating: 4.1 },
];

export const mockCampaigns: FundingCampaign[] = [
  { id: 'camp_01', cycleId: 'cyc_01', title: 'Tamale Maize & Soy Outgrower Pool 2026', crop: 'Yellow Maize', targetAmountGHS: 3500000, raisedAmountGHS: 3150000, expectedROI: 18.5, minInvestmentGHS: 1000, totalInvestors: 340, daysRemaining: 8, status: 'Open' },
  { id: 'camp_02', cycleId: 'cyc_02', title: 'Ejura Commercial Soybean Fund', crop: 'Soybean', targetAmountGHS: 2000000, raisedAmountGHS: 2000000, expectedROI: 16.0, minInvestmentGHS: 5000, totalInvestors: 112, daysRemaining: 0, status: 'Fully Funded' },
  { id: 'camp_03', cycleId: 'cyc_03', title: 'Techiman Cashew Export Syndication', crop: 'Raw Cashew Nut', targetAmountGHS: 5000000, raisedAmountGHS: 5000000, expectedROI: 22.0, minInvestmentGHS: 10000, totalInvestors: 85, daysRemaining: 0, status: 'Disbursed' },
];

export const mockInvestments: Investment[] = [
  { id: 'inv_01', campaignId: 'camp_01', campaignTitle: 'Tamale Maize & Soy Outgrower Pool 2026', investorName: 'Ablormeti Impact Capital', investorType: 'Institutional', amountGHS: 500000, expectedReturnGHS: 592500, date: '2026-03-02', status: 'Active' },
  { id: 'inv_02', campaignId: 'camp_01', campaignTitle: 'Tamale Maize & Soy Outgrower Pool 2026', investorName: 'Kofi Mensah', investorType: 'Retail', amountGHS: 15000, expectedReturnGHS: 17775, date: '2026-03-05', status: 'Active' },
  { id: 'inv_03', campaignId: 'camp_02', campaignTitle: 'Ejura Commercial Soybean Fund', investorName: 'Ghana Agriculture Venture Fund', investorType: 'Institutional', amountGHS: 1200000, expectedReturnGHS: 1392000, date: '2026-02-14', status: 'Active' },
];

export const mockFarmers: Farmer[] = [
  { id: 'frm_01', fullName: 'Yakubu Mohammed', ghanaCardNo: 'GHA-723491823-1', momoNumber: '0244112233', momoNetwork: 'MTN MoMo', gender: 'Male', community: 'Nyankpala', district: 'Tolon', region: 'Northern', totalAcreage: 12, cooperativeCluster: 'Nyankpala Maize Outgrowers', agronomicScore: 92, totalLoansInKindGHS: 4850, activeStatus: 'Verified' },
  { id: 'frm_02', fullName: 'Aminatu Seidu', ghanaCardNo: 'GHA-819203911-5', momoNumber: '0559988776', momoNetwork: 'MTN MoMo', gender: 'Female', community: 'Savelugu', district: 'Savelugu', region: 'Northern', totalAcreage: 8, cooperativeCluster: 'Northern Women Soy Co-op', agronomicScore: 95, totalLoansInKindGHS: 3200, activeStatus: 'Verified' },
  { id: 'frm_03', fullName: 'Kwabena Appiah', ghanaCardNo: 'GHA-551122334-9', momoNumber: '0208877665', momoNetwork: 'Telecel Cash', gender: 'Male', community: 'Ejura Nkwanta', district: 'Ejura Sekyedumase', region: 'Ashanti', totalAcreage: 25, cooperativeCluster: 'Ejura Grain Producers', agronomicScore: 86, totalLoansInKindGHS: 11400, activeStatus: 'Verified' },
  { id: 'frm_04', fullName: 'Fatima Alhassan', ghanaCardNo: 'GHA-998811223-2', momoNumber: '0241122334', momoNetwork: 'MTN MoMo', gender: 'Female', community: 'Kumbungu', district: 'Kumbungu', region: 'Northern', totalAcreage: 6, cooperativeCluster: 'Nyankpala Maize Outgrowers', agronomicScore: 88, totalLoansInKindGHS: 2400, activeStatus: 'Verified' },
];

export const mockFarms: FarmAsset[] = [
  { id: 'f_asset_01', farmerId: 'frm_01', farmerName: 'Yakubu Mohammed', farmCode: 'GFM-NR-NYA-001', crop: 'Yellow Maize', acreage: 12, soilType: 'Sandy Loam', tenureAgreement: 'Freehold', gpsLat: 9.4005, gpsLng: -0.9855, status: 'Planted' },
  { id: 'f_asset_02', farmerId: 'frm_02', farmerName: 'Aminatu Seidu', farmCode: 'GFM-NR-SAV-042', crop: 'Soybeans', acreage: 8, soilType: 'Clay Loam', tenureAgreement: 'Leasehold', gpsLat: 9.6251, gpsLng: -0.8264, status: 'Planted' },
  { id: 'f_asset_03', farmerId: 'frm_03', farmerName: 'Kwabena Appiah', farmCode: 'GFM-AR-EJU-109', crop: 'Soybeans', acreage: 25, soilType: 'Loam', tenureAgreement: 'Sharecropping (Abunu/Abusa)', gpsLat: 7.3789, gpsLng: -1.3621, status: 'Harvest Ready' },
];

export const mockInputs: InputInventory[] = [
  { id: 'inp_01', itemCode: 'YARA-NPK-15', name: 'YaraMila UNIK 15-15-15 Fertilizer', category: 'Fertilizer', warehouseDepot: 'Tamale Central Depot', totalStock: 4500, allocatedStock: 3200, unit: 'Bags (50kg)', unitCostGHS: 380 },
  { id: 'inp_02', itemCode: 'SEED-Pioneer-M3', name: 'Pioneer Hybrid Yellow Maize Seed', category: 'Seed', warehouseDepot: 'Tamale Central Depot', totalStock: 1200, allocatedStock: 850, unit: 'KG', unitCostGHS: 45 },
  { id: 'inp_03', itemCode: 'AGRO-Glyph-480', name: 'Sunphosate Glyphosate 480SL', category: 'Agrochemical', warehouseDepot: 'Ejura Main Depot', totalStock: 3000, allocatedStock: 1400, unit: 'Litres', unitCostGHS: 65 },
];

export const mockDisbursements: InputDisbursement[] = [
  { id: 'disb_01', voucherCode: 'GFM-VOUCH-8821', farmerId: 'frm_01', farmerName: 'Yakubu Mohammed', depotName: 'Tamale Central Depot', items: [{ item: 'YaraMila NPK 15-15-15', quantity: 10, costGHS: 3800 }, { item: 'Pioneer Hybrid Maize Seed', quantity: 15, costGHS: 675 }], totalCostGHS: 4475, verificationMethod: 'OTP', status: 'Picked Up', disbursedDate: '2026-05-12' },
  { id: 'disb_02', voucherCode: 'GFM-VOUCH-9042', farmerId: 'frm_02', farmerName: 'Aminatu Seidu', depotName: 'Savelugu Satellite Depot', items: [{ item: 'YaraMila NPK 15-15-15', quantity: 6, costGHS: 2280 }, { item: 'Sunphosate Glyphosate', quantity: 8, costGHS: 520 }], totalCostGHS: 2800, verificationMethod: 'QR Code', status: 'Redeemed', disbursedDate: '2026-05-18' },
];

export const mockMechanizationLogs: MechanizationLog[] = [
  { id: 'mech_01', jobCardId: 'JC-TRAC-2026-01', farmId: 'f_asset_01', farmCode: 'GFM-NR-NYA-001', farmerName: 'Yakubu Mohammed', machineryType: 'Tractor (Plowing)', operatorName: 'Fuseini Dawuda (Tractor #4)', acresCovered: 12, fuelConsumedLitres: 110, startTime: '07:30 AM', endTime: '02:15 PM', status: 'Completed', lat: 9.4005, lng: -0.9855, costGHS: 2400 },
  { id: 'mech_02', jobCardId: 'JC-DRON-2026-09', farmId: 'f_asset_02', farmCode: 'GFM-NR-SAV-042', farmerName: 'Aminatu Seidu', machineryType: 'Drone Spraying', operatorName: 'AgriFly Tech Ghana', acresCovered: 8, fuelConsumedLitres: 0, startTime: '09:00 AM', endTime: '10:30 AM', status: 'In Progress', lat: 9.6251, lng: -0.8264, costGHS: 960 },
  { id: 'mech_03', jobCardId: 'JC-TRAC-2026-14', farmId: 'f_asset_03', farmCode: 'GFM-AR-EJU-109', farmerName: 'Kwabena Appiah', machineryType: 'Harrower', operatorName: 'Ashanti Agro Services', acresCovered: 25, fuelConsumedLitres: 190, startTime: '06:00 AM', endTime: '05:00 PM', status: 'Completed', lat: 7.3789, lng: -1.3621, costGHS: 4500 },
];

export const mockHarvestBatches: HarvestBatch[] = [
  { id: 'harv_01', batchNo: 'GFM-BATCH-2026-001', farmerId: 'frm_01', farmerName: 'Yakubu Mohammed', crop: 'Yellow Maize', expectedYieldKg: 24000, actualYieldKg: 25200, moistureContentPct: 12.8, foreignMatterPct: 0.8, aflatoxinPpb: 4.2, eudrCompliant: true, qualityGrade: 'Grade A', warehouseReceiptNo: 'WHR-GCX-0912', dateHarvested: '2026-10-14' },
  { id: 'harv_02', batchNo: 'GFM-BATCH-2026-002', farmerId: 'frm_02', farmerName: 'Aminatu Seidu', crop: 'Soybeans', expectedYieldKg: 12000, actualYieldKg: 11400, moistureContentPct: 11.2, foreignMatterPct: 1.1, aflatoxinPpb: 2.1, eudrCompliant: true, qualityGrade: 'Grade A', warehouseReceiptNo: 'WHR-GCX-0915', dateHarvested: '2026-10-18' },
];

export const mockCommodityRetrievals: CommodityRetrieval[] = [
  { id: 'ret_01', waybillNo: 'WAY-GFM-991', farmerName: 'Yakubu Mohammed', cooperativeCluster: 'Nyankpala Maize Outgrowers', commodity: 'Yellow Maize (50kg Bags)', bagsRetrieved: 120, grossWeightKg: 6000, inKindDebtGHS: 4475, retrievedValueGHS: 18000, driverName: 'Salifu Issah (MAN Diesel 10-Ton)', vehicleRegNo: 'NR 4412-24', destinationDepot: 'Tamale GCX Depot', status: 'Received at Depot', date: '2026-10-16' },
  { id: 'ret_02', waybillNo: 'WAY-GFM-994', farmerName: 'Aminatu Seidu', cooperativeCluster: 'Northern Women Soy Co-op', commodity: 'Soybeans (50kg Bags)', bagsRetrieved: 80, grossWeightKg: 4000, inKindDebtGHS: 2800, retrievedValueGHS: 16000, driverName: 'Kofi Mensah', vehicleRegNo: 'AS 9012-23', destinationDepot: 'Tamale Main Warehouse', status: 'In Transit', date: '2026-10-19' },
];

export const mockTradeOrders: TradeOrder[] = [
  { id: 'trd_01', contractNo: 'GCX-MAIZE-2026-101', offtakerName: 'Ghana Commodity Exchange (GCX)', offtakerType: 'Ghana Commodity Exchange (GCX)', commodity: 'Grade A Yellow Maize', quantityMT: 500, pricePerMTGHS: 3200, totalValueGHS: 1600000, fulfilledQuantityMT: 350, contractType: 'Spot Contract', deliveryDeadline: '2026-11-15', status: 'Partially Fulfilled' },
  { id: 'trd_02', contractNo: 'YENTI-SOY-2026-88', offtakerName: 'Yenti Oils & Poultry Feeds Kumasi', offtakerType: 'Industrial Processor', commodity: 'Non-GMO Soybeans', quantityMT: 300, pricePerMTGHS: 4200, totalValueGHS: 1260000, fulfilledQuantityMT: 300, contractType: 'Futures Contract', deliveryDeadline: '2026-11-01', status: 'Completed' },
  { id: 'trd_03', contractNo: 'EXPORT-CASH-2026-05', offtakerName: 'Olam Agri International', offtakerType: 'Exporter', commodity: 'Raw Cashew Nuts (KOR 48)', quantityMT: 1000, pricePerMTGHS: 9800, totalValueGHS: 9800000, fulfilledQuantityMT: 1000, contractType: 'Futures Contract', deliveryDeadline: '2026-10-30', status: 'Completed' },
];

export const mockSettlements: SettlementRecord[] = [
  { id: 'stl_01', cycleName: 'Techiman Cashew Export Cluster', grossRevenueGHS: 9800000, investorPayoutGHS: 6100000, inputRecoveryGHS: 1200000, aggregatorCommissionGHS: 490000, farmerNetProfitGHS: 2010000, settlementDate: '2026-10-31', status: 'Settlement Executed' },
  { id: 'stl_02', cycleName: 'Northern Maize & Soy Outgrower 2026', grossRevenueGHS: 2860000, investorPayoutGHS: 1750000, inputRecoveryGHS: 480000, aggregatorCommissionGHS: 143000, farmerNetProfitGHS: 487000, settlementDate: '2026-11-20', status: 'Waterfall Computed' },
];
