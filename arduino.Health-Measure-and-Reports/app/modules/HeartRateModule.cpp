#include "modules/HeartRateModule.h"

HeartRateModule::HeartRateModule()
    : rateSpot(0), lastBeat(0), beatsPerMinute(0),
      beatAvg(0), valid(false), irValue(0), redValue(0),
      peakBPM(0) // Initialize peak BPM tracking
{
  for (byte i = 0; i < RATE_SIZE; i++)
  {
    rates[i] = 0;
  }
}

bool HeartRateModule::begin()
{
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST))
  {
    return false;
  }

  particleSensor.setup();

  // Set LED power to FULL (0xFF = 255 = maximum) for proper sensor readings
  particleSensor.setPulseAmplitudeRed(0xFF); // Red LED at full power (100%)
  particleSensor.setPulseAmplitudeIR(0xFF);  // IR LED at full power (100%)
  particleSensor.setPulseAmplitudeGreen(0);  // Green LED off (not used)

  // Set sample rate to 100 Hz for better SpO2 algorithm
  particleSensor.setSampleRate(100);

  // Set LED pulse width to 411 microseconds (maximum) for best signal
  particleSensor.setPulseWidth(411);

  return true;
}

void HeartRateModule::update()
{
  irValue = particleSensor.getIR();
  redValue = particleSensor.getRed();

  // Debug output every 2 seconds
  static unsigned long lastDebug = 0;
  if (millis() - lastDebug > 2000)
  {
    lastDebug = millis();
    Serial.print("DEBUG - IR: ");
    Serial.print(irValue);
    Serial.print(" | Red: ");
    Serial.print(redValue);
    Serial.print(" | Finger: ");
    Serial.println(irValue > 10000 ? "YES" : "NO");
  }

  // Finger detection: Check if IR value shows a finger is present
  // With full LED power, IR should be 100k+ with finger, <10k without
  if (irValue < 10000)
  {
    valid = false;
    return;
  }

  if (checkForBeat(irValue))
  {
    long delta = millis() - lastBeat;
    lastBeat = millis();

    if (delta > 0)
    {
      beatsPerMinute = 60.0 / (delta / 1000.0);

      // Validate BPM range (20-255)
      if (beatsPerMinute > 20 && beatsPerMinute < 255)
      {
        rates[rateSpot++] = (byte)beatsPerMinute;
        rateSpot %= RATE_SIZE;

        int sum = 0;
        for (byte x = 0; x < RATE_SIZE; x++)
        {
          sum += rates[x];
        }
        beatAvg = sum / RATE_SIZE;
        valid = true;

        // PEAK TRACKING: Update peakBPM if current BPM is higher
        if (beatAvg > peakBPM)
        {
          peakBPM = beatAvg;
        }
      }
      else
      {
        valid = false;
      }
    }
  }
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
  peakBPM = 0;
}
