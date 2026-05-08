import { baseApi } from "../../api/baseApi";

const partnerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPartner: builder.query({
      query: () => ({
        url: `/partner`,
        method: "GET",
      }),
      providesTags: ["partner"],
    }),
    updatePartner: builder.mutation({
      query: (data) => ({
        url: `/partner/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["partner"],
    }),
  }),
});

export const { useGetPartnerQuery, useUpdatePartnerMutation } = partnerApi;
