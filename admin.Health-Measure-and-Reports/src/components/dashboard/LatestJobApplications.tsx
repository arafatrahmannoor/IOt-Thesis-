import { Avatar, Space } from "antd";
import { User } from "lucide-react";
import AntTable from "../table/AntTable";

export default function LatestJobApplications({ data, isLoading }: any) {
  const columns = [
    {
      title: "Applicant",
      dataIndex: "full_name",
      key: "full_name",
      width: 150,
      render: (text: string, record: any) => (
        <Space>
          <Avatar
            icon={<User />}
            className="bg-blue-100 text-blue-600"
            size="small"
          />
          <div>
            {" "}
            <p className="font-medium text-xs">{text}</p>
            <p className="truncate">{record.phone_number}</p>
          </div>
        </Space>
      ),
    },

    {
      title: "Applied For",
      dataIndex: ["job", "title"],
      key: "jobTitle",
      width: 150,
      render: (_: any, record: any) => (
        <span className="font-medium text-xs text-gray-800 truncate block max-w-[130px]">
          {record.job?.title}
        </span>
      ),
    },
  ];
  return (
    <div className="bg-white rounded-xl border h-full flex flex-col">
      <div className="p-3 md:p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm md:text-base font-semibold text-gray-900">
            Latest Job Applications
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
