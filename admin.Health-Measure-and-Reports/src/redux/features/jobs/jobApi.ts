import { IJob } from "../../../types/interfaces";
import { baseApi } from "../../api/baseApi";

interface JobListResponse {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: IJob[];
}
interface GetJobResponse {
  _id?: string;
  success: boolean;
  message: string;
  data: IJob;
}

const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new job
    createJob: builder.mutation<IJob, Partial<IJob>>({
      query: (payload) => ({
        url: "/jobs/create-job",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Job"],
    }),

    jobList: builder.query<JobListResponse, any>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: { name: string; value: any }) => {
            params.append(item?.name, item?.value);

          });
        }
        return {
          url: `/jobs?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Job"],
    }),

    // Get job by ID
    getJobById: builder.query<GetJobResponse, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "GET",
      }),
      providesTags: ["Job"],
    }),

    // Update job
    updateJob: builder.mutation<IJob, { id: string; data: Partial<IJob> }>({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),

    // Delete job
    deleteJob: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job"],
    }),

    // Application
    allJobApplication: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: { name: string; value: any }) => {
            params.append(item?.name, item?.value);
          });
        }
        return {
          url: `/job-application`,
          method: "GET",
          params,
        };
      },
      providesTags: ["JobApplication"],
    }),
  }),
});

export const {
  useCreateJobMutation,
  useJobListQuery,
  useGetJobByIdQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  // Application
  useAllJobApplicationQuery,
} = jobApi;
