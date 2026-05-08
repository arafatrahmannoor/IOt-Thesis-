#include "modules/TemperatureModule.h"

TemperatureModule::TemperatureModule()
    : oneWire(ONE_WIRE_BUS), sensors(&oneWire),
      lastUpdate(0), temperatureC(NAN), valid(false),
      peakTemperatureC(-100.0f) // Initialize peak temperature tracking
{
}

void TemperatureModule::begin()
{
  sensors.begin();
  sensors.setWaitForConversion(false);
  sensors.setResolution(12);
  sensors.requestTemperatures();
  lastUpdate = millis();
}

void TemperatureModule::update()
{
  unsigned long now = millis();

  if (now - lastUpdate >= TEMP_UPDATE_INTERVAL_MS)
  {
    float c = sensors.getTempCByIndex(0);

    // Validate temperature range (-55°C to 125°C for DS18B20)
    if (c > -55.0f && c < 125.0f)
    {
      temperatureC = c;
      valid = true;

      // PEAK TRACKING: Update peakTemperatureC if current temp is higher
      if (c > peakTemperatureC)
      {
        peakTemperatureC = c;
      }
    }
    else
    {
      valid = false;
    }

    sensors.requestTemperatures();
    lastUpdate = now;
  }
}

bool TemperatureModule::isValid() const
{
  return valid;
}

float TemperatureModule::getTemperatureC() const
{
  return temperatureC;
}

float TemperatureModule::getTemperatureF() const
{
  return temperatureC * 9.0f / 5.0f + 32.0f;
}

float TemperatureModule::getPeakTemperatureC() const
{
  return peakTemperatureC;
}

float TemperatureModule::getPeakTemperatureF() const
{
  return peakTemperatureC * 9.0f / 5.0f + 32.0f;
}

void TemperatureModule::resetPeakTemperature()
{
  peakTemperatureC = -100.0f;
}
