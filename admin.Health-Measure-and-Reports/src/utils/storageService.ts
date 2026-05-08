interface HighestValues {
  temperatureC: number;
  spo2: number;
  heartRate: number;
  wifiSignalStrength: number;
  lastUpdated: string;
}

const STORAGE_KEY = "airduino_highest_values";

/**
 * Get highest values from localStorage
 */
export const getHighestValues = (): HighestValues | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading highest values from localStorage:", error);
    return null;
  }
};

/**
 * Save highest values to localStorage
 */
export const saveHighestValues = (values: Omit<HighestValues, "lastUpdated">): void => {
  try {
    const data: HighestValues = {
      ...values,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving highest values to localStorage:", error);
  }
};

/**
 * Update highest values - only updates if new value is higher
 */
export const updateHighestValues = (
  newValues: Partial<Omit<HighestValues, "lastUpdated">>
): HighestValues => {
  const current = getHighestValues();
  
  const updated: HighestValues = {
    temperatureC: Math.max(current?.temperatureC || 0, newValues.temperatureC || 0),
    spo2: Math.max(current?.spo2 || 0, newValues.spo2 || 0),
    heartRate: Math.max(current?.heartRate || 0, newValues.heartRate || 0),
    wifiSignalStrength: Math.max(
      current?.wifiSignalStrength || 0,
      newValues.wifiSignalStrength || 0
    ),
    lastUpdated: new Date().toISOString(),
  };

  saveHighestValues(updated);
  return updated;
};

/**
 * Clear highest values from localStorage
 */
export const clearHighestValues = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing highest values from localStorage:", error);
  }
};

/**
 * Reset highest values to initial state
 */
export const resetHighestValues = (): void => {
  const initialValues: Omit<HighestValues, "lastUpdated"> = {
    temperatureC: 0,
    spo2: 0,
    heartRate: 0,
    wifiSignalStrength: 0,
  };
  saveHighestValues(initialValues);
};

