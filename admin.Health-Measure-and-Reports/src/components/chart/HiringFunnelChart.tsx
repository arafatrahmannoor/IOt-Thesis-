import { ApexOptions } from "apexcharts";
import React from "react";
import Chart from "react-apexcharts";

const HiringFunnelChart: React.FC = () => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    colors: ["#ff4778"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        dataLabels: {
          position: "center",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        const data = [3847, 1923, 769, 384, 192];
        return `${data[opts.dataPointIndex]}`;
      },
      style: {
        colors: ["#ffffff"],
        fontSize: "12px",
        fontWeight: 600,
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: [
        "Applications",
        "Screening",
        "Phone Screen",
        "Final Interview",
        "Offers Extended",
      ],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value, { dataPointIndex }) => {
          const data = [3847, 1923, 769, 384, 192];
          const percentages = [100, 50, 20, 10, 5];
          return `${data[dataPointIndex]} candidates (${percentages[dataPointIndex]}%)`;
        },
      },
    },
  };

  const series = [
    {
      name: "Candidates",
      data: [100, 50, 20, 10, 5],
    },
  ];

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Hiring Funnel
      </h3>
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default HiringFunnelChart;
