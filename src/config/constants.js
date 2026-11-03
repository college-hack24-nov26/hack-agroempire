/**
 * Krushi Drushti (कृषी दृष्टी) - Constants & Localization Tables
 */

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr'];

export const SEVERITY_LEVELS = {
  HEALTHY: 'HEALTHY',
  LOW: 'LOW',
  MODERATE: 'MODERATE',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export const CROP_CATEGORIES = [
  'cereal',
  'pulse',
  'cash_crop',
  'vegetable',
  'fruit',
  'oilseed'
];

export const STATES_AND_DISTRICTS = {
  Maharashtra: [
    'Pune', 'Nashik', 'Nagpur', 'Aurangabad (Chhatrapati Sambhajinagar)',
    'Kolhapur', 'Solapur', 'Ahmednagar', 'Amravati', 'Jalgaon', 'Satara'
  ],
  Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
  MadhyaPradesh: ['Indore', 'Ujjain', 'Bhopal', 'Jabalpur', 'Dewas'],
  Gujarat: ['Rajkot', 'Ahmedabad', 'Surat', 'Vadodara', 'Junagadh'],
  Karnataka: ['Belagavi', 'Dharwad', 'Mysuru', 'Ballari', 'Shivamogga']
};

export const COMMON_CROPS = [
  { id: 'crop_cotton', name_en: 'Cotton', name_hi: 'कपास', name_mr: 'कापूस', category: 'cash_crop' },
  { id: 'crop_soybean', name_en: 'Soybean', name_hi: 'सोयाबीन', name_mr: 'सोयाबीन', category: 'oilseed' },
  { id: 'crop_sugarcane', name_en: 'Sugarcane', name_hi: 'गन्ना', name_mr: 'ऊस', category: 'cash_crop' },
  { id: 'crop_tomato', name_en: 'Tomato', name_hi: 'टमाटर', name_mr: 'टोमॅटो', category: 'vegetable' },
  { id: 'crop_onion', name_en: 'Onion', name_hi: 'प्याज', name_mr: 'कांदा', category: 'vegetable' },
  { id: 'crop_wheat', name_en: 'Wheat', name_hi: 'गेहूं', name_mr: 'गहू', category: 'cereal' },
  { id: 'crop_rice', name_en: 'Rice / Paddy', name_hi: 'धान / चावल', name_mr: 'भात', category: 'cereal' },
  { id: 'crop_pomegranate', name_en: 'Pomegranate', name_hi: 'अनार', name_mr: 'डाळिंब', category: 'fruit' }
];

