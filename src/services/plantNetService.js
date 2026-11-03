/**
 * Pl@ntNet AI Botanical Vision & Plant Identification Service
 * Krushi Drushti (कृषी दृष्टी)
 */

import { PLANTNET_CONFIG } from '../config/plantnet.js';
import { firebaseService } from './firebaseService.js';

// Mapping from Botanical Scientific Names to Indian Agricultural Crops
const BOTANICAL_CROP_DICTIONARY = [
  {
    genus: 'Solanum',
    species: 'Solanum lycopersicum',
    cropKey: 'Tomato',
    name_mr: 'टोमॅटो',
    name_hi: 'टमाटर',
    commonNames: ['tomato', 'garden tomato']
  },
  {
    genus: 'Allium',
    species: 'Allium cepa',
    cropKey: 'Onion',
    name_mr: 'कांदा',
    name_hi: 'प्याज',
    commonNames: ['onion', 'garden onion']
  },
  {
    genus: 'Gossypium',
    species: 'Gossypium hirsutum',
    cropKey: 'Cotton',
    name_mr: 'कापूस',
    name_hi: 'कपास',
    commonNames: ['cotton', 'upland cotton']
  },
  {
    genus: 'Glycine',
    species: 'Glycine max',
    cropKey: 'Soybean',
    name_mr: 'सोयाबीन',
    name_hi: 'सोयाबीन',
    commonNames: ['soybean', 'soya bean']
  },
  {
    genus: 'Saccharum',
    species: 'Saccharum officinarum',
    cropKey: 'Sugarcane',
    name_mr: 'ऊस',
    name_hi: 'गन्ना',
    commonNames: ['sugarcane', 'sugar cane']
  },
  {
    genus: 'Triticum',
    species: 'Triticum aestivum',
    cropKey: 'Wheat',
    name_mr: 'गहू',
    name_hi: 'गेहूं',
    commonNames: ['wheat', 'common wheat']
  },
  {
    genus: 'Oryza',
    species: 'Oryza sativa',
    cropKey: 'Rice',
    name_mr: 'भात',
    name_hi: 'धान',
    commonNames: ['rice', 'asian rice']
  },
  {
    genus: 'Punica',
    species: 'Punica granatum',
    cropKey: 'Pomegranate',
    name_mr: 'डाळिंब',
    name_hi: 'अनार',
    commonNames: ['pomegranate']
  },
  {
    genus: 'Capsicum',
    species: 'Capsicum annuum',
    cropKey: 'Chilli',
    name_mr: 'मिरची',
    name_hi: 'मिर्च',
    commonNames: ['chilli', 'pepper', 'hot pepper']
  },
  {
    genus: 'Zea',
    species: 'Zea mays',
    cropKey: 'Maize',
    name_mr: 'मका',
    name_hi: 'मक्का',
    commonNames: ['maize', 'corn']
  }
];

class PlantNetService {
  constructor() {
    this.apiKey = PLANTNET_CONFIG.apiKey;
    this.baseUrl = PLANTNET_CONFIG.baseUrl;
    this.cachedRemainingRequests = null;
  }

  /**
   * Check Pl@ntNet API status and available projects
   */
  async getStatus() {
    try {
      const url = `${this.baseUrl}/projects?api-key=${this.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Pl@ntNet API returned status ${res.status}`);
      }
      const projects = await res.json();
      return {
        online: true,
        apiKeyConfigured: true,
        remainingRequests: this.cachedRemainingRequests,
        projectsCount: projects.length,
        defaultProject: PLANTNET_CONFIG.defaultProject,
        indianProjectAvailable: projects.some(p => p.id === 'k-indian-subcontinent')
      };
    } catch (err) {
      return {
        online: false,
        apiKeyConfigured: !!this.apiKey,
        error: err.message
      };
    }
  }

  /**
   * Identifies plant species from an image buffer using Pl@ntNet API
   * @param {Object} options
   * @param {Buffer} options.imageBuffer - Image file buffer
   * @param {string} options.mimeType - e.g. 'image/jpeg' or 'image/png'
   * @param {string} options.filename - e.g. 'leaf.jpg'
   * @param {string} options.organ - 'leaf', 'flower', 'fruit', 'bark', 'auto'
   * @param {string} options.project - Pl@ntNet project e.g. 'all', 'useful', 'k-indian-subcontinent'
   * @param {string} options.lang - Localized language e.g. 'en', 'fr'
   */
  async identifyPlant({
    imageBuffer,
    mimeType = 'image/jpeg',
    filename = 'leaf.jpg',
    organ = 'leaf',
    project = 'all',
    lang = 'en'
  }) {
    if (!this.apiKey) {
      throw new Error('Pl@ntNet API Key is not configured');
    }

    if (!imageBuffer) {
      throw new Error('Image buffer is required for Pl@ntNet identification');
    }

    const form = new FormData();
    const blob = new Blob([imageBuffer], { type: mimeType });
    form.append('images', blob, filename);
    form.append('organs', organ || 'leaf');

    const targetUrl = `${this.baseUrl}/identify/${project}?api-key=${this.apiKey}&lang=${lang}&no-reject=true`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(targetUrl, {
      method: 'POST',
      body: form,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorBody = await res.text();
      let parsed;
      try { parsed = JSON.parse(errorBody); } catch (_) { parsed = { message: errorBody }; }
      throw new Error(`Pl@ntNet API failed (${res.status}): ${parsed.message || errorBody}`);
    }

    const data = await res.json();
    this.cachedRemainingRequests = data.remainingIdentificationRequests;

    // Cache remaining quota to Firebase RTDB
    if (data.remainingIdentificationRequests !== undefined) {
      firebaseService.set('system/plantNetRemainingRequests', data.remainingIdentificationRequests).catch(() => {});
    }

    const results = data.results || [];
    const topResult = results[0] || null;

    if (!topResult) {
      return {
        identified: false,
        confidenceScore: 0,
        message: 'No matching botanical species found',
        remainingRequests: data.remainingIdentificationRequests
      };
    }

    const species = topResult.species || {};
    const scientificName = species.scientificNameWithoutAuthor || species.scientificName || 'Unknown';
    const commonNames = species.commonNames || [];
    const genus = species.genus?.scientificName || '';
    const family = species.family?.scientificName || '';
    const confidenceScore = Number((topResult.score || 0).toFixed(4));

    // Map to Indian crop dictionary
    const mappedCrop = this.mapToIndianCrop({ scientificName, genus, commonNames });

    return {
      identified: true,
      scientificName,
      commonNames,
      genus,
      family,
      confidenceScore,
      organ: topResult.images?.[0]?.organ || organ,
      mappedCrop,
      remainingRequests: data.remainingIdentificationRequests,
      topCandidates: results.slice(0, 3).map(r => ({
        scientificName: r.species.scientificNameWithoutAuthor,
        commonNames: r.species.commonNames || [],
        score: Number((r.score || 0).toFixed(4))
      }))
    };
  }

  /**
   * Matches Pl@ntNet botanical results against Indian agricultural crops
   */
  mapToIndianCrop({ scientificName = '', genus = '', commonNames = [] }) {
    const sLower = scientificName.toLowerCase();
    const gLower = genus.toLowerCase();
    const cNamesLower = commonNames.map(c => c.toLowerCase());

    for (const item of BOTANICAL_CROP_DICTIONARY) {
      if (item.species.toLowerCase() === sLower || item.genus.toLowerCase() === gLower) {
        return item;
      }
      for (const alias of item.commonNames) {
        if (cNamesLower.some(c => c.includes(alias)) || sLower.includes(alias)) {
          return item;
        }
      }
    }

    // Default fallback: return formatted name from Pl@ntNet common name or scientific name
    const primaryName = commonNames[0] || scientificName;
    return {
      genus,
      species: scientificName,
      cropKey: primaryName,
      name_mr: primaryName,
      name_hi: primaryName,
      commonNames
    };
  }
}

export const plantNetService = new PlantNetService();

