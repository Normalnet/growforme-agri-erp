// Comprehensive Ghanaian Location Hierarchy & Districts
export const GHANA_REGIONS_DISTRICTS: Record<string, string[]> = {
  'Northern Region': ['Tamale Metro', 'Tolon', 'Kumbungu', 'Savelugu', 'Nanton', 'Yendi Municipal', 'Mion', 'Karaga', 'Gushiegu'],
  'Ashanti Region': ['Ejura Sekyedumase', 'Kumasi Metro', 'Offinso South', 'Afigya Kwabre', 'Asante Akim North', 'Atwima Nwabiagya'],
  'Bono East Region': ['Techiman Municipal', 'Nkoranza South', 'Atebubu-Amantin', 'Kintampo North', 'Pru East'],
  'Upper West Region': ['Wa Municipal', 'Jirapa', 'Lawra', 'Nadowli-Kaleo', 'Sissala East', 'Tumu'],
  'Volta Region': ['Kpong Municipal', 'Ho Municipal', 'Ketua South', 'Central Tongu', 'Anloga'],
  'Upper East Region': ['Bolgatanga Central', 'Bawku Municipal', 'Kassena Nankana East', 'Navrongo'],
};

// Seed Varieties & Chemical Input Master Catalog
export const INPUT_CATALOG = [
  { itemCode: 'YARA-NPK-15', name: 'YaraMila UNIK 15-15-15 Fertilizer', category: 'Fertilizer', unit: 'Bags (50kg)', unitCostGHS: 380 },
  { itemCode: 'YARA-UREA-46', name: 'YaraVera UREA (46-0-0) Granular', category: 'Fertilizer', unit: 'Bags (50kg)', unitCostGHS: 420 },
  { itemCode: 'SEED-Pioneer-M3', name: 'Pioneer Hybrid Yellow Maize Seed (P30Y87)', category: 'Seed', unit: 'KG', unitCostGHS: 45 },
  { itemCode: 'SEED-JAFFA-SOY', name: 'Jaffa Non-GMO High Yield Soybean Seed', category: 'Seed', unit: 'KG', unitCostGHS: 52 },
  { itemCode: 'AGRO-Glyph-480', name: 'Sunphosate Glyphosate 480SL Herbicide', category: 'Agrochemical', unit: 'Litres', unitCostGHS: 65 },
  { itemCode: 'AGRO-ATRA-500', name: 'Atrazine 500 SC Selective Herbicide', category: 'Agrochemical', unit: 'Litres', unitCostGHS: 78 },
];

export const COOPERATIVE_CLUSTERS = [
  'Nyankpala Grain Outgrowers',
  'Northern Women Soy Co-op',
  'Ejura Commercial Farmers Association',
  'Techiman Cashew Producers Syndicate',
  'Kpong Irrigation Rice Federation',
  'Savelugu Young Farmers Hub',
];
