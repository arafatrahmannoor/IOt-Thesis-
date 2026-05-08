import { baseApi } from "../../api/baseApi";

const ourTeamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all team members
    getOurTeam: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: any) => {
            params.append(item?.name, item?.value);
          });
        }
        return {
          url: "/our-team",
          method: "GET",
          params,
        };
      },
      providesTags: ["OurTeam"],
    }),

    // Get single team member by ID
    getOurTeamById: builder.query({
      query: (id) => ({
        url: `/our-team/${id}`,
        method: "GET",
      }),
      providesTags: ["OurTeam"],
    }),

    // Get team members by category
    getOurTeamByCategory: builder.query({
      query: (category) => ({
        url: `/our-team/category/${category}`,
        method: "GET",
      }),
      providesTags: ["OurTeam"],
    }),

    // Create new team member
    createOurTeam: builder.mutation({
      query: (payload) => ({
        url: "/our-team",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OurTeam"],
    }),

    // Update team member
    updateOurTeam: builder.mutation({
      query: ({ id, data }) => ({
        url: `/our-team/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["OurTeam"],
    }),

    // Delete team member (soft delete)
    deleteOurTeam: builder.mutation({
      query: (id) => ({
        url: `/our-team/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OurTeam"],
    }),
  }),
});

// ======================
// Export Hooks
// ======================
export const {
  useGetOurTeamQuery,
  useGetOurTeamByIdQuery,
  useGetOurTeamByCategoryQuery,
  useCreateOurTeamMutation,
  useUpdateOurTeamMutation,
  useDeleteOurTeamMutation,
} = ourTeamApi;
