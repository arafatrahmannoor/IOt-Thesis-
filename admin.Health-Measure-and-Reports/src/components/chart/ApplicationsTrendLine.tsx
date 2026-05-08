import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const ApplicationsTrendLine = ({ data }: any) => {
  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    colors: ["#ff4778"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
    xaxis: {
      categories: [...data?.months12?.time_frame],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#4b5563", fontSize: "12px" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#4b5563", fontSize: "12px" },
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `${value}`,
      },
    },
  };

  const series = [
    {
      name: "Applications",
      data: [...data?.months12?.activity],
    },
  ];

  return (
    <div className="bg-white rounded-xl border p-4 md:p-6  ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">
          Job Applications Over Time
        </h3>
        <div className="text-xs md:text-sm text-gray-500">
          Last 12 months trend
        </div>
      </div>
      <div className="h-64 md:h-80">
        <Chart options={options} series={series} type="area" height={250} />
      </div>
    </div>
  );
};

export default ApplicationsTrendLine;
