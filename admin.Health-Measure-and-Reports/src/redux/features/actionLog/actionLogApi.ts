import { baseApi } from "../../api/baseApi";

const actionLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    actionLogs: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: { name: string; value: any }) => {
            params.append(item?.name, item?.value);
          });
        }
        return {
          url: "/action-logs",
          method: "GET",
          params,
        };
      },
    }),
  }),
});

export const { useActionLogsQuery } = actionLogApi;
