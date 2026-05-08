#ifndef HTTP_MODULE_H
#define HTTP_MODULE_H

#include <HTTPClient.h>
#include <WiFi.h>

#define HTTP_INTERVAL_MS 200 // Real-time: 200ms = 5 requests per second
#define SERVER_URL "http://192.168.0.238:5001"

class HttpModule
{
private:
  String serverUrl;
  unsigned long lastRequest;
  unsigned long lastStatusRequest;
  bool dataSendingEnabled;

public:
  HttpModule();
  void begin();
  void begin(const char *customUrl);
  void update();
  void makeRequest();

  // Methods for health data (current values)
  void sendHealthData(float tempC, float tempF, int spo2, int heartRate, bool isOnline, bool hasInternet, int wifiSignal = 0);

  // Methods for peak values (for ML model)
  void sendPeakHealthData(float peakTempC, float peakTempF, int peakSpO2, int peakHeartRate, bool isOnline, bool hasInternet, int wifiSignal = 0);
  void sendPeakDataToML(float peakTempC, float peakTempF, int peakSpO2, int peakHeartRate);

  // Device status and commands
  void sendDeviceStatus(bool isOnline, bool hasInternet, String wifiNetworkName, int wifiSignal);
  void enableDataSending(bool enable);
  bool isDataSendingEnabled();
  bool checkForgetWiFiCommand();

private:
  // Helper function to parse JSON response
  void extractAndPrintField(String json, String fieldName, String displayName);
};

#endif
