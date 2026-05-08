import { baseApi } from "../../api/baseApi";

// ======================
// Talent API
// ======================
export const talentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create talent (FormData for file uploads)
    createTalent: builder.mutation({
      query: (formData: FormData) => ({
        url: "/industry-talents",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["industry-talents"],
    }),

    // Get all talents (with optional filters)
    getIndustryTalents: builder.query({
      query: (args?: { name: string; value: any }[]) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: `/industry-talents?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["industry-talents"],
    }),

    // Get single talent by ID
    getTalentById: builder.query({
      query: (id: string) => ({
        url: `/industry-talents/${id}`,
        method: "GET",
      }),
      providesTags: ["industry-talents"],
    }),

    // Update talent
    updateTalent: builder.mutation({
      query: ({ id, data }: any) => ({
        url: `/industry-talents/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["industry-talents"],
    }),

    // Delete talent
    deleteTalent: builder.mutation({
      query: (id: string) => ({
        url: `/industry-talents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["industry-talents"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const {
  useCreateTalentMutation,
  useGetIndustryTalentsQuery,
  useGetTalentByIdQuery,
  useUpdateTalentMutation,
  useDeleteTalentMutation,
} = talentApi;
