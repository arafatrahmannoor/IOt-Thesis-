#ifndef WIFI_MODULE_H
#define WIFI_MODULE_H

#include <WiFi.h>
#include <WiFiManager.h>

class WiFiModule {
private:
  WiFiManager wm;
  bool connected;
  
public:
  WiFiModule();
  bool begin();
  bool isConnected();
  void reconnect();
  IPAddress getIP();
  void forgetWiFi();
};

#endif


