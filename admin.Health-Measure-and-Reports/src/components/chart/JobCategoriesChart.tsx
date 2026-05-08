import { ApexOptions } from "apexcharts";
import React from "react";
import Chart from "react-apexcharts";

const JobCategoriesChart: React.FC = () => {
  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 300,
    },
    colors: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#6B7280"],
    labels: ["Technology", "Healthcare", "Finance", "Marketing", "Others"],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${Math.round(Number(val))}%`,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Jobs",
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
            },
          },
        },
      },
    },
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontWeight: 500,
      labels: {
        colors: "#64748b",
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}%`,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = [42, 28, 18, 8, 4];

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Job Categories Distribution
      </h3>
      <Chart options={options} series={series} type="donut" height={300} />
    </div>
  );
};

export default JobCategoriesChart;
