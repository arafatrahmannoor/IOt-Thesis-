import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IHealthData, IDeviceStatus } from "./health.interface";
import { getIO } from "../../utils/socket";
import axios from "axios";

// Receive health measurements from Arduino and broadcast via Socket.IO
const receiveHealthData = catchAsync(async (req: Request, res: Response) => {
  const healthData: IHealthData = req.body;

  // Add timestamp if not present
  if (!healthData.timestamp) {
    healthData.timestamp = new Date();
  }

  // Validate required fields
  if (
    typeof healthData.temperatureC !== "number" ||
    typeof healthData.temperatureF !== "number" ||
    typeof healthData.spo2 !== "number" ||
    typeof healthData.heartRate !== "number"
  ) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "Invalid health data format",
    });
  }

  console.log("📊 Health data received from Arduino:", {
    deviceId: healthData.deviceId,
    tempC: healthData.temperatureC,
    spo2: healthData.spo2,
    heartRate: healthData.heartRate,
    timestamp: healthData.timestamp,
  });

  // Broadcast to all connected Socket.IO clients in real-time
  try {
    const io = getIO();

    // Emit to all clients in the health-room for real-time updates
    io.to("health-room").emit("health-data", healthData);
    io.to("health-room").emit("latest-measurement", healthData);

    console.log(
      "✅ Health data broadcasted to all connected clients via Socket.IO",
    );
  } catch (error) {
    console.error("❌ Error broadcasting health data:", error);
    // Still send success response to Arduino even if Socket.IO fails
  }

  // Send response back to Arduino
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Health data received and broadcasted successfully!",
    data: healthData,
  });
});

// Receive device status from Arduino and broadcast via Socket.IO
const receiveDeviceStatus = catchAsync(async (req: Request, res: Response) => {
  const deviceStatus: IDeviceStatus = req.body;

  // Add timestamp if not present
  if (!deviceStatus.timestamp) {
    deviceStatus.timestamp = new Date();
  }

  // Validate required fields
  if (
    typeof deviceStatus.isOnline !== "boolean" ||
    typeof deviceStatus.hasInternet !== "boolean"
  ) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "Invalid device status format",
    });
  }

  console.log("📡 Device status received from Arduino:", {
    deviceId: deviceStatus.deviceId,
    isOnline: deviceStatus.isOnline,
    hasInternet: deviceStatus.hasInternet,
    wifiNetwork: deviceStatus.wifiNetworkName || "N/A",
    wifiSignal: deviceStatus.wifiSignalStrength || 0,
  });

  // Broadcast device status to all connected Socket.IO clients in real-time
  try {
    const io = getIO();

    // Emit device status to all clients in the health-room
    io.to("health-room").emit("device-status", deviceStatus);

    console.log(
      "✅ Device status broadcasted to all connected clients via Socket.IO",
    );
  } catch (error) {
    console.error("❌ Error broadcasting device status:", error);
    // Still send success response to Arduino even if Socket.IO fails
  }

  // Send response back to Arduino
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Device status received and broadcasted successfully!",
    data: deviceStatus,
  });
});

// Check for forget WiFi command (for Arduino to poll)
const checkForgetWiFi = catchAsync(async (req: Request, res: Response) => {
  // This endpoint is polled by Arduino to check if it should forget WiFi
  // For now, return false (can be extended to use database or in-memory flag)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Forget WiFi check",
    data: {
      forgetWiFi: false,
    },
  });
});

// Generate health report using ML API
const getReports = catchAsync(async (req: Request, res: Response) => {
  const { model, data } = req.body;

  // Validate input
  if (!data || !Array.isArray(data) || data.length === 0) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "Monitoring data is required and must be a non-empty array",
    });
  }

  console.log("📊 Generating report with ML API...");
  console.log(`   Model: ${model || "N/A"}`);
  console.log(`   Data points: ${data.length}`);

  // Calculate average values from monitoring data
  let totalTempC = 0;
  let totalSpO2 = 0;
  let totalBPM = 0;
  let validCount = 0;

  data.forEach((item: any) => {
    if (
      typeof item.temperatureC === "number" &&
      typeof item.spo2 === "number" &&
      typeof item.heartRate === "number"
    ) {
      totalTempC += item.temperatureC;
      totalSpO2 += item.spo2;
      totalBPM += item.heartRate;
      validCount++;
    }
  });

  if (validCount === 0) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "No valid health data found in monitoring data",
    });
  }

  // Calculate averages
  const avgTempC = totalTempC / validCount;
  const avgSpO2 = totalSpO2 / validCount;
  const avgBPM = totalBPM / validCount;

  console.log("📈 Calculated averages:", {
    Temp_C: avgTempC.toFixed(2),
    SpO2: avgSpO2.toFixed(2),
    BPM: avgBPM.toFixed(2),
  });

  // Prepare ML API request payload
  const mlApiPayload = {
    Temp_C: Number(avgTempC.toFixed(1)),
    SpO2: Math.round(avgSpO2),
    BPM: Math.round(avgBPM),
  };

  try {
    // Call ML API
    const mlApiUrl = process.env.ML_API_URL || "http://127.0.0.1:8000/profile/";
    console.log(`🔗 Calling ML API: ${mlApiUrl}`);

    const mlResponse = await axios.post(mlApiUrl, mlApiPayload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 seconds timeout
    });

    console.log("✅ ML API Response:", mlResponse.data);

    // Return ML API response with additional metadata
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Report generated successfully",
      data: {
        prediction: mlResponse.data.prediction,
        probability: mlResponse.data.probability,
        input_data: mlResponse.data.input_data || mlApiPayload,
        model: model || "model-with-own-data-set",
        dataPoints: data.length,
        validDataPoints: validCount,
        averages: {
          Temp_C: avgTempC,
          SpO2: avgSpO2,
          BPM: avgBPM,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ ML API Error:", error.message);

    // Handle different error types
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      return sendResponse(res, {
        statusCode: StatusCodes.SERVICE_UNAVAILABLE,
        success: false,
        message: `ML API service is unavailable. Please ensure the ML server is running on http://127.0.0.1:8000. Error: ${error.message}`,
        data: {
          code: error.code,
          message: error.message,
        },
      });
    }

    if (error.response) {
      // ML API returned an error response
      return sendResponse(res, {
        statusCode: error.response.status || StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.response.data?.message || "ML API returned an error",
        data: error.response.data,
      });
    }

    // Unknown error
    return sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: `Failed to generate report. Please try again. Error: ${error.message}`,
      data: {
        message: error.message,
      },
    });
  }
});

// Get device status (for dashboard to query current status)
const getDeviceStatus = catchAsync(async (req: Request, res: Response) => {
  const { deviceId } = req.query;

  // Mock device status for now (in production, this would query a database)
  const mockDeviceStatus = {
    deviceId: deviceId || "ESP32_HealthMonitor",
    isOnline: true,
    hasInternet: true,
    wifiNetworkName: "HealthNet",
    wifiSignalStrength: -45,
    lastSeen: new Date().toISOString(),
    batteryLevel: 85,
    sensors: {
      heartRate: { status: "active", lastReading: new Date().toISOString() },
      spO2: { status: "active", lastReading: new Date().toISOString() },
      temperature: { status: "active", lastReading: new Date().toISOString() },
    },
  };

  console.log("📊 Device status requested for:", deviceId || "default device");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Device status retrieved successfully",
    data: mockDeviceStatus,
  });
});

export const HealthController = {
  receiveHealthData,
  receiveDeviceStatus,
  checkForgetWiFi,
  getReports,
  getDeviceStatus,
};
