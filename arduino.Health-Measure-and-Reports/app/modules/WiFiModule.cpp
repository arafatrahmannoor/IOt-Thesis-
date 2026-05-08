#include "modules/WiFiModule.h"

WiFiModule::WiFiModule() : connected(false)
{
}

bool WiFiModule::begin()
{
  Serial.println("Starting WiFiManager...");

  // Set WiFiManager to timeout after 10 seconds if not connected
  wm.setConnectTimeout(10);      // 10 second timeout to connect
  wm.setConfigPortalTimeout(60); // 60 second timeout for config portal

  // Try to connect with autoConnect - doesn't block forever
  bool res = wm.autoConnect("ESP32_Setup", "12345678");

  if (res)
  {
    connected = true;
    Serial.println("✅ WiFi connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    return true;
  }

  // WiFi not connected yet - that's OK, will retry in loop()
  connected = false;
  Serial.println("⚠️  WiFi connection delayed - will retry in background");
  return false;
}

bool WiFiModule::isConnected()
{
  connected = (WiFi.status() == WL_CONNECTED);
  return connected;
}

void WiFiModule::reconnect()
{
  WiFi.reconnect();
  connected = (WiFi.status() == WL_CONNECTED);
}

IPAddress WiFiModule::getIP()
{
  return WiFi.localIP();
}

void WiFiModule::forgetWiFi()
{
  Serial.println("🗑️ Forgetting WiFi credentials...");
  wm.resetSettings();
  Serial.println("✅ WiFi credentials erased. Restarting device...");
  delay(1000);
  ESP.restart();
}
