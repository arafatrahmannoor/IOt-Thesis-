#include "HttpModule.h"
#include <WiFi.h>

HttpModule::HttpModule()
    : url("http://192.168.0.238:5001"),
      lastRequest(0),
      dataSendingEnabled(false)
{
}

void HttpModule::begin()
{
  lastRequest = millis();
}

void HttpModule::begin(const char *customUrl)
{
  url = customUrl;
  lastRequest = millis();
}

void HttpModule::update()
{
  unsigned long now = millis();

  if (now - lastRequest >= HTTP_INTERVAL_MS)
  {
    if (WiFi.status() == WL_CONNECTED)
    {
      makeRequest();
    }
    lastRequest = now;
  }
}

void HttpModule::makeRequest()
{
  HTTPClient http;
  http.begin(url);

  int httpCode = http.GET();

  if (httpCode > 0)
  {
    String payload = http.getString();
    Serial.println("HTTP Response:");
    Serial.println(payload);
  }
  else
  {
    Serial.print("HTTP GET Error: ");
    Serial.println(httpCode);
  }

  http.end();
}

void HttpModule::enableDataSending(bool enabled)
{
  dataSendingEnabled = enabled;
}

// Send current measurements (live data)
void HttpModule::sendHealthData(float tempC, float tempF, int spo2, int heartRate,
                                bool isOnline, bool hasInternet, int wifiSignal)
{
  if (!dataSendingEnabled || WiFi.status() != WL_CONNECTED)
  {
    return;
  }

  HTTPClient http;
  String endpoint = url;
  endpoint += "/profile";

  http.begin(endpoint);
  http.addHeader("Content-Type", "application/json");

  // Create JSON for current values
  StaticJsonDocument<256> doc;
  doc["Temp_C"] = tempC;
  doc["Temp_F"] = tempF;
  doc["SpO2"] = spo2;
  doc["BPM"] = heartRate;
  doc["isOnline"] = isOnline;
  doc["hasInternet"] = hasInternet;
  doc["wifiSignal"] = wifiSignal;
  doc["timestamp"] = millis();

  String jsonStr;
  serializeJson(doc, jsonStr);

  int httpCode = http.POST(jsonStr);

  if (httpCode > 0)
  {
    Serial.println("[CURRENT] Health data sent to backend");
    String response = http.getString();
    Serial.println(response);
  }
  else
  {
    Serial.print("[CURRENT] HTTP POST Error: ");
    Serial.println(httpCode);
  }

  http.end();
}

// Send peak measurements (ML model analysis)
void HttpModule::sendPeakHealthData(float peakTempC, float peakTempF, int peakSpO2,
                                    int peakHeartRate, bool isOnline, bool hasInternet,
                                    int wifiSignal)
{
  if (!dataSendingEnabled || WiFi.status() != WL_CONNECTED)
  {
    return;
  }

  HTTPClient http;
  String endpoint = url;
  endpoint += "/api/health/peak-measurements";

  http.begin(endpoint);
  http.addHeader("Content-Type", "application/json");

  // Create JSON for peak values - NESTED STRUCTURE
  StaticJsonDocument<512> doc;
  doc["deviceId"] = "ESP32_HealthMonitor";
  doc["timestamp"] = millis();

  JsonObject peakValues = doc.createNestedObject("peakValues");
  peakValues["temperatureC"] = peakTempC;
  peakValues["temperatureF"] = peakTempF;
  peakValues["spo2"] = peakSpO2;
  peakValues["heartRate"] = peakHeartRate;

  doc["isOnline"] = isOnline;
  doc["hasInternet"] = hasInternet;
  doc["wifiSignalStrength"] = wifiSignal;

  String jsonStr;
  serializeJson(doc, jsonStr);

  Serial.print("[PEAK] Sending peak values: Temp=");
  Serial.print(peakTempC);
  Serial.print("°C, SpO2=");
  Serial.print(peakSpO2);
  Serial.print("%, BPM=");
  Serial.println(peakHeartRate);

  int httpCode = http.POST(jsonStr);

  if (httpCode > 0)
  {
    Serial.println("[PEAK] Peak health data sent to ML backend");
    String response = http.getString();
    Serial.println(response);
  }
  else
  {
    Serial.print("[PEAK] HTTP POST Error: ");
    Serial.println(httpCode);
  }

  http.end();
}

// Send device status
void HttpModule::sendDeviceStatus(bool isOnline, bool hasInternet, String wifiName, int wifiSignal)
{
  if (WiFi.status() != WL_CONNECTED)
  {
    return;
  }

  HTTPClient http;
  String endpoint = url;
  endpoint += "/api/health/device-status";

  http.begin(endpoint);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<256> doc;
  doc["deviceId"] = "ESP32_HealthMonitor";
  doc["isOnline"] = isOnline;
  doc["hasInternet"] = hasInternet;
  doc["wifiName"] = wifiName;
  doc["wifiSignal"] = wifiSignal;
  doc["timestamp"] = millis();

  String jsonStr;
  serializeJson(doc, jsonStr);

  int httpCode = http.POST(jsonStr);

  if (httpCode > 0)
  {
    Serial.println("[STATUS] Device status sent");
  }
  else
  {
    Serial.print("[STATUS] HTTP POST Error: ");
    Serial.println(httpCode);
  }

  http.end();
}

// Check for forget WiFi command
bool HttpModule::checkForgetWiFiCommand()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    return false;
  }

  HTTPClient http;
  String endpoint = url;
  endpoint += "/api/health/commands";

  http.begin(endpoint);

  int httpCode = http.GET();

  bool shouldForget = false;

  if (httpCode == 200)
  {
    String response = http.getString();
    if (response.indexOf("forgetWiFi") != -1)
    {
      shouldForget = true;
    }
  }

  http.end();
  return shouldForget;
}
