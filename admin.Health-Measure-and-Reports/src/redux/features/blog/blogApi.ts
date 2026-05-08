import { baseApi } from "../../api/baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBlog: builder.mutation({
      query: (payload) => ({
        url: "/blogs/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["blog"],
    }),
    blogList: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: { name: string; value: any }) => {
            params.append(item?.name, item?.value);
          });
        }
        return {
          url: "/blogs",
          method: "GET",
          params,
        };
      },
      providesTags: ["blog"],
    }),
    getBlogBySlug: builder.query({
      query: (slug: string) => ({
        url: `/blogs/${slug}`,
        method: "GET",
      }),
    }),
    updateBlog: builder.mutation({
      query: ({ slug, data }) => ({
        url: `/blogs/${slug}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),
    deleteBlog: builder.mutation({
      query: (slug: string) => ({
        url: `/blogs/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useBlogListQuery,
  useGetBlogBySlugQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
