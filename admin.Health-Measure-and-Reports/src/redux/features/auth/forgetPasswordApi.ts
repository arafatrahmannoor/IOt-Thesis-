import { baseApi } from "../../api/baseApi";

interface ForgotPasswordPayload {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  data?: {
    email: string;
  };
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface VerifyOtpResponse {
  success: boolean;
  message?: string;
  data?: {
    resetToken: string;
    expiresIn: number;
  };
}

interface ChangePasswordWithTokenPayload {
  resetToken: string;
  newPassword: string;
}

interface ChangePasswordWithTokenResponse {
  success: boolean;
  message?: string;
  data?: {
    email: string;
  };
}

interface ErrorResponse {
  success: false;
  message?: string;
  errorSources?: Array<{
    path: string;
    message: string;
  }>;
  err?: {
    statusCode: number;
  };
}

const forgetPasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordPayload>({
      query: (payload) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: payload,
      }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse | ErrorResponse, VerifyOtpPayload>({
      query: (payload) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: payload,
      }),
    }),
    changePasswordWithToken: builder.mutation<
      ChangePasswordWithTokenResponse | ErrorResponse,
      ChangePasswordWithTokenPayload
    >({
      query: (payload) => ({
        url: "/auth/change-password-with-token",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useChangePasswordWithTokenMutation,
} = forgetPasswordApi;

