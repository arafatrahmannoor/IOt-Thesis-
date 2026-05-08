import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  // Mock dashboard statistics for now
  const mockStats = {
    totalPatients: 156,
    todayMeasurements: 23,
    activeSensors: 3,
    alerts: 2,
    recentMeasurements: [
      {
        id: "1",
        patientName: "John Doe",
        heartRate: 78,
        spO2: 97,
        temperature: 98.6,
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        patientName: "Jane Smith",
        heartRate: 82,
        spO2: 95,
        temperature: 99.1,
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      },
    ],
    healthAlerts: [
      {
        id: "1",
        type: "Low SpO2",
        patient: "Jane Smith",
        value: 95,
        timestamp: new Date().toISOString(),
        severity: "warning",
      },
      {
        id: "2",
        type: "High Temperature",
        patient: "Jane Smith",
        value: 99.1,
        timestamp: new Date().toISOString(),
        severity: "info",
      },
    ],
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard statistics retrieved successfully",
    data: mockStats,
  });
});

export const DashboardController = {
  getDashboardStats,
};
