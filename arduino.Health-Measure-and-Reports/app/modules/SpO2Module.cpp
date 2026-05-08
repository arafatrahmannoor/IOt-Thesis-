#include "SpO2Module.h"

SpO2Module::SpO2Module()
    : bufHead(0), bufCount(0), spo2(-999), valid(false),
      peakSpO2(0) // Initialize peak SpO2 tracking
{
}

void SpO2Module::begin()
{
  // Initialize buffers
  for (int i = 0; i < ALG_WINDOW; i++)
  {
    irBuf[i] = 0;
    redBuf[i] = 0;
  }
}

void SpO2Module::update(long irValue, uint32_t redValue)
{
  // Add new values to circular buffer
  irBuf[bufHead] = (uint32_t)irValue;
  redBuf[bufHead] = redValue;
  bufHead = (bufHead + 1) % ALG_WINDOW;

  if (bufCount < ALG_WINDOW)
  {
    bufCount++;
  }

  // Compute SpO2 when buffer is full
  if (bufCount >= ALG_WINDOW)
  {
    computeSpO2();
  }
}

// Maxim Integrated SpO2 Algorithm (proven, from your working code)
void SpO2Module::computeSpO2()
{
  // Copy buffer in correct order for algorithm
  static uint32_t irWin[ALG_WINDOW];
  static uint32_t redWin[ALG_WINDOW];

  int start = bufHead; // next write slot = oldest
  for (int i = 0; i < ALG_WINDOW; i++)
  {
    int j = (start + i) % ALG_WINDOW;
    irWin[i] = irBuf[j];
    redWin[i] = redBuf[j];
  }

  // Call proven Maxim algorithm
  int32_t tmpSpO2 = 0;
  int8_t vSpO2 = 0;
  int32_t tmpHR = 0;
  int8_t vHR = 0;

  maxim_heart_rate_and_oxygen_saturation(
      irWin, ALG_WINDOW, redWin,
      &tmpSpO2, &vSpO2,
      &tmpHR, &vHR);

  // Only accept valid SpO2 in healthy range
  if (vSpO2 && tmpSpO2 >= 60 && tmpSpO2 <= 100)
  {
    spo2 = tmpSpO2;
    valid = true;

    // PEAK TRACKING: Update peakSpO2 if current SpO2 is higher
    if (tmpSpO2 > peakSpO2)
    {
      peakSpO2 = tmpSpO2;
    }
  }
  else
  {
    valid = false;
  }
}

bool SpO2Module::isValid() const
{
  return valid;
}

int32_t SpO2Module::getSpO2() const
{
  return spo2;
}

int32_t SpO2Module::getPeakSpO2() const
{
  return peakSpO2;
}

void SpO2Module::resetPeakSpO2()
{
  peakSpO2 = 0;
}