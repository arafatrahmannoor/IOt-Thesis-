import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { config } from "../../components/config";
import { logout } from "../features/auth/authSlice";
import { RootState } from "../features/store";

// ======================
// IP Fetch
// ======================
const getClientIP = async (): Promise<string> => {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data: { ip: string } = await res.json();
    return data?.ip || "Unknown";
  } catch {
    return "Unknown";
  }
};

// ======================
// Construct Client Metadata
// ======================
interface ClientDetails {
  ipAddress: string;
  userAgent: string;
  browserUrl: string;
  accessedAt: string;
}

const getClientDetails = async (): Promise<ClientDetails> => {
  const ipAddress = await getClientIP();
  const userAgent = navigator.userAgent || "Unknown";
  const browserUrl = window.location.href;

  return {
    ipAddress,
    userAgent,
    browserUrl,
    accessedAt: new Date().toISOString(),
  };
};

// ======================
// Base Query
// ======================
const rawBaseQuery = fetchBaseQuery({
  baseUrl: config.api_url,
  credentials: "include",
  prepareHeaders: async (headers, { getState, endpoint }) => {
    console.log("🌐 API Call - Base URL:", config.api_url);
    console.log("🎯 API Call - Endpoint:", endpoint);

    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      console.log("🔐 API Call - Token set in headers");
    } else {
      console.log("❌ API Call - No token in state");
    }

    const clientDetails = await getClientDetails();
    headers.set("X-Client-Details", JSON.stringify(clientDetails));

    // Optional: send current action name
    headers.set("X-Action", endpoint);

    return headers;
  },
});

// ======================
// Custom Base Query with Token Refresh
// ======================
const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs, // request type
  unknown, // response type
  FetchBaseQueryError // error type
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    toast.error(
      result.error.data &&
        typeof result.error.data === "object" &&
        "message" in result.error.data
        ? (result.error.data as { message?: string }).message ||
            "Unauthorized. Please log in."
        : "Unauthorized. Please log in.",
    );
    api.dispatch(logout());
    window.location.href = "/login";
  }

  if (result?.error?.status === 404) {
    toast.error(
      result.error.data &&
        typeof result.error.data === "object" &&
        "message" in result.error.data
        ? (result.error.data as { message?: string }).message || "Not found."
        : "Not found.",
    );
  }

  return result;
};

// ======================
// Base API
// ======================
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "users",
    "media",
    "blog",
    "user_profile",
    "Job",
    "Instructor",
    "Course",
    "SuccessStory",
    "CareerJob",
    "JobApplication",
    "industry",
    "Employer",
    "Worker",
    "home",
    "OurTeam",
    "about",
    "enrolled-course",
    "employer",
    "industry-categories",
    "industry-talents",
    "partner",
    "StudentReview",
    "visa-relocation",
    "skill-training",
    "terms-and-privacy",
    "/industry-labels",
    "ClientReview",
  ],
  endpoints: () => ({}),
});
