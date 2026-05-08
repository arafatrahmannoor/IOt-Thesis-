#include "TemperatureModule.h"

TemperatureModule::TemperatureModule()
    : oneWire(ONE_WIRE_BUS), sensors(&oneWire),
      lastUpdate(0), temperatureC(NAN), valid(false),
      peakTemperatureC(-999.0f), peakTemperatureF(-999.0f)
{
}

void TemperatureModule::begin()
{
  // EXACT same initialization as your working fusion code
  sensors.begin();
  sensors.setWaitForConversion(false);
  sensors.setResolution(12);
  sensors.requestTemperatures();
  lastUpdate = millis();
}

void TemperatureModule::update()
{
  // EXACT same non-blocking approach as your working fusion code (800ms cadence)
  unsigned long now = millis();

  if (now - lastUpdate >= TEMP_UPDATE_INTERVAL_MS)
  {
    float c = sensors.getTempCByIndex(0);

    // EXACT same validation as fusion code: -55°C to 125°C for DS18B20
    if (c > -55.0f && c < 125.0f)
    {
      temperatureC = c;
      valid = true;

      // Track peak temperature - ONLY if reading is reasonable (not first time)
      if (c > peakTemperatureC && c > 30.0f) // Only track if > 30°C (valid human temp range)
      {
        peakTemperatureC = c;
        peakTemperatureF = c * 9.0f / 5.0f + 32.0f;
      }
      // First valid reading becomes the peak
      else if (peakTemperatureC < -990.0f && c > 30.0f)
      {
        peakTemperatureC = c;
        peakTemperatureF = c * 9.0f / 5.0f + 32.0f;
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
  return peakTemperatureF;
}

void TemperatureModule::resetPeakTemperature()
{
  peakTemperatureC = -999.0f;
  peakTemperatureF = -999.0f;
}
