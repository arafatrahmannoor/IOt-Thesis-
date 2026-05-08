import { ApexOptions } from "apexcharts";
import { useState } from "react";
import Chart from "react-apexcharts";

const JobApplicationsAnalyticsChart = ({ data }: any) => {
  const [activeFilter, setActiveFilter] = useState("30 days");

  const chartData: Record<string, number[]> = {
    "12 months": [...data?.months12?.activity],
    "30 days": [...data?.days30?.activity],
    "7 days": [...data?.days7?.activity],
    "24 hours": [...data?.hours24?.activity],
  };

  const categories: Record<string, string[]> = {
    "12 months": [...data?.months12?.time_frame],
    "30 days": [...data?.days30?.time_frame],
    "7 days": [...data?.months12?.time_frame],
    "24 hours": [...data?.hours24?.time_frame],
  };

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    colors: ["#ff4778"], // green tone
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: "50%",
      },
    },
    dataLabels: { enabled: false },
    grid: { borderColor: "#f1f5f9" },
    xaxis: {
      categories: categories[activeFilter],
      labels: {
        style: { colors: "#64748b", fontSize: "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#64748b", fontSize: "12px" },
      },
    },
    tooltip: { theme: "light" },
  };

  const series = [
    {
      name: "Applications",
      data: chartData[activeFilter],
    },
  ];

  return (
    <div className="bg-white rounded-xl border p-4 md:p-6 ">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-3 md:mb-4 gap-3">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Job Applications Analytics
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            Job applications analytics of last {activeFilter}
          </p>
        </div>
        {/* Filter Tabs */}
        <div className="flex flex-wrap bg-gray-100 rounded-md border p-1 gap-1">
          {["12 months", "30 days", "7 days", "24 hours"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors duration-200 ${
                activeFilter === filter
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 md:h-80">
        <Chart options={options} series={series} type="bar" height={250} />
      </div>
    </div>
  );
};

export default JobApplicationsAnalyticsChart;
