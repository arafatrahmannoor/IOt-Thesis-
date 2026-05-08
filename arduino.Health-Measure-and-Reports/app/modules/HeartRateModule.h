#ifndef HEARTRATE_MODULE_H
#define HEARTRATE_MODULE_H

#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

#define RATE_SIZE 4

class HeartRateModule
{
private:
  MAX30105 particleSensor;
  byte rates[RATE_SIZE];
  byte rateSpot;
  long lastBeat;
  float beatsPerMinute;
  int beatAvg;
  bool valid;
  long irValue;
  uint32_t redValue;

  // Peak tracking for ML model analysis
  int peakBPM;

public:
  HeartRateModule();
  bool begin();
  void update();
  bool isValid() const;
  int getBPM() const;
  long getIRValue() const;
  uint32_t getRedValue() const;

  // Peak value methods for ML model
  int getPeakBPM() const;
  void resetPeakBPM();
};

#endif
