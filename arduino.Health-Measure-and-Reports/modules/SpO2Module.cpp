#include "SpO2Module.h"

SpO2Module::SpO2Module()
    : bufHead(0), bufCount(0), spo2(-999), valid(false),
      peakSpO2(-999)
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
  irBuf[bufHead] = irValue;
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

void SpO2Module::computeSpO2()
{
  static uint32_t irWin[ALG_WINDOW];
  static uint32_t redWin[ALG_WINDOW];

  // Copy circular buffer to linear arrays
  int start = bufHead;
  for (int i = 0; i < ALG_WINDOW; i++)
  {
    int j = (start + i) % ALG_WINDOW;
    irWin[i] = irBuf[j];
    redWin[i] = redBuf[j];
  }

  int32_t tmpSpO2, tmpHR;
  int8_t vSpO2, vHR;

  maxim_heart_rate_and_oxygen_saturation(
      irWin, ALG_WINDOW, redWin,
      &tmpSpO2, &vSpO2,
      &tmpHR, &vHR);

  // Validate SpO2 (70-100%)
  if (vSpO2 && tmpSpO2 >= 70 && tmpSpO2 <= 100)
  {
    spo2 = tmpSpO2;
    valid = true;

    // Track peak SpO2 - ONLY if in valid range (50-100%)
    if (tmpSpO2 > peakSpO2 && tmpSpO2 >= 50 && tmpSpO2 <= 100)
    {
      peakSpO2 = tmpSpO2;
    }
    // First valid reading becomes the peak
    else if (peakSpO2 < -990 && tmpSpO2 >= 50 && tmpSpO2 <= 100)
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
  peakSpO2 = -999;
}
