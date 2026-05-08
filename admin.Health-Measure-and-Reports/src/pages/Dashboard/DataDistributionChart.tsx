import React from "react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

interface DataDistributionChartProps {
  data?: any;
}

export default function DataDistributionChart({
  data,
}: DataDistributionChartProps) {
  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 250,
      toolbar: {
        show: false,
      },
    },
    colors: ["#ff4778", "#7a5af8", "#12b76a", "#f79009", "#f04438", "#8b5cf6"],
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#1f2937",
              formatter: function (w: any) {
                const total = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                return total.toLocaleString();
              },
            },
            value: {
              show: true,
              fontSize: "14px",
              fontWeight: "bold",
              color: "#64748b",
              formatter: function (val: any) {
                return val;
              },
            },
          },
        },
      },
    },
    labels: [
      "Jobs",
      "Applicants",
      "Career Jobs",
      "Courses",
      "Enrollment",
      "Blogs",
    ],
    legend: {
      show: true,
      position: "bottom",
      fontSize: "12px",
      markers: {
        // @ts-ignore tells TypeScript to ignore missing types
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        width: 8,
        height: 8,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val.toLocaleString();
        },
      },
    },
  };

  const series = [
    data?.jobs?.total || 0,
    data?.applicants?.total || 0,
    data?.careerJobs?.total || 0,
    data?.courses?.total || 0,
    data?.enrollment?.total || 0,
    data?.blogs?.total || 0,
  ];

  return (
    <div className="bg-white rounded-xl border p-4 md:p-6">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">
          Data Distribution
        </h3>
        <div className="text-xs md:text-sm text-gray-500">Overview</div>
      </div>
      <div className="h-64 md:h-80 w-full">
        <Chart options={options} series={series} type="donut" height={250} />
      </div>
    </div>
  );
}
