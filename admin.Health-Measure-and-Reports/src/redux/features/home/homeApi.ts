import { baseApi } from "../../api/baseApi";

const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHome: builder.query({
      query: () => ({
        url: `/home`,
        method: "GET",
      }),
      providesTags: ["home"],
    }),
    updateHome: builder.mutation({
      query: (data) => ({
        url: `/home/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["home"],
    }),
  }),
});

export const { useGetHomeQuery, useUpdateHomeMutation } = homeApi;
