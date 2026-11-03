/**
 * Krushi Drushti (कृषी दृष्टी) - Master Seed Dataset
 * Contains authentic Indian agricultural data in English, Hindi (हिंदी), and Marathi (मराठी)
 */

export const SEED_DATA = {
  system: {
    name: 'Krushi Drushti Smart Agriculture Platform',
    version: '1.0.0',
    status: 'ACTIVE',
    lastSync: new Date().toISOString(),
    supportedLanguages: ['en', 'hi', 'mr'],
    targetRegion: 'India (All Agro-Climatic Zones)'
  },

  farmers: {
    farmer_001: {
      id: 'farmer_001',
      name: 'Ramesh Balasaheb Patil',
      name_mr: 'रमेश बाळासाहेब पाटील',
      phone: '+919822012345',
      state: 'Maharashtra',
      district: 'Nashik',
      taluka: 'Niphad',
      village: 'Pimpalgaon Baswant',
      language: 'mr',
      landHoldingAcres: 6.5,
      soilType: 'Black Clay Loam (काळी कसदार जमीन)',
      irrigationSource: 'Drip Irrigation & Well (ठिबक सिंचन व विहीर)',
      activeCrops: ['crop_onion', 'crop_tomato', 'crop_soybean'],
      createdAt: '2026-01-15T08:00:00.000Z'
    },
    farmer_002: {
      id: 'farmer_002',
      name: 'Gurpreet Singh Dhillon',
      name_hi: 'गुरप्रीत सिंह ढिल्लों',
      phone: '+919876543210',
      state: 'Punjab',
      district: 'Ludhiana',
      taluka: 'Samrala',
      village: 'Kotla',
      language: 'hi',
      landHoldingAcres: 14.0,
      soilType: 'Alluvial Loam',
      irrigationSource: 'Tubewell & Canal',
      activeCrops: ['crop_wheat', 'crop_rice'],
      createdAt: '2026-02-10T10:30:00.000Z'
    },
    farmer_003: {
      id: 'farmer_003',
      name: 'Suresh Chandra Sharma',
      name_hi: 'सुरेश चंद्र शर्मा',
      phone: '+919425098765',
      state: 'MadhyaPradesh',
      district: 'Indore',
      taluka: 'Sanwer',
      village: 'Chandrawatiganj',
      language: 'hi',
      landHoldingAcres: 8.0,
      soilType: 'Medium Black Soil',
      irrigationSource: 'Borewell & Sprinkler',
      activeCrops: ['crop_soybean', 'crop_cotton', 'crop_wheat'],
      createdAt: '2026-03-01T09:15:00.000Z'
    }
  },

  crops: {
    crop_onion: {
      id: 'crop_onion',
      name: { en: 'Onion', hi: 'प्याज', mr: 'कांदा' },
      scientificName: 'Allium cepa',
      category: 'vegetable',
      season: 'Rabi / Kharif / Late Kharif',
      durationDays: 120,
      waterRequirementMm: '350 - 550 mm',
      idealSoilPh: '6.0 - 7.5',
      recommendedFertilizers: {
        basal: 'DAP 50kg + MOP 50kg + Sulphur 10kg per acre',
        topDressing: 'Urea 30kg at 30 days and 45 days after transplanting'
      },
      commonDiseases: ['Purple Blotch (जांभळा करपा)', 'Stemphylium Leaf Blight', 'Thrips infestation']
    },
    crop_tomato: {
      id: 'crop_tomato',
      name: { en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो' },
      scientificName: 'Solanum lycopersicum',
      category: 'vegetable',
      season: 'Kharif / Rabi / Summer',
      durationDays: 135,
      waterRequirementMm: '400 - 600 mm',
      idealSoilPh: '6.0 - 7.0',
      recommendedFertilizers: {
        basal: '10:26:26 (100kg) + Neem Cake (150kg)',
        fertigation: '19:19:19 (3kg/acre weekly) during vegetative, 0:52:34 during flowering'
      },
      commonDiseases: ['Early Blight (अल्टरनेरिया करपा)', 'Late Blight', 'Tomato Yellow Leaf Curl Virus', 'Fruit Borer']
    },
    crop_cotton: {
      id: 'crop_cotton',
      name: { en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
      scientificName: 'Gossypium hirsutum',
      category: 'cash_crop',
      season: 'Kharif',
      durationDays: 160,
      waterRequirementMm: '600 - 800 mm',
      idealSoilPh: '6.5 - 8.0',
      recommendedFertilizers: {
        basal: '12:32:16 (50kg) + Magnesium Sulphate (10kg)',
        topDressing: 'Urea (25kg) split at squaring and boll formation'
      },
      commonDiseases: ['Pink Bollworm (गुलाबी बोंडअळी)', 'Bacterial Leaf Blight', 'Cotton Leaf Curl Virus']
    },
    crop_soybean: {
      id: 'crop_soybean',
      name: { en: 'Soybean', hi: 'सोयाबीन', mr: 'सोयाबीन' },
      scientificName: 'Glycine max',
      category: 'oilseed',
      season: 'Kharif',
      durationDays: 95,
      waterRequirementMm: '450 - 650 mm',
      idealSoilPh: '6.0 - 7.5',
      recommendedFertilizers: {
        basal: 'Single Super Phosphate (SSP) 100kg + MOP 25kg + Rhizobium seed treatment',
        topDressing: 'Foliar spray of 19:19:19 at flowering'
      },
      commonDiseases: ['Soybean Rust (सोयाबीन तांबेरा)', 'Yellow Mosaic Virus', 'Girdle Beetle']
    },
    crop_wheat: {
      id: 'crop_wheat',
      name: { en: 'Wheat', hi: 'गेहूं', mr: 'गहू' },
      scientificName: 'Triticum aestivum',
      category: 'cereal',
      season: 'Rabi',
      durationDays: 120,
      waterRequirementMm: '300 - 400 mm',
      idealSoilPh: '6.0 - 7.5',
      recommendedFertilizers: {
        basal: 'DAP 55kg + MOP 20kg per acre',
        topDressing: 'Urea 35kg at first irrigation (CRI stage) and 35kg at tillering'
      },
      commonDiseases: ['Yellow Rust (पीला रतुआ)', 'Brown Rust', 'Karnal Bunt']
    }
  },

  diagnostics: {
    diag_001: {
      id: 'diag_001',
      farmerId: 'farmer_001',
      crop: 'Tomato',
      crop_mr: 'टोमॅटो',
      diseaseDetected: 'Early Blight (Alternaria solani)',
      disease_mr: 'अल्टरनेरिया करपा (अर्ली ब्लाईट)',
      disease_hi: 'अगेती झुलसा रोग (अर्ली ब्लाइट)',
      confidenceScore: 0.94,
      severity: 'HIGH',
      symptoms: {
        en: 'Concentric dark brown circular rings on older leaves, lower leaves turning yellow and dropping prematurely.',
        mr: 'जुन्या पानांवर गोलाकार तपकिरी ते काळे वलय (कडा) दिसणे, खालची पाने पिवळी पडून गळणे.',
        hi: 'निचली पत्तियों पर गहरे भूरे रंग के संकेंद्री गोल धब्बे और पत्तियों का पीला पड़कर गिरना।'
      },
      treatment: {
        organic: {
          en: 'Spray Trichoderma harzianum (5g/L) or Neem seed kernel extract (NSKE 5%) every 7 days.',
          mr: 'ट्रायकोडर्मा व्हिरीडी (५ ग्रॅम/लिटर) किंवा ५% निंबोळी अर्क दर ७ दिवसांच्या अंतराने फवारा.',
          hi: 'ट्राइकोडर्मा (5 ग्राम/लीटर) या 5% नीम तेल का 7 दिनों के अंतराल पर छिड़काव करें।'
        },
        chemical: {
          en: 'Mancozeb 75% WP @ 2.5g/L water OR Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L.',
          mr: 'मॅन्कोझेब ७५% WP (२.५ ग्रॅम/लिटर) किंवा अझॉक्सीस्ट्रॉबिन + डायफेनोकोनाझोल (१ मिली/लिटर) फवारा.',
          hi: 'मैंकोजेब 75% WP (2.5 ग्राम/लीटर) अथवा एज़ोक्सीस्ट्रोबिन + डाइफेनोकोनाज़ोल (1 मिली/लीटर) का छिड़काव करें।'
        },
        prevention: {
          en: 'Avoid overhead sprinkler irrigation on tomato foliage. Remove infected lower leaves and burn them.',
          mr: 'तुषार सिंचनाचा वापर टाळा, ठिबक सिंचन वापरा. प्रादुर्भाव झालेली पाने काढून नष्ट करा.',
          hi: 'फव्वारा सिंचाई से बचें। संक्रमित पत्तियों को तोड़कर नष्ट कर दें।'
        }
      },
      timestamp: '2026-11-02T10:15:00.000Z'
    },
    diag_002: {
      id: 'diag_002',
      farmerId: 'farmer_001',
      crop: 'Onion',
      crop_mr: 'कांदा',
      diseaseDetected: 'Purple Blotch (Alternaria porri)',
      disease_mr: 'जांभळा करपा (पर्पल ब्लॉच)',
      disease_hi: 'बैंगनी धब्बा रोग (पर्पल ब्लॉच)',
      confidenceScore: 0.91,
      severity: 'MODERATE',
      symptoms: {
        en: 'Water-soaked small lesions on leaves rapidly turning purple-brown with yellow halo.',
        mr: 'पानांवर पांढरट खोलगट ठिपके पडणे व नंतर ते जांभळट तपकिरी रंगाचे होऊन पाने वाळणे.',
        hi: 'पत्तियों पर छोटे पानी जैसे धब्बे जो बाद में गहरे बैंगनी रंग में बदल जाते हैं।'
      },
      treatment: {
        organic: {
          en: 'Pseudomonas fluorescens 10g/L + sticker agent.',
          mr: 'स्युडोमोनास फ्लुरोसन्स (१० ग्रॅम/लिटर) + स्टिकर (चिकटणारा डिंक) मिसळून फवारा.',
          hi: 'स्यूडोमोनास फ्लोरोसेंस (10 ग्राम/लीटर) स्टिकर के साथ छिड़कें।'
        },
        chemical: {
          en: 'Tebuconazole 25.9% EC @ 1.5ml/L OR Chlorothalonil 75% WP @ 2g/L.',
          mr: 'टेबुकोनाझोल २५.९% EC (१.५ मिली/लिटर) किंवा क्लोरोथॅलोनिल (२ ग्रॅम/लिटर) फवारा.',
          hi: 'टेबुकोनाज़ोल 25.9% EC (1.5 मिली/लीटर) का छिड़काव करें।'
        },
        prevention: {
          en: 'Control onion thrips early as thrips puncture wounds invite purple blotch fungus.',
          mr: 'फुलकिड्यांचे (थ्रिप्स) वेळेवर नियंत्रण करा, कारण त्यांच्या जखमांमुळे करपा वेगाने पसरतो.',
          hi: 'थ्रिप्स कीटों का समय पर नियंत्रण करें क्योंकि उनके घाव से कवक तेजी से फैलता है।'
        }
      },
      timestamp: '2026-11-01T14:40:00.000Z'
    }
  },

  mandi_prices: {
    mandi_001: {
      id: 'mandi_001',
      market: 'Lasalgaon APMC',
      state: 'Maharashtra',
      district: 'Nashik',
      commodity: 'Onion (कांदा)',
      variety: 'Red Onion / Gavran',
      minPrice: 1850,
      maxPrice: 2650,
      modalPrice: 2320,
      unit: '₹ / Quintal',
      arrivalQuantity: '18500 Quintals',
      trend: 'UP',
      trendPercent: '+4.2%',
      arrivalDate: '2026-11-03'
    },
    mandi_002: {
      id: 'mandi_002',
      market: 'Pimpalgaon Baswant APMC',
      state: 'Maharashtra',
      district: 'Nashik',
      commodity: 'Tomato (टोमॅटो)',
      variety: 'Hybrid Tomato (अभिनव/साहो)',
      minPrice: 1200,
      maxPrice: 1950,
      modalPrice: 1650,
      unit: '₹ / Quintal',
      arrivalQuantity: '9200 Crates',
      trend: 'STABLE',
      trendPercent: '0.0%',
      arrivalDate: '2026-11-03'
    },
    mandi_003: {
      id: 'mandi_003',
      market: 'Nagpur APMC (Cotton Market)',
      state: 'Maharashtra',
      district: 'Nagpur',
      commodity: 'Cotton (कापूस)',
      variety: 'Medium Staple BT Cotton',
      minPrice: 6850,
      maxPrice: 7550,
      modalPrice: 7280,
      unit: '₹ / Quintal',
      arrivalQuantity: '4500 Quintals',
      trend: 'UP',
      trendPercent: '+2.1%',
      arrivalDate: '2026-11-03'
    },
    mandi_004: {
      id: 'mandi_004',
      market: 'Indore Mandi',
      state: 'MadhyaPradesh',
      district: 'Indore',
      commodity: 'Soybean (सोयाबीन)',
      variety: 'Yellow Soybean JS-9560',
      minPrice: 4200,
      maxPrice: 4850,
      modalPrice: 4620,
      unit: '₹ / Quintal',
      arrivalQuantity: '22000 Quintals',
      trend: 'UP',
      trendPercent: '+1.8%',
      arrivalDate: '2026-11-03'
    },
    mandi_005: {
      id: 'mandi_005',
      market: 'Khanna Grain Market',
      state: 'Punjab',
      district: 'Ludhiana',
      commodity: 'Wheat (गेहूं)',
      variety: 'PBW 826 / Sharbati',
      minPrice: 2275,
      maxPrice: 2550,
      modalPrice: 2420,
      unit: '₹ / Quintal',
      arrivalQuantity: '14000 Quintals',
      trend: 'STABLE',
      trendPercent: '+0.5%',
      arrivalDate: '2026-11-03'
    }
  },

  weather_advisories: {
    weather_nashik: {
      id: 'weather_nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      temperatureC: 28.5,
      tempMinC: 18.2,
      tempMaxC: 31.0,
      humidityPercent: 62,
      rainProbabilityPercent: 15,
      windSpeedKmph: 11.2,
      condition: 'Partly Sunny / निरभ्र ते अंशतः ढगाळ',
      sprayAdvisory: {
        suitableForSpraying: true,
        bestWindow: '07:00 AM - 10:30 AM & 04:30 PM - 06:30 PM',
        advisory_mr: 'हवामान फवारणीसाठी अनुकूल आहे. दुपारचे कडक ऊन टाळा व सकाळी १०:३० पूर्वी फवारणी पूर्ण करा.',
        advisory_hi: 'छिड़काव के लिए मौसम अनुकूल है। दोपहर की तेज धूप से बचें और सुबह 10:30 से पहले छिड़काव करें।',
        advisory_en: 'Weather is favorable for pesticide/fertilizer spraying. Complete application before 10:30 AM to avoid heat evaporation.'
      },
      updatedAt: '2026-11-03T06:00:00.000Z'
    },
    weather_ludhiana: {
      id: 'weather_ludhiana',
      district: 'Ludhiana',
      state: 'Punjab',
      temperatureC: 24.0,
      tempMinC: 14.5,
      tempMaxC: 27.0,
      humidityPercent: 55,
      rainProbabilityPercent: 5,
      windSpeedKmph: 8.5,
      condition: 'Sunny & Clear',
      sprayAdvisory: {
        suitableForSpraying: true,
        bestWindow: '08:00 AM - 11:30 AM',
        advisory_mr: 'गहू पेरणीसाठी अनुकूल तापमान आहे.',
        advisory_hi: 'गेहूं की बुवाई और खेत तैयार करने के लिए उपयुक्त समय है।',
        advisory_en: 'Ideal weather for field preparation and early Rabi sowing.'
      },
      updatedAt: '2026-11-03T06:00:00.000Z'
    }
  },

  community: {
    post_001: {
      id: 'post_001',
      authorId: 'farmer_001',
      authorName: 'Ramesh Balasaheb Patil',
      district: 'Nashik',
      state: 'Maharashtra',
      category: 'Crop Care',
      title: 'कांद्यावरील जांभळा करपा नियंत्रण कसे करावे? (How to control purple blotch in onion?)',
      content: 'गेल्या आठवड्यात ढगाळ वातावरणामुळे कांद्याच्या पाथीवर जांभळे चट्टे पडत आहेत. कोणते जैविक औषध सर्वात गुणकारी ठरेल?',
      likesCount: 18,
      repliesCount: 4,
      verifiedAgronomistReply: 'कृषी दृष्टी तज्ज्ञ सल्ला: ट्रायकोडर्मा व स्युडोमोनास एकत्र करून आळवणी करा आणि हवेत आर्द्रता जास्त असल्यास टेबुकोनाझोल १.५ मिली प्रति लिटर फवारा.',
      timestamp: '2026-11-02T16:20:00.000Z'
    },
    post_002: {
      id: 'post_002',
      authorId: 'farmer_003',
      authorName: 'Suresh Chandra Sharma',
      district: 'Indore',
      state: 'MadhyaPradesh',
      category: 'Market Trends',
      title: 'सोयाबीन के भाव में आने वाले हफ्ते में क्या तेजी की उम्मीद है?',
      content: 'इंदौर मंडी में आज 4620 का भाव मिला। क्या माल रोककर रखना चाहिए या बेच देना बेहतर रहेगा?',
      likesCount: 29,
      repliesCount: 7,
      verifiedAgronomistReply: 'निर्यात मांग स्थिर है और आवक कम होने से अगले 10-15 दिनों में ₹150-200 की बढ़त संभावित है। धीरे-धीरे चरणों में बिक्री करें।',
      timestamp: '2026-11-03T09:00:00.000Z'
    }
  },

  schemes: {
    scheme_pm_kisan: {
      id: 'scheme_pm_kisan',
      name: 'PM-KISAN Samman Nidhi Yojana',
      name_mr: 'प्रधानमंत्री किसान सन्मान निधी योजना',
      name_hi: 'प्रधानमंत्री किसान सम्मान निधि योजना',
      benefit: '₹6,000 / year (in 3 installments of ₹2,000 direct to bank account via DBT)',
      eligibility: 'All landholding farmer families in India with cultivable land in their name.',
      howToApply: 'Apply online via pmkisan.gov.in or through nearest CSC (Common Service Center) with Aadhaar and 7/12 land records.',
      status: 'ACTIVE',
      officialPortal: 'https://pmkisan.gov.in'
    },
    scheme_pmfby: {
      id: 'scheme_pmfby',
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      name_mr: 'प्रधानमंत्री पीक विमा योजना (१ रुपयात पीक विमा)',
      name_hi: 'प्रधानमंत्री फसल बीमा योजना',
      benefit: 'Comprehensive crop insurance coverage against drought, flood, pests, and unseasonal rains.',
      eligibility: 'All farmers cultivating notified crops in notified areas.',
      howToApply: 'Online on pmfby.gov.in or at bank branches before crop cut-off dates.',
      status: 'ACTIVE',
      officialPortal: 'https://pmfby.gov.in'
    },
    scheme_kusum: {
      id: 'scheme_kusum',
      name: 'PM-KUSUM Solar Pump Subsidy',
      name_mr: 'कुसुम सोलर कृषी पंप योजना',
      name_hi: 'पीएम-कुसुम सौर कृषि पंप योजना',
      benefit: 'Up to 90% subsidy on 3HP, 5HP, and 7.5HP off-grid and on-grid solar water pumps.',
      eligibility: 'Farmers with agricultural land having open well, borewell, or river water source but without electric pump connection.',
      howToApply: 'Apply through state nodal agencies (e.g., Mahaurja in Maharashtra).',
      status: 'ACTIVE',
      officialPortal: 'https://pmkusum.mnre.gov.in'
    }
  },

  sensor_telemetry: {
    telemetry_farm_001: {
      id: 'telemetry_farm_001',
      farmerId: 'farmer_001',
      deviceId: 'KD-IOT-NODE-784',
      zone: 'North Plot (Tomato Drip Zone A)',
      soilMoisturePercent: 44.5,
      soilTemperatureC: 22.8,
      ambientTempC: 29.2,
      humidityPercent: 58.0,
      pumpStatus: 'OFF',
      automationMode: 'AUTO_SMART_IRRIGATION',
      irrigationThreshold: {
        triggerBelowPercent: 35.0,
        stopAbovePercent: 75.0
      },
      lastReadingTime: '2026-11-03T11:45:00.000Z'
    }
  }
};

