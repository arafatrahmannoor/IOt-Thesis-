import { baseApi } from "../../api/baseApi";

const employerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployer: builder.query({
      query: () => ({
        url: `/employer`,
        method: "GET",
      }),
      providesTags: ["employer"],
    }),
    updateEmployer: builder.mutation({
      query: (data) => ({
        url: `/employer/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["employer"],
    }),
  }),
});

export const { useGetEmployerQuery, useUpdateEmployerMutation } = employerApi;
