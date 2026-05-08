import { baseApi } from "../../api/baseApi";

const industryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIndustry: builder.query({
      query: () => ({
        url: `/industry`,
        method: "GET",
      }),
      providesTags: ["industry"],
    }),
    updateIndustry: builder.mutation({
      query: (data) => ({
        url: `/industry/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["industry"],
    }),
  }),
});

export const { useGetIndustryQuery, useUpdateIndustryMutation } = industryApi;
