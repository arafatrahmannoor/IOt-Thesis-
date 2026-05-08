import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

interface SummaryChartProps {
  data: {
    applicants?: { total: number };
    careerJobs?: { total: number };
    courses?: { total: number };
    enrollment?: { total: number };
    blogs?: { total: number };
  };
}

const SummaryChart: React.FC<SummaryChartProps> = ({ data }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // ensure chart renders only on client
  }, []);

  if (!isClient) return <div className="text-gray-500">Loading chart...</div>;

  const series = [
    {
      name: "Total",
      data: [
        data?.applicants?.total || 0,
        data?.careerJobs?.total || 0,
        data?.courses?.total || 0,
        data?.enrollment?.total || 0,
        data?.blogs?.total || 0,
      ],
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: { type: "bar", toolbar: { show: true } },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "70%",
        distributed: true,
      },
    },
    colors: ["#ff4778", "#7a5af8", "#12b76a", "#f79009", "#f04438", "#8b5cf6"],
    dataLabels: {
      enabled: true,
      style: { colors: ["#fff"] },
      formatter: (val: number) => {
        const suffixes = ["", "K", "M", "B"];
        let order = Math.floor(Math.log10(val) / 3);
        if (order > suffixes.length - 1) order = suffixes.length - 1;
        return (val / Math.pow(1000, order)).toFixed(1) + suffixes[order];
      },
    },
    xaxis: {
      categories: [
        "Applicants",
        "Career Jobs",
        "Courses",
        "Enrollment",
        "Blogs",
      ],
    },
    tooltip: { y: { formatter: (val: number) => val.toLocaleString() } },
  };

  return (
    <div className="w-full pb-10">
      <Chart options={options} series={series} type="bar" height={265} />
    </div>
  );
};

export default SummaryChart;
