import { baseApi } from "../../api/baseApi";

const studentReviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new student review
    createStudentReview: builder.mutation({
      query: (payload) => ({
        url: "/student-reviews/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["StudentReview"],
    }),

    // Get a student review by ID
    getStudentReviewById: builder.query({
      query: (id) => ({
        url: `/student-reviews/${id}`,
        method: "GET",
      }),
      providesTags: ["StudentReview"],
    }),

    // Update a student review
    updateStudentReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/student-reviews/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["StudentReview"],
    }),

    // Delete a student review
    deleteStudentReview: builder.mutation({
      query: (id) => ({
        url: `/student-reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StudentReview"],
    }),

    // Get all student reviews (with optional query params)
    allStudentReviews: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: any) => {
            params.append(item?.name, item?.value);
          });
        }
        return {
          url: `/student-reviews`,
          method: "GET",
          params,
        };
      },
      providesTags: ["StudentReview"],
    }),
  }),
});

export const {
  useCreateStudentReviewMutation,
  useGetStudentReviewByIdQuery,
  useUpdateStudentReviewMutation,
  useDeleteStudentReviewMutation,
  useAllStudentReviewsQuery,
} = studentReviewsApi;
