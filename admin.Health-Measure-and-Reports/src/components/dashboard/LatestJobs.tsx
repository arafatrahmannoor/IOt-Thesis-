import { MapPin } from "lucide-react";
import { IJob } from "../../types/interfaces";
import NextImage from "../shared/NextImage";
import AntTable from "../table/AntTable";

export default function LatestJobs({ data, isLoading }: any) {
  const columns = [
    {
      title: "Job Details",
      key: "job",
      width: 200,
      render: (_: any, record: IJob) => (
        <div className="flex items-start gap-2">
          <NextImage
            accessurl
            src={record.country_flag}
            alt={record.location.country}
            className="object-cover size-8 rounded-full"
          />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 text-xs truncate">
              {record.title}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">
                  {record.location.city}, {record.location.country}
                </span>
              </span>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: "Expires",
      dataIndex: "expiration_date",
      key: "expiration_date",
      width: 100,
      render: (date: string) => (
        <div className="text-xs text-gray-600">{date}</div>
      ),
    },
  ];
  return (
    <div className="bg-white rounded-xl border h-full flex flex-col">
      <div className="p-3 md:p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm md:text-base font-semibold text-gray-900">
            Latest Jobs
          </h3>
          <div className="text-xs text-primary-100 bg-primary px-2 py-1 rounded-full">
            {data?.length || 0}
          </div>
        </div>
      </div>

      <AntTable
        data={data}
        columns={columns}
        loading={isLoading}
        isPaginate={false}
        className="rounded-xl border-none"
      />
    </div>
  );
}
