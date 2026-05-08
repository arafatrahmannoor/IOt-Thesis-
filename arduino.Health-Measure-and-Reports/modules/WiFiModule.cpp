#include "WiFiModule.h"

WiFiModule::WiFiModule() : connected(false) {
}

bool WiFiModule::begin() {
  Serial.println("Starting WiFiManager...");
  bool res = wm.autoConnect("ESP32_Setup", "12345678");
  
  if (res) {
    connected = true;
    Serial.println("WiFi connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    return true;
  }
  
  connected = false;
  return false;
}

bool WiFiModule::isConnected() {
  connected = (WiFi.status() == WL_CONNECTED);
  return connected;
}

void WiFiModule::reconnect() {
  WiFi.reconnect();
  connected = (WiFi.status() == WL_CONNECTED);
}

IPAddress WiFiModule::getIP() {
  return WiFi.localIP();
}

void WiFiModule::forgetWiFi() {
  Serial.println("🗑️ Forgetting WiFi credentials...");
  wm.resetSettings();
  Serial.println("✅ WiFi credentials erased. Restarting device...");
  delay(1000);
  ESP.restart();
}


