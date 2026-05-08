#ifndef HTTP_MODULE_H
#define HTTP_MODULE_H

#include <HTTPClient.h>
#include <ArduinoJson.h>

#define HTTP_INTERVAL_MS 5000

class HttpModule
{
private:
  String url;
  unsigned long lastRequest;
  bool dataSendingEnabled;

public:
  HttpModule();
  void begin();
  void begin(const char *customUrl);
  void update();
  void makeRequest();

  // Data sending functions
  void enableDataSending(bool enabled);

  // Current measurements
  void sendHealthData(float tempC, float tempF, int spo2, int heartRate,
                      bool isOnline, bool hasInternet, int wifiSignal);

  // Peak measurements (for ML model)
  void sendPeakHealthData(float peakTempC, float peakTempF, int peakSpO2,
                          int peakHeartRate, bool isOnline, bool hasInternet,
                          int wifiSignal);

  // Device status
  void sendDeviceStatus(bool isOnline, bool hasInternet, String wifiName, int wifiSignal);

  // Check commands from server
  bool checkForgetWiFiCommand();
};

#endif
