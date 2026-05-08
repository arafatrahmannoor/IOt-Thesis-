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

const careerJobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new job
    createCareerJob: builder.mutation<IJob, Partial<IJob>>({
      query: (payload) => ({
        url: "/career-jobs/create-career-job",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CareerJob"],
    }),

    CareerJobList: builder.query<JobListResponse, any>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: { name: string; value: any }) => {
            params.append(item?.name, item?.value);
          });
        }
        return {
          url: `/career-jobs?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["CareerJob"],
    }),

    // Get CareerJob by ID
    getCareerJobById: builder.query<GetJobResponse, string>({
      query: (id) => ({
        url: `/career-jobs/${id}`,
        method: "GET",
      }),
      providesTags: ["CareerJob"],
    }),

    // Update CareerJob
    updateCareerJob: builder.mutation<
      IJob,
      { id: string; data: Partial<IJob> }
    >({
      query: ({ id, data }) => ({
        url: `/career-jobs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CareerJob"],
    }),

    // Delete CareerJob
    deleteCareerJob: builder.mutation<{ success: boolean; id: string }, string>(
      {
        query: (id) => ({
          url: `/career-jobs/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["CareerJob"],
      }
    ),
    allCareerJobApplication: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: { name: string; value: any }) => {
            params.append(item?.name, item?.value);
          });
        }
        return {
          url: `/career-job-application/`,
          method: "GET",
          params,
        };
      },
    }),
  }),
});

export const {
  useCreateCareerJobMutation,
  useCareerJobListQuery,
  useGetCareerJobByIdQuery,
  useUpdateCareerJobMutation,
  useDeleteCareerJobMutation,
  useAllCareerJobApplicationQuery,
} = careerJobApi;
