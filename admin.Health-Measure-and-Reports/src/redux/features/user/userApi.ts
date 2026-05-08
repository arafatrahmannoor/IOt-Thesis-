import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (userInfo) => {
        return {
          url: "user/create-user",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    myProfile: builder.query({
      query: () => {
        return {
          url: "user/me",
          method: "GET",
        };
      },
      providesTags: ["user_profile"],
    }),

    getAllUser: builder.query({
      query: () => {
        return {
          url: `user`,
          method: "GET",
        };
      },
      providesTags: ["users"],
    }),
    updateUserRole: builder.mutation({
      query: (user) => {
        return {
          url: `user/update-role/${user.userId}`,
          method: "PUT",
          body: { role: user.role },
        };
      },
      invalidatesTags: ["users"],
    }),
    toggleUserStatus: builder.mutation({
      query: (user) => {
        return {
          url: `user/update-status/${user.userId}`,
          method: "PUT",
          body: { isSuspended: user.isSuspended },
        };
      },
      invalidatesTags: ["users"],
    }),
    updateProfile: builder.mutation({
      query: (user) => {
        return {
          url: `user/update-profile`,
          method: "PATCH",
          body: user,
        };
      },
      invalidatesTags: ["user_profile"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useMyProfileQuery,
  useUpdateUserRoleMutation,
  useGetAllUserQuery,
  useToggleUserStatusMutation,
  useUpdateProfileMutation,
} = authApi;
