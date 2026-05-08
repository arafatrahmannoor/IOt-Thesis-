import AntImage from "../shared/AntImage";
import AntTable from "../table/AntTable";

export default function LatestCources({ data, isLoading }: any) {
  const columns = [
    {
      title: "Course Details",
      dataIndex: "banner",
      key: "course",
      width: 200,
      render: (banner: any, record: any) => (
        <div className="flex items-center gap-2">
          <AntImage
            accessurl
            width={32}
            height={32}
            src={record.image}
            alt={record.title}
            className="object-cover size-8 rounded-full"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-xs truncate">{banner.title}</h4>
            <p className="text-gray-500 text-xs truncate">
              {record.instructor.map((i: any) => i.name).join(", ")}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Duration",
      dataIndex: "details",
      key: "duration",
      width: 80,
      render: (details: any) => (
        <span className="text-xs">{details.duration}</span>
      ),
    },
    {
      title: "Fee",
      dataIndex: "details",
      key: "fee",
      width: 100,
      render: (details: any) => (
        <span className="text-xs">
          {details?.course_fee?.amount ?? 0}{" "}
          {details?.course_fee?.currency ?? "USD"}
        </span>
      ),
    },
  ];
  return (
    <div className="bg-white rounded-xl border  h-full flex flex-col">
      <div className="p-3 md:p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm md:text-base font-semibold text-gray-900">
            Latest Courses
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
