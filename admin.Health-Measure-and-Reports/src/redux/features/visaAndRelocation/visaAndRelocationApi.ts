import { baseApi } from "../../api/baseApi";

const visaAndRelocationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVisaAndRelocation: builder.query({
      query: () => ({
        url: `/visa-relocation`,
        method: "GET",
      }),
      providesTags: ["visa-relocation"],
    }),
    updateVisaAndRelocation: builder.mutation({
      query: (data) => ({
        url: `/visa-relocation/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["visa-relocation"],
    }),
  }),
});

export const {
  useGetVisaAndRelocationQuery,
  useUpdateVisaAndRelocationMutation,
} = visaAndRelocationApi;
