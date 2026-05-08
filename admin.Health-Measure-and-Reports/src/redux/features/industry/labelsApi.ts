import { baseApi } from "../../api/baseApi";

export const labelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create labels
    createIndustryLabels: builder.mutation({
      query: (data: { title: string; description: string }) => ({
        url: "/industry-labels",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["/industry-labels"],
    }),

    // Update labels
    updateIndustryLabels: builder.mutation({
      query: ({
        id,
        data,
      }: {
        id: string;
        data: { name: string; description: string };
      }) => ({
        url: `/industry-labels/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["/industry-labels"],
    }),

    // Delete labels
    deleteIndustryLabels: builder.mutation({
      query: (id: string) => ({
        url: `//industry-labels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["/industry-labels"],
    }),

    // Get all labels
    getIndustryLabels: builder.query({
      query: () => ({
        url: "/industry-labels",
        method: "GET",
      }),
      providesTags: ["/industry-labels"],
    }),

    // Get single labels by ID
    getIndustryLabelsById: builder.query({
      query: (id: string) => ({
        url: `/industry-categories/${id}`,
        method: "GET",
      }),
      providesTags: ["/industry-labels"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const {
  useCreateIndustryLabelsMutation,
  useUpdateIndustryLabelsMutation,
  useDeleteIndustryLabelsMutation,
  useGetIndustryLabelsQuery,
  useGetIndustryLabelsByIdQuery,
} = labelsApi;
