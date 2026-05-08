#include "HeartRateModule.h"

HeartRateModule::HeartRateModule()
    : rateSpot(0), lastBeat(0), beatsPerMinute(0),
      beatAvg(0), valid(false), irValue(0), redValue(0),
      peakBPM(-999)
{
  for (byte i = 0; i < RATE_SIZE; i++)
  {
    rates[i] = 0;
  }
}

bool HeartRateModule::begin()
{
  // Use EXACT same initialization as your working fusion code
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST))
  {
    Serial.println("MAX30102 was not found. Please check wiring/power.");
    return false;
  }

  Serial.println("Place your index finger on the sensor with steady pressure.");

  // Keep library defaults that work for you (EXACT same as fusion code)
  particleSensor.setup();                    // default config (SparkFun)
  particleSensor.setPulseAmplitudeRed(0x0A); // indicator LED like your code
  particleSensor.setPulseAmplitudeGreen(0);  // off
  // IR amplitude left at library default (same as your working example)

  return true;
}

void HeartRateModule::update()
{
  // EXACT same BPM detection logic as your working fusion code
  irValue = particleSensor.getIR();

  if (checkForBeat(irValue) == true)
  {
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      rates[rateSpot++] = (byte)beatsPerMinute;
      rateSpot %= RATE_SIZE;

      int sum = 0;
      for (byte x = 0; x < RATE_SIZE; x++)
        sum += rates[x];
      beatAvg = sum / RATE_SIZE;
      valid = true;

      // Track peak BPM - ONLY if in valid human range (30-200)
      if (beatAvg > peakBPM && beatAvg >= 30 && beatAvg <= 200)
      {
        peakBPM = beatAvg;
      }
      // First valid reading becomes the peak
      else if (peakBPM < -990 && beatAvg >= 30 && beatAvg <= 200)
      {
        peakBPM = beatAvg;
      }
    }
    else
    {
      valid = false;
    }
  }

  // Get Red value to match the same sample instant as IR (for SpO2)
  redValue = particleSensor.getRed();
}

bool HeartRateModule::isValid() const
{
  return valid;
}

int HeartRateModule::getBPM() const
{
  return beatAvg;
}

long HeartRateModule::getIRValue() const
{
  return irValue;
}

uint32_t HeartRateModule::getRedValue() const
{
  return redValue;
}

int HeartRateModule::getPeakBPM() const
{
  return peakBPM;
}

void HeartRateModule::resetPeakBPM()
{
  peakBPM = -999;
}
