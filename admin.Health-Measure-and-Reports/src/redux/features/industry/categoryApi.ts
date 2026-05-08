import { baseApi } from "../../api/baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create category
    createIndustryCategory: builder.mutation({
      query: (data: { title: string; description: string }) => ({
        url: "/industry-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["industry-categories"],
    }),

    // Update category
    updateIndustryCategory: builder.mutation({
      query: ({
        id,
        data,
      }: {
        id: string;
        data: { title: string; description: string };
      }) => ({
        url: `/industry-categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["industry-categories"],
    }),

    // Delete category
    deleteIndustryCategory: builder.mutation({
      query: (id: string) => ({
        url: `/industry-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["industry-categories"],
    }),

    // Get all categories
    getIndustryCategories: builder.query({
      query: () => ({
        url: "/industry-categories",
        method: "GET",
      }),
      providesTags: ["industry-categories"],
    }),

    // Get single category by ID
    getIndustryCategoryById: builder.query({
      query: (id: string) => ({
        url: `/industry-categories/${id}`,
        method: "GET",
      }),
      providesTags: ["industry-categories"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const {
  useCreateIndustryCategoryMutation,
  useUpdateIndustryCategoryMutation,
  useDeleteIndustryCategoryMutation,
  useGetIndustryCategoriesQuery,
  useGetIndustryCategoryByIdQuery,
} = categoryApi;
