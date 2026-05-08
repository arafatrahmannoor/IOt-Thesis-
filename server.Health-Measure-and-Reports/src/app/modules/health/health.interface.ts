export interface IHealthData {
  deviceId: string;
  temperatureC: number;
  temperatureF: number;
  spo2: number;
  heartRate: number;
  isOnline: boolean;
  hasInternet: boolean;
  wifiSignalStrength?: number;
  timestamp?: Date;
}

export interface IDeviceStatus {
  deviceId: string;
  isOnline: boolean;
  hasInternet: boolean;
  wifiNetworkName?: string;
  wifiSignalStrength?: number;
  timestamp?: Date;
}
