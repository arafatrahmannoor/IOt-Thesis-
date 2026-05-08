import { baseApi } from "../../api/baseApi";

export const instructorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all instructors
    getInstructors: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.length > 0) {
          args.forEach((item: { name: string; value: any }) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: "/instructor",
          method: "GET",
          params,
        };
      },
      providesTags: ["Instructor"],
    }),

    // Get single instructor by ID
    getInstructorById: builder.query({
      query: (id: string) => ({
        url: `/instructor/${id}`,
        method: "GET",
      }),
      providesTags: ["Instructor"],
    }),

    // Create new instructor
    createInstructor: builder.mutation({
      query: (payload) => ({
        url: "/instructor/create-instructor",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Instructor"],
    }),

    // Update instructor
    updateInstructor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/instructor/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Instructor"],
    }),

    // Delete instructor
    deleteInstructor: builder.mutation({
      query: (id) => ({
        url: `/instructor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Instructor"],
    }),
  }),
});

export const {
  useGetInstructorsQuery,
  useGetInstructorByIdQuery,
  useCreateInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
} = instructorApi;
