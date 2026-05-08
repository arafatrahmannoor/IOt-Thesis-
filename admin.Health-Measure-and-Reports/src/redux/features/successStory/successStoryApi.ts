import { ISuccessStory } from "../../../types/interfaces";
import { baseApi } from "../../api/baseApi";

// Response for multiple success stories
export interface SuccessStoriesResponse {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
  data: ISuccessStory[];
}

// Response for single success story
interface SingleSuccessStoryResponse {
  success: boolean;
  message: string;
  data: ISuccessStory;
}

export const successStoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all success stories
    getSuccessStories: builder.query<SuccessStoriesResponse, any>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.length > 0) {
          args.forEach((item: { name: string; value: any }) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: "/success-story",
          method: "GET",
          params: Object.fromEntries(params),
        };
      },
      providesTags: ["SuccessStory"],
    }),

    // ✅ Get single success story by ID
    getSuccessStoryById: builder.query<SingleSuccessStoryResponse, string>({
      query: (id) => ({
        url: `/success-story/${id}`,
        method: "GET",
      }),
      providesTags: ["SuccessStory"],
    }),

    // ✅ Create new success story
    createSuccessStory: builder.mutation<ISuccessStory, Partial<ISuccessStory>>(
      {
        query: (payload) => ({
          url: "/success-story/create-success-story",
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["SuccessStory"],
      }
    ),

    // ✅ Update success story
    updateSuccessStory: builder.mutation<
      ISuccessStory,
      { id: string; data: Partial<ISuccessStory> }
    >({
      query: ({ id, data }) => ({
        url: `/success-story/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SuccessStory"],
    }),

    // ✅ Delete success story
    deleteSuccessStory: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query: (id) => ({
        url: `/success-story/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SuccessStory"],
    }),
  }),
});

export const {
  useGetSuccessStoriesQuery,
  useGetSuccessStoryByIdQuery,
  useCreateSuccessStoryMutation,
  useUpdateSuccessStoryMutation,
  useDeleteSuccessStoryMutation,
} = successStoryApi;
