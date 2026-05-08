#include <WiFi.h>
#include <ArduinoJson.h>

#include "modules/WiFiModule.h"
#include "modules/TemperatureModule.h"
#include "modules/HeartRateModule.h"
#include "modules/SpO2Module.h"
#include "modules/HttpModule.h"

// Include implementations - ONLY the modules we created
#include "modules/WiFiModule.cpp"
#include "modules/TemperatureModule.cpp"
#include "modules/HeartRateModule.cpp"
#include "modules/SpO2Module.cpp"
#include "modules/HttpModule.cpp"

// Timer configuration options (in milliseconds)
#define TIMER_2_MIN   120000    // 2 minutes = 120,000 ms
#define TIMER_5_MIN   300000    // 5 minutes = 300,000 ms  
#define TIMER_10_MIN  600000    // 10 minutes = 600,000 ms

// Report generation button
#define REPORT_BUTTON_PIN 0  // Built-in boot button

// Peak values storage structure
struct PeakValues {
    float maxTemperatureC = -999.0;
    float maxTemperatureF = -999.0;
    float maxSpO2 = 0.0;
    float maxHeartRate = 0.0;
    unsigned long timerStartTime = 0;
    bool hasValidData = false;
};

// Module instances
WiFiModule wifiModule;
TemperatureModule tempModule;
HeartRateModule heartRateModule;
SpO2Module spo2Module;
HttpModule httpModule;

// Global variables
PeakValues peakData;
unsigned long CURRENT_TIMER = TIMER_5_MIN;  // Default: 5 minutes
static bool setupComplete = false;
static bool initialStatusSent = false;
static bool buttonPressed = false;
static unsigned long buttonPressTime = 0;

static void printStatus();

void setup()
{
  Serial.begin(115200);
  delay(1000);

  Serial.println("=== ESP32 Health Monitor - TIMER-BASED PEAK VALUES ===");
  Serial.println("🔌 Arduino Status: ON");
  Serial.println("⏱️  TIMER MODE - Peak values sent on report generation");

  // Initialize report button
  pinMode(REPORT_BUTTON_PIN, INPUT_PULLUP);
  Serial.println("🔘 Report button initialized (Boot button)");

  // Initialize HTTP module with server URL
  httpModule.begin("http://192.168.0.238:5001");
  Serial.println("✅ HTTP Module initialized");

  // Initialize WiFi
  Serial.println("📡 Starting WiFi connection...");
  bool wifiInitialized = wifiModule.begin();
  if (wifiInitialized)
  {
    Serial.println("✅ WiFi connected!");
  }
  else
  {
    Serial.println("⚠️  WiFi not connected yet - will retry in loop");
  }

  // Initialize temperature sensor
  Serial.println("📡 Initializing Temperature sensor...");
  tempModule.begin();
  Serial.println("✅ Temperature sensor initialized");

  // Initialize heart rate sensor
  Serial.println("📡 Initializing Heart Rate sensor (MAX30105)...");
  if (!heartRateModule.begin())
  {
    Serial.println("❌ MAX30105 not found. Check wiring on pins 21/22");
    Serial.println("⚠️  CONTINUING WITHOUT HEART RATE SENSOR");
    Serial.println("🔧 You can fix wiring later and reset ESP32");
  }
  else
  {
    Serial.println("✅ Heart Rate sensor initialized");
  }

  // Initialize SpO2 module
  Serial.println("📡 Initializing SpO2 module...");
  spo2Module.begin();
  Serial.println("✅ SpO2 module initialized");

  // Initialize peak tracking
  resetPeakValues();
  Serial.println("✅ Peak value tracking initialized");
  
  // Print timer settings
  printTimerInfo();
  httpModule.enableDataSending(true);

  Serial.println("=== All modules initialized ===");
  Serial.println("⏱️  TIMER-BASED PEAK VALUE MODE ACTIVE");
  Serial.println("� Press boot button to generate report");
  Serial.println("📊 Commands: TIMER_2, TIMER_5, TIMER_10, REPORT, STATUS");
  Serial.println("📡 Place finger firmly on sensor for monitoring!");

  setupComplete = true; // Mark setup as done
}

void loop()
{
  // Skip everything until setup is complete
  if (!setupComplete)
  {
    delay(10);
    return;
  }

  // Check for serial commands
  checkSerialCommands();

  // Check report button
  checkReportButton();

  // Check WiFi connection
  bool wifiConnected = wifiModule.isConnected();
  bool hasInternet = (WiFi.status() == WL_CONNECTED);
  String wifiName = wifiConnected ? WiFi.SSID() : "";
  int wifiSignal = wifiConnected ? WiFi.RSSI() : 0;

  // Send initial status once when WiFi first connects
  if (!initialStatusSent && wifiConnected)
  {
    initialStatusSent = true;
    httpModule.sendDeviceStatus(true, true, wifiName, wifiSignal);
    Serial.println("✅ Initial device status sent");
  }

  // If WiFi not connected, try to reconnect
  if (!wifiConnected)
  {
    static unsigned long lastWiFiAttempt = 0;
    if (millis() - lastWiFiAttempt > 5000) // Try every 5 seconds
    {
      lastWiFiAttempt = millis();
      Serial.println("⚠️  WiFi disconnected. Attempting to reconnect...");
      wifiModule.reconnect();
    }
  }

  // Update sensors ALWAYS (they work independently of WiFi)
  heartRateModule.update();
  spo2Module.update(heartRateModule.getIRValue(), heartRateModule.getRedValue());
  tempModule.update();

  // Get current sensor readings
  float currentTempC = tempModule.isValid() ? tempModule.getTemperatureC() : 0.0f;
  float currentTempF = tempModule.isValid() ? tempModule.getTemperatureF() : 0.0f;
  int currentSpO2 = spo2Module.isValid() ? spo2Module.getSpO2() : 0;
  int currentHeartRate = heartRateModule.isValid() ? heartRateModule.getBPM() : 0;

  // Update peak values continuously
  updatePeakValues(currentTempC, currentSpO2, currentHeartRate);

  // Print monitoring status
  printMonitoringStatus(currentTempC, currentSpO2, currentHeartRate);

  unsigned long now = millis();

  // Send device status periodically (every 30 seconds)
  static unsigned long lastStatusSend = 0;
  if (now - lastStatusSend >= 30000)
  {
    lastStatusSend = now;
    httpModule.sendDeviceStatus(true, hasInternet, wifiName, wifiSignal);
  }

  // Send current values to dashboard for real-time display (every 5 seconds)
  static unsigned long lastDashboardSend = 0;
  if (now - lastDashboardSend >= 5000)
  {
    lastDashboardSend = now;
    httpModule.sendHealthData(currentTempC, currentTempF, currentSpO2, currentHeartRate, true, hasInternet, wifiSignal);
  }

  // Check if timer expired (optional auto-reset)
  if (millis() - peakData.timerStartTime >= CURRENT_TIMER) {
    Serial.println("⏰ Timer expired - Resetting peak values for new cycle");
    resetPeakValues();
  }
    lastMLTransmission = now;

    // Get HIGHEST values from modules (not current values)
    float peakTempC = tempModule.getPeakTemperatureC();
    float peakTempF = tempModule.getPeakTemperatureF();
    int32_t peakSpO2 = spo2Module.getPeakSpO2();
    int peakBPM = heartRateModule.getPeakBPM();

    // Use valid peak values, fallback to current if peaks not yet captured
    float mlTempC = (peakTempC > -90.0f) ? peakTempC : (tempModule.isValid() ? tempModule.getTemperatureC() : 0.0f);
    float mlTempF = (peakTempC > -90.0f) ? peakTempF : (tempModule.isValid() ? tempModule.getTemperatureF() : 0.0f);
    int mlSpO2 = (peakSpO2 > -990) ? peakSpO2 : (spo2Module.isValid() ? spo2Module.getSpO2() : 0);
    int mlBPM = (peakBPM > 0) ? peakBPM : (heartRateModule.isValid() ? heartRateModule.getBPM() : 0);

    Serial.println("\n� ========== PEAK VALUES MODE ==========");
    Serial.println("� SENDING HIGHEST VALUES TO ML MODEL");
    Serial.print("� PEAK Temperature: ");
    Serial.print(mlTempC, 2);
    Serial.print("°C (Peak: ");
    Serial.print(peakTempC, 2);
    Serial.println("°C)");
    Serial.print("� PEAK SpO2: ");
    Serial.print(mlSpO2);
    Serial.print("% (Peak: ");
    Serial.print(peakSpO2);
    Serial.println("%)");
    Serial.print("� PEAK Heart Rate: ");
    Serial.print(mlBPM);
    Serial.print(" BPM (Peak: ");
    Serial.print(peakBPM);
    Serial.println(" BPM)");
    Serial.println("� HIGHEST VALUES FOR ACCURATE ML ANALYSIS");
    Serial.println("� ========================================\n");

    // Send PEAK VALUES to ML model for accurate health analysis
    httpModule.sendPeakHealthData(mlTempC, mlTempF, mlSpO2, mlBPM, true, hasInternet, wifiSignal);
  }

  // Reset peak values every 60 seconds for fresh tracking
  static unsigned long lastPeakReset = 0;
  if ((now - lastPeakReset) >= 60000) // Every 60 seconds
  {
    lastPeakReset = now;
    
    Serial.println("\n🔄 ========== PEAK RESET ==========");
    Serial.println("🔄 Resetting peak values for fresh tracking");
    Serial.println("🔄 Starting new peak collection cycle");
    Serial.println("🔄 ================================\n");
    
    tempModule.resetPeakTemperature();
    heartRateModule.resetPeakBPM();
    spo2Module.resetPeakSpO2();
  }

  // Check for forget WiFi command
  static unsigned long lastForgetCheck = 0;
  if (now - lastForgetCheck >= 10000)
  {
    lastForgetCheck = now;
    if (httpModule.checkForgetWiFiCommand())
    {
      Serial.println("📥 Forget WiFi command received from dashboard");
      wifiModule.forgetWiFi();
    }
  }

  delay(10); // Small delay to prevent overwhelming the system
}

  delay(1000);  // Read sensors every second
}

// Timer and peak value management functions
void resetPeakValues() {
  peakData.maxTemperatureC = -999.0;
  peakData.maxTemperatureF = -999.0;
  peakData.maxSpO2 = 0.0;
  peakData.maxHeartRate = 0.0;
  peakData.timerStartTime = millis();
  peakData.hasValidData = false;
  
  Serial.println("🔄 ========== PEAK RESET ==========");
  Serial.println("🔄 Peak values reset for new tracking cycle");
  Serial.printf("⏱️ Timer: %d minutes\n", CURRENT_TIMER / 60000);
  Serial.println("🔄 ===============================");
}

void updatePeakValues(float temp, float spo2, float bpm) {
  bool updated = false;
  
  if (temp > peakData.maxTemperatureC && temp > 0) {
    peakData.maxTemperatureC = temp;
    peakData.maxTemperatureF = (temp * 9.0/5.0) + 32.0;
    updated = true;
  }
  
  if (spo2 > peakData.maxSpO2 && spo2 > 0) {
    peakData.maxSpO2 = spo2;
    updated = true;
  }
  
  if (bpm > peakData.maxHeartRate && bpm > 0) {
    peakData.maxHeartRate = bpm;
    updated = true;
  }
  
  if (updated) {
    peakData.hasValidData = true;
  }
}

void generateReport() {
  if (!peakData.hasValidData) {
    Serial.println("❌ No peak data available for report");
    Serial.println("💡 Wait for sensor readings and try again");
    return;
  }
  
  // Calculate elapsed time
  unsigned long elapsedTime = millis() - peakData.timerStartTime;
  int elapsedMinutes = elapsedTime / 60000;
  int elapsedSeconds = (elapsedTime % 60000) / 1000;
  
  Serial.println("📊 ========== GENERATING PEAK REPORT ==========");
  Serial.printf("⏱️ Data Collection Period: %d min %d sec\n", elapsedMinutes, elapsedSeconds);
  Serial.printf("🌡️ PEAK Temperature: %.2f°C (%.2f°F)\n", 
               peakData.maxTemperatureC, peakData.maxTemperatureF);
  Serial.printf("🫁 PEAK SpO2: %.1f%%\n", peakData.maxSpO2);
  Serial.printf("❤️ PEAK Heart Rate: %.0f BPM\n", peakData.maxHeartRate);
  
  // Send to ML model
  sendPeakDataToML();
  
  Serial.println("✅ Peak report sent to ML model successfully!");
  Serial.println("===============================================");
}

void sendPeakDataToML() {
  // Use the existing HTTP module to send peak data
  httpModule.sendPeakDataToML(
    peakData.maxTemperatureC,
    peakData.maxTemperatureF,
    (int)peakData.maxSpO2,
    (int)peakData.maxHeartRate
  );
}

void checkReportButton() {
  static bool lastButtonState = HIGH;
  bool currentButtonState = digitalRead(REPORT_BUTTON_PIN);
  
  // Detect button press (LOW when pressed)
  if (lastButtonState == HIGH && currentButtonState == LOW) {
    buttonPressed = true;
    buttonPressTime = millis();
    Serial.println("🔘 Report button pressed - Generating report...");
    generateReport();
  }
  
  lastButtonState = currentButtonState;
}

void checkSerialCommands() {
  if (Serial.available()) {
    String command = Serial.readString();
    command.trim();
    command.toUpperCase();
    
    if (command == "TIMER_2") {
      CURRENT_TIMER = TIMER_2_MIN;
      Serial.println("⏱️ Timer set to 2 minutes");
      resetPeakValues();
    } else if (command == "TIMER_5") {
      CURRENT_TIMER = TIMER_5_MIN;
      Serial.println("⏱️ Timer set to 5 minutes");
      resetPeakValues();
    } else if (command == "TIMER_10") {
      CURRENT_TIMER = TIMER_10_MIN;
      Serial.println("⏱️ Timer set to 10 minutes");
      resetPeakValues();
    } else if (command == "REPORT") {
      generateReport();
    } else if (command == "STATUS") {
      showCurrentStatus();
    } else if (command == "HELP") {
      printTimerInfo();
    }
  }
}

void showCurrentStatus() {
  unsigned long elapsed = millis() - peakData.timerStartTime;
  int elapsedMin = elapsed / 60000;
  int elapsedSec = (elapsed % 60000) / 1000;
  int timerMin = CURRENT_TIMER / 60000;
  
  Serial.println("📊 ========== CURRENT STATUS ==========");
  Serial.printf("⏱️ Timer Setting: %d minutes\n", timerMin);
  Serial.printf("⏳ Elapsed Time: %d min %d sec\n", elapsedMin, elapsedSec);
  Serial.printf("🌡️ Current Peak Temp: %.2f°C\n", peakData.maxTemperatureC);
  Serial.printf("🫁 Current Peak SpO2: %.1f%%\n", peakData.maxSpO2);
  Serial.printf("❤️ Current Peak BPM: %.0f\n", peakData.maxHeartRate);
  Serial.printf("📈 Valid Data Available: %s\n", peakData.hasValidData ? "YES" : "NO");
  Serial.println("=====================================");
}

void printTimerInfo() {
  Serial.println("⏱️ ========== TIMER SETTINGS ==========");
  Serial.printf("📋 Current Timer: %d minutes\n", CURRENT_TIMER / 60000);
  Serial.println("🔘 Press boot button to generate report");
  Serial.println("📝 Serial Commands:");
  Serial.println("   • TIMER_2  - Set 2-minute timer");
  Serial.println("   • TIMER_5  - Set 5-minute timer");
  Serial.println("   • TIMER_10 - Set 10-minute timer");
  Serial.println("   • REPORT   - Generate peak report now");
  Serial.println("   • STATUS   - Show current status");
  Serial.println("   • HELP     - Show this info");
  Serial.println("=====================================");
}

void printMonitoringStatus(float temp, float spo2, float bpm) {
  static unsigned long lastPrint = 0;
  if (millis() - lastPrint >= 5000) {  // Print every 5 seconds
    lastPrint = millis();
    
    unsigned long elapsed = millis() - peakData.timerStartTime;
    int elapsedMin = elapsed / 60000;
    int elapsedSec = (elapsed % 60000) / 1000;
    
    Serial.printf("🔄 [%02d:%02d] Current: %.1f°C, %.0f%%, %.0f BPM | Peak: %.1f°C, %.0f%%, %.0f BPM\n",
                  elapsedMin, elapsedSec,
                  temp, spo2, bpm,
                  peakData.maxTemperatureC, peakData.maxSpO2, peakData.maxHeartRate);
  }
}

static void printStatus()
{
  // This function is now replaced by printMonitoringStatus
  // Keeping for compatibility but not used in timer mode
}
