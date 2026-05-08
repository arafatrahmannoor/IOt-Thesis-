#ifndef SPO2_MODULE_H
#define SPO2_MODULE_H

#include <stdint.h>
#include "spo2_algorithm.h"

// SpO2 calculation window - ~1 second at ~100Hz sampling
#define ALG_WINDOW 100

class SpO2Module
{
private:
  uint32_t irBuf[ALG_WINDOW];
  uint32_t redBuf[ALG_WINDOW];
  int bufHead;
  int bufCount;
  int32_t spo2;
  bool valid;

  void computeSpO2();

  // Peak tracking for ML model analysis
  int32_t peakSpO2;

public:
  SpO2Module();
  void begin();
  void update(long irValue, uint32_t redValue);
  bool isValid() const;
  int32_t getSpO2() const;

  // Peak value methods for ML model
  int32_t getPeakSpO2() const;
  void resetPeakSpO2();
};

#endif
