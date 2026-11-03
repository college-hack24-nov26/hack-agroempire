/**
 * Krushi Drushti - Hyperlocal Agro-Weather & Spray Advisory Service
 */

import { firebaseService } from './firebaseService.js';

class WeatherService {
  /**
   * Get weather advisories for all districts or a specific district
   */
  async getAdvisories(district = null) {
    const raw = await firebaseService.get('weather_advisories');
    if (!raw) return [];

    const list = Object.values(raw);
    if (district) {
      const q = district.toLowerCase();
      return list.filter((item) => item.district?.toLowerCase() === q);
    }
    return list;
  }

  /**
   * Evaluate real-time spray suitability window
   */
  evaluateSprayWindow({ temperatureC, humidityPercent, rainProbabilityPercent, windSpeedKmph }) {
    const isRainRisk = rainProbabilityPercent > 40;
    const isTooHot = temperatureC > 34;
    const isTooWindy = windSpeedKmph > 18;

    const suitable = !isRainRisk && !isTooHot && !isTooWindy;

    let warningEn = 'Conditions are optimal for spraying.';
    let warningMr = 'हवामान फवारणीसाठी अगदी योग्य आहे.';
    let warningHi = 'छिड़काव के लिए मौसम अनुकूल है।';

    if (isRainRisk) {
      warningEn = `High rain risk (${rainProbabilityPercent}%). Spray will get washed off.`;
      warningMr = `पावसाची शक्यता जास्त आहे (${rainProbabilityPercent}%). फवारणी वाहून जाण्याचा धोका आहे.`;
      warningHi = `बारिश की संभावना अधिक है (${rainProbabilityPercent}%)। छिड़काव धुलने का खतरा है।`;
    } else if (isTooWindy) {
      warningEn = `High wind speed (${windSpeedKmph} km/h). Spray drift will cause chemical loss.`;
      warningMr = `वारा जास्त वेगाने वाहत आहे (${windSpeedKmph} किमी/तास). औषध उडून जाईल.`;
      warningHi = `तेज हवा चल रही है (${windSpeedKmph} किमी/घंटा)। दवा उड़ने का नुकसान होगा।`;
    } else if (isTooHot) {
      warningEn = `Temperature too high (${temperatureC}°C). High chemical evaporation rate.`;
      warningMr = `तापमान जास्त आहे (${temperatureC}°C). औषध बाष्पीभवन होईल, सकाळी लवकर फवारा.`;
      warningHi = `तापमान अधिक है (${temperatureC}°C)। सुबह या शाम को छिड़काव करें।`;
    }

    return {
      suitable,
      safeWindow: suitable ? '07:00 AM - 10:30 AM & 04:30 PM - 06:30 PM' : 'UNFAVORABLE_TODAY',
      advisories: {
        en: warningEn,
        mr: warningMr,
        hi: warningHi
      }
    };
  }

  /**
   * Save or update weather advisory
   */
  async saveAdvisory(advisory) {
    const id = advisory.id || `weather_${advisory.district?.toLowerCase() || Date.now()}`;
    const payload = {
      id,
      ...advisory,
      updatedAt: new Date().toISOString()
    };
    await firebaseService.set(`weather_advisories/${id}`, payload);
    return payload;
  }
}

export const weatherService = new WeatherService();

