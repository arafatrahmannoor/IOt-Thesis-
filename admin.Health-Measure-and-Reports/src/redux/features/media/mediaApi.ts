import { baseApi } from '../../api/baseApi';

const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (payload) => ({
        url: '/media',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['media'],
    }),
    mediaList: builder.query({
      query: (args = {}) => {
        return {
          url: '/media',
          method: 'GET',
          params: args,
        };
      },
      providesTags: ['media'],
    }),
    deleteMedia: builder.mutation({
      query: (name) => {
        return {
          url: `/media/${name}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['media'],
    }),
    renameMedia: builder.mutation({
      query: ({ oldName, newName }) => ({
        url: '/media/rename',
        method: 'PATCH',
        body: { oldName, newName },
      }),
      invalidatesTags: ['media'],
    }),
  }),
});

export const {
  useMediaListQuery,
  useUploadImageMutation,
  useDeleteMediaMutation,
  useRenameMediaMutation,
} = mediaApi;
