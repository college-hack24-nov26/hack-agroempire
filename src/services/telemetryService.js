/**
 * Krushi Drushti - IoT Sensor Telemetry & Smart Irrigation Service
 */

import { firebaseService } from './firebaseService.js';

class TelemetryService {
  /**
   * Get all sensor telemetry nodes
   */
  async getAllTelemetry() {
    const raw = await firebaseService.get('sensor_telemetry');
    if (!raw) return [];
    return Object.values(raw);
  }

  /**
   * Get telemetry for a specific farmer or device
   */
  async getByFarmerId(farmerId) {
    const all = await this.getAllTelemetry();
    return all.filter((t) => t.farmerId === farmerId);
  }

  /**
   * Ingest a new sensor packet from IoT field nodes
   */
  async ingestTelemetry({ farmerId, deviceId, zone, soilMoisturePercent, ambientTempC, humidityPercent }) {
    const id = `telemetry_${deviceId || Date.now()}`;
    const triggerThreshold = 35.0;
    const stopThreshold = 75.0;

    // Smart Irrigation Logic
    let pumpStatus = 'OFF';
    let actionRecommendation = 'Soil moisture is optimal.';

    if (soilMoisturePercent < triggerThreshold) {
      pumpStatus = 'ON';
      actionRecommendation = `🚨 Low soil moisture (${soilMoisturePercent}% < ${triggerThreshold}%). Drip pump activated.`;
    } else if (soilMoisturePercent > stopThreshold) {
      pumpStatus = 'OFF';
      actionRecommendation = `💧 Soil adequately saturated (${soilMoisturePercent}%). Drip pump deactivated.`;
    }

    const telemetryRecord = {
      id,
      farmerId: farmerId || 'farmer_001',
      deviceId: deviceId || 'KD-IOT-GENERIC',
      zone: zone || 'Plot A',
      soilMoisturePercent: Number(soilMoisturePercent),
      ambientTempC: Number(ambientTempC || 28),
      humidityPercent: Number(humidityPercent || 60),
      pumpStatus,
      actionRecommendation,
      automationMode: 'AUTO_SMART_IRRIGATION',
      lastReadingTime: new Date().toISOString()
    };

    await firebaseService.set(`sensor_telemetry/${id}`, telemetryRecord);
    return telemetryRecord;
  }
}

export const telemetryService = new TelemetryService();

