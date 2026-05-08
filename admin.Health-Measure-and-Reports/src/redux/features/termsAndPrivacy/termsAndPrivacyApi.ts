import { baseApi } from "../../api/baseApi";

const termsAndPrivacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTermsAndPrivacy: builder.query({
      query: () => ({
        url: `/terms-and-privacy`,
        method: "GET",
      }),
      providesTags: ["terms-and-privacy"],
    }),
    updateTermsAndPrivacy: builder.mutation({
      query: (data) => ({
        url: `/terms-and-privacy/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["terms-and-privacy"],
    }),
  }),
});

export const { useGetTermsAndPrivacyQuery, useUpdateTermsAndPrivacyMutation } =
  termsAndPrivacyApi;
