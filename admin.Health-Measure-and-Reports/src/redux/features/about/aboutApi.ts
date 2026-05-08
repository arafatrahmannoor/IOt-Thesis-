import { baseApi } from "../../api/baseApi";

const aboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAbout: builder.query({
      query: () => ({
        url: `/about`,
        method: "GET",
      }),
      providesTags: ["about"],
    }),
    updateAbout: builder.mutation({
      query: (data) => ({
        url: `/about/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["about"],
    }),
  }),
});

export const { useGetAboutQuery, useUpdateAboutMutation } = aboutApi;
