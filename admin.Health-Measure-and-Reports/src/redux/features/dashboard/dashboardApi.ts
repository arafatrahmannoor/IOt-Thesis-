import { baseApi } from "../../api/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
    }),
    getDeviceStatus: builder.query({
      query: (deviceId?: string) => ({
        url: `/api/health/status${deviceId ? `?deviceId=${deviceId}` : ""}`,
        method: "GET",
      }),
    }),
    getReports: builder.mutation({
      query: (payload: { model: string; data?: any[] }) => ({
        url: "/api/health/get-reports",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { 
  useGetDashboardStatsQuery, 
  useGetDeviceStatusQuery,
  useGetReportsMutation 
} = dashboardApi;
