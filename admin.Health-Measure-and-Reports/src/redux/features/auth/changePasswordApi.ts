import { baseApi } from "../../api/baseApi";

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message?: string;
  data?: any;
}

const changePasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordPayload>({
      query: (payload) => ({
        url: "/auth/change-password",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = changePasswordApi;

