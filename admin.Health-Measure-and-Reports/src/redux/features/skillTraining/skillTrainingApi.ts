import { baseApi } from "../../api/baseApi";

const skillTrainingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSkillTraining: builder.query({
      query: () => ({
        url: `/skill-training`,
        method: "GET",
      }),
      providesTags: ["skill-training"],
    }),
    updateSkillTraining: builder.mutation({
      query: (data) => ({
        url: `/skill-training/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["skill-training"],
    }),
  }),
});

export const { useGetSkillTrainingQuery, useUpdateSkillTrainingMutation } =
  skillTrainingApi;
