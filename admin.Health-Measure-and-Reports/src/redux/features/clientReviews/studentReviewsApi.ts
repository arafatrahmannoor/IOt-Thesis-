import { baseApi } from "../../api/baseApi";

const clientReviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new client review
    createClientReview: builder.mutation({
      query: (payload) => ({
        url: "/client-reviews/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ClientReview"],
    }),

    // Get a client review by ID
    getClientReviewById: builder.query({
      query: (id) => ({
        url: `/client-reviews/${id}`,
        method: "GET",
      }),
      providesTags: ["ClientReview"],
    }),

    // Update a client review
    updateClientReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/client-reviews/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ClientReview"],
    }),

    // Delete a client review
    deleteClientReview: builder.mutation({
      query: (id) => ({
        url: `/client-reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClientReview"],
    }),

    // Get all client reviews (with optional query params)
    allClientReviews: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: any) => {
            params.append(item?.name, item?.value);
          });
        }
        return {
          url: `/client-reviews`,
          method: "GET",
          params,
        };
      },
      providesTags: ["ClientReview"],
    }),
  }),
});

export const {
  useCreateClientReviewMutation,
  useGetClientReviewByIdQuery,
  useUpdateClientReviewMutation,
  useDeleteClientReviewMutation,
  useAllClientReviewsQuery,
} = clientReviewsApi;
