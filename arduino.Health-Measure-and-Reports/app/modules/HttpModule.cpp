#include "modules/HttpModule.h"
#include <WiFi.h>

HttpModule::HttpModule()
    : serverUrl(String(SERVER_URL)),
      lastRequest(0),
      lastStatusRequest(0),
      dataSendingEnabled(false)
{
}

void HttpModule::begin()
{
  lastRequest = millis();
  lastStatusRequest = millis();
  dataSendingEnabled = false;
  Serial.println("HTTP Module initialized. Use enableDataSending(true) to start sending data.");
}

void HttpModule::begin(const char *customUrl)
{
  serverUrl = String(customUrl);
  lastRequest = millis();
  lastStatusRequest = millis();
  dataSendingEnabled = false;
  Serial.println("✅ HTTP Module initialized with custom URL: " + serverUrl);
}

void HttpModule::enableDataSending(bool enable)
{
  dataSendingEnabled = enable;
  if (enable)
  {
    Serial.println("✅ Data sending enabled to: " + String(serverUrl));
  }
  else
  {
    Serial.println("❌ Data sending disabled");
  }
}

bool HttpModule::isDataSendingEnabled()
{
  return dataSendingEnabled;
}

void HttpModule::update()
{
  // This method is kept for backward compatibility but not used for health data
  // Health data is sent via sendHealthData() method
}

void HttpModule::makeRequest()
{
  // Legacy method - kept for compatibility
  HTTPClient http;
  WiFiClient client;
  http.begin(client, serverUrl);

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

void HttpModule::sendHealthData(float tempC, float tempF, int spo2, int heartRate, bool isOnline, bool hasInternet, int wifiSignal)
{
  // Health data sending - SAFE VERSION (5 second frequency, not 200ms)
  if (!dataSendingEnabled)
  {
    return;
  }

  if (WiFi.status() != WL_CONNECTED)
  {
    return;
  }

  unsigned long now = millis();
  unsigned long timeSinceLastRequest = now - lastRequest;

  // Rate limiting: Only send every 5 seconds to prevent memory leak
  if (timeSinceLastRequest < 5000)
  {
    return;
  }

  // Create HTTP client
  HTTPClient http;
  String endpoint = serverUrl + "/api/health/measurements";

  http.setTimeout(2000);

  WiFiClient client;
  if (!http.begin(client, endpoint))
  {
    http.end();
    return;
  }

  http.addHeader("Content-Type", "application/json");

  // Create JSON payload
  String jsonPayload = "{";
  jsonPayload += "\"deviceId\":\"ESP32_HealthMonitor\",";
  jsonPayload += "\"temperatureC\":" + String(tempC, 2) + ",";
  jsonPayload += "\"temperatureF\":" + String(tempF, 2) + ",";
  jsonPayload += "\"spo2\":" + String(spo2) + ",";
  jsonPayload += "\"heartRate\":" + String(heartRate) + ",";
  jsonPayload += "\"isOnline\":" + String(isOnline ? "true" : "false") + ",";
  jsonPayload += "\"hasInternet\":" + String(hasInternet ? "true" : "false");
  if (wifiSignal != 0)
  {
    jsonPayload += ",\"wifiSignalStrength\":" + String(wifiSignal);
  }
  jsonPayload += "}";

  // Send POST
  int httpCode = http.POST(jsonPayload);

  if (httpCode > 0)
  {
    if (httpCode == 200 || httpCode == 201)
    {
      static int count = 0;
      if (++count % 3 == 0)
      {
        Serial.println("✅ Health data sent");
      }
    }
  }

  // Always cleanup
  http.end();
  client.stop();

  lastRequest = now;
}

void HttpModule::sendPeakHealthData(float peakTempC, float peakTempF, int peakSpO2, int peakHeartRate, bool isOnline, bool hasInternet, int wifiSignal)
{
  // Peak health data sending - for ML model analysis (every 5 seconds)
  if (!dataSendingEnabled)
  {
    return;
  }

  if (WiFi.status() != WL_CONNECTED)
  {
    return;
  }

  unsigned long now = millis();
  unsigned long timeSinceLastRequest = now - lastRequest;

  // Rate limiting: Only send every 5 seconds to prevent memory leak
  if (timeSinceLastRequest < 5000)
  {
    return;
  }

  // Create HTTP client
  HTTPClient http;
  String endpoint = serverUrl + "/api/health/peak-measurements";

  http.setTimeout(2000);

  WiFiClient client;
  if (!http.begin(client, endpoint))
  {
    http.end();
    client.stop();
    return;
  }

  http.addHeader("Content-Type", "application/json");

  // Create JSON payload for peak values (ML model analysis)
  String jsonPayload = "{";
  jsonPayload += "\"deviceId\":\"ESP32_HealthMonitor\",";
  jsonPayload += "\"timestamp\":" + String(millis()) + ",";
  jsonPayload += "\"peakValues\":{";
  jsonPayload += "\"temperatureC\":" + String(peakTempC, 2) + ",";
  jsonPayload += "\"temperatureF\":" + String(peakTempF, 2) + ",";
  jsonPayload += "\"spo2\":" + String(peakSpO2) + ",";
  jsonPayload += "\"heartRate\":" + String(peakHeartRate);
  jsonPayload += "},";
  jsonPayload += "\"isOnline\":" + String(isOnline ? "true" : "false") + ",";
  jsonPayload += "\"hasInternet\":" + String(hasInternet ? "true" : "false");
  if (wifiSignal != 0)
  {
    jsonPayload += ",\"wifiSignalStrength\":" + String(wifiSignal);
  }
  jsonPayload += "}";

  // Send POST
  int httpCode = http.POST(jsonPayload);

  if (httpCode > 0)
  {
    if (httpCode == 200 || httpCode == 201)
    {
      static int count = 0;
      if (++count % 3 == 0)
      {
        Serial.println("📊 Peak health data sent to ML model");
      }
    }
  }

  // Always cleanup - CRITICAL for memory safety
  http.end();
  client.stop();
}

void HttpModule::sendDeviceStatus(bool isOnline, bool hasInternet, String wifiNetworkName, int wifiSignal)
{
  // Skip if WiFi not connected
  if (WiFi.status() != WL_CONNECTED)
  {
    return;
  }

  unsigned long now = millis();
  unsigned long timeSinceLastStatusRequest = now - lastStatusRequest;

  // Rate limiting: Only send every 5 seconds to prevent memory leak
  if (timeSinceLastStatusRequest < 5000)
  {
    return;
  }

  // Create HTTP client
  HTTPClient http;
  String endpoint = serverUrl + "/api/health/device-status";

  // Set timeout
  http.setTimeout(2000);

  // Create WiFi client
  WiFiClient client;

  // Begin connection
  if (!http.begin(client, endpoint))
  {
    http.end();
    return;
  }

  // Add headers
  http.addHeader("Content-Type", "application/json");

  // Create JSON payload
  String jsonPayload = "{";
  jsonPayload += "\"deviceId\":\"ESP32_HealthMonitor\",";
  jsonPayload += "\"isOnline\":" + String(isOnline ? "true" : "false") + ",";
  jsonPayload += "\"hasInternet\":" + String(hasInternet ? "true" : "false") + ",";
  jsonPayload += "\"wifiNetworkName\":\"" + wifiNetworkName + "\"";
  if (wifiSignal != 0)
  {
    jsonPayload += ",\"wifiSignalStrength\":" + String(wifiSignal);
  }
  jsonPayload += "}";

  // Send POST request
  int httpCode = http.POST(jsonPayload);

  // Handle response
  if (httpCode > 0)
  {
    if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_CREATED)
    {
      Serial.println("📡 Device Status Sent ✅");
    }
    else
    {
      Serial.print("⚠ Status HTTP Code: ");
      Serial.println(httpCode);
    }
  }
  else
  {
    Serial.print("❌ Status HTTP Error: ");
    Serial.println(http.errorToString(httpCode));
  }

  // ALWAYS cleanup
  http.end();
  client.stop();

  lastStatusRequest = now;
}

void HttpModule::sendPeakDataToML(float peakTempC, float peakTempF, int peakSpO2, int peakHeartRate)
{
  // Send peak values to ML model for analysis (manual report generation)
  if (!dataSendingEnabled)
  {
    Serial.println("❌ Data sending not enabled");
    return;
  }

  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("❌ WiFi not connected");
    return;
  }

  // Create HTTP client
  HTTPClient http;
  String endpoint = serverUrl + "/api/health-data/";

  http.setTimeout(5000);

  WiFiClient client;
  if (!http.begin(client, endpoint))
  {
    Serial.println("❌ Failed to initialize HTTP client");
    http.end();
    client.stop();
    return;
  }

  http.addHeader("Content-Type", "application/json");

  // Create JSON payload for peak values (ML model analysis)
  String jsonPayload = "{";
  jsonPayload += "\"deviceId\":\"ESP32_HealthMonitor\",";
  jsonPayload += "\"temperatureC\":" + String(peakTempC, 2) + ",";
  jsonPayload += "\"temperatureF\":" + String(peakTempF, 2) + ",";
  jsonPayload += "\"spo2\":" + String(peakSpO2) + ",";
  jsonPayload += "\"heartRate\":" + String(peakHeartRate) + ",";
  jsonPayload += "\"dataType\":\"PEAK_VALUES_REPORT\"";
  jsonPayload += "}";

  Serial.println("📊 Sending peak data to ML model:");
  Serial.println("🔗 URL: " + endpoint);
  Serial.println("📋 Data: " + jsonPayload);

  // Send POST
  int httpCode = http.POST(jsonPayload);

  if (httpCode > 0)
  {
    Serial.printf("✅ HTTP Response Code: %d\n", httpCode);
    if (httpCode == 200 || httpCode == 201)
    {
      String response = http.getString();
      Serial.println("🤖 ML Analysis Result:");
      
      // Extract and print prediction if available
      int predStart = response.indexOf("\"prediction\":\"");
      if (predStart != -1) {
        predStart += 14; // Length of "\"prediction\":\""
        int predEnd = response.indexOf("\"", predStart);
        if (predEnd != -1) {
          String prediction = response.substring(predStart, predEnd);
          Serial.println("📋 Medical Prediction: " + prediction);
        }
      }
      
      // Print full response
      Serial.println("📄 Full Response: " + response);
      Serial.println("🏥 Peak data successfully analyzed by ML model!");
    }
  }
  else
  {
    Serial.printf("❌ HTTP Error: %d\n", httpCode);
    String error = http.errorToString(httpCode);
    Serial.println("❌ Error: " + error);
  }

  // Always cleanup
  http.end();
  client.stop();
}

bool HttpModule::checkForgetWiFiCommand()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    return false;
  }

  // Check for commands from backend (simplified)
  return false; // Currently disabled
}
