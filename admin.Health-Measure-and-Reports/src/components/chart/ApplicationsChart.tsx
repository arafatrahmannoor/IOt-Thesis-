import { ApexOptions } from "apexcharts";
import React from "react";
import Chart from "react-apexcharts";

const ApplicationsChart: React.FC = () => {
  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
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
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 3,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
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
        formatter: (value) => `${value} applications`,
      },
    },
  };

  const series = [
    {
      name: "Applications",
      data: [245, 312, 289, 367, 423, 398, 456, 512, 478, 534, 589, 612],
    },
  ];

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Applications Over Time
      </h3>
      <Chart options={options} series={series} type="area" height={300} />
    </div>
  );
};

export default ApplicationsChart;
