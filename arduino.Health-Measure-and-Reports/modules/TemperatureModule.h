#ifndef TEMPERATURE_MODULE_H
#define TEMPERATURE_MODULE_H

#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 4
#define TEMP_UPDATE_INTERVAL_MS 800

class TemperatureModule
{
private:
  OneWire oneWire;
  DallasTemperature sensors;
  unsigned long lastUpdate;
  float temperatureC;
  bool valid;

  // Peak tracking
  float peakTemperatureC;
  float peakTemperatureF;

public:
  TemperatureModule();
  void begin();
  void update();
  bool isValid() const;
  float getTemperatureC() const;
  float getTemperatureF() const;

  // Peak tracking functions
  float getPeakTemperatureC() const;
  float getPeakTemperatureF() const;
  void resetPeakTemperature();
};

#endif
