import { baseApi } from "../../api/baseApi";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getAllEnrolledCourses: builder.query({
      query: (args: any) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: { name: string; value: any }) => {
            params.append(item?.name, item?.value);
          });
        }
        return {
          url: "/enrolled-courses",
          method: "GET",
          params,
        };
      },
      providesTags: ["enrolled-course"],
    }),
    getCourses: builder.query({
      query: (args: any) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: { name: string; value: any }) => {
            params.append(item?.name, item?.value);
          });
        }
        return {
          url: "/courses",
          method: "GET",
          params,
        };
      },
      providesTags: ["Course"],
    }),

    // ✅ Get a course by ID
    getCourseById: builder.query({
      query: (slug: any) => ({
        url: `/courses/${slug}`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    // ✅ Create a new course
    createCourse: builder.mutation({
      query: (payload: any) => ({
        url: "/courses/create-course",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Course"],
    }),

    // ✅ Update a course
    updateCourse: builder.mutation({
      query: ({ slug, data }: any) => ({
        url: `/courses/${slug}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    // ✅ Delete a course
    deleteCourse: builder.mutation({
      query: (slug: any) => ({
        url: `/courses/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetAllEnrolledCoursesQuery,
} = courseApi;
