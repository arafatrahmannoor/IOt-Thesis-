import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const ProgressChart = ({ data }: any) => {
  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    colors: ["#ff4778", "#7a5af8", "#12b76a", "#f79009", "#f04438"],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "12px",
            color: "#64748b",
          },
          value: {
            fontSize: "16px",
            fontWeight: "bold",
            color: "#1f2937",
            formatter: function (val: any) {
              return val + "%";
            },
          },
        },
        track: {
          background: "#f1f5f9",
        },
      },
    },
    labels: ["Jobs", "Applicants", "Courses", "Enrollment", "Blogs"],
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
    },
    dataLabels: {
      enabled: true,
    },
  };

  // Calculate percentages based on the highest value
  const maxValue = Math.max(
    data?.jobs?.total || 0,
    data?.applicants?.total || 0,
    data?.courses?.total || 0,
    data?.enrollment?.total || 0,
    data?.blogs?.total || 0
  );

  const series = [
    Math.round(((data?.jobs?.total || 0) / maxValue) * 100),
    Math.round(((data?.applicants?.total || 0) / maxValue) * 100),
    Math.round(((data?.courses?.total || 0) / maxValue) * 100),
    Math.round(((data?.enrollment?.total || 0) / maxValue) * 100),
    Math.round(((data?.blogs?.total || 0) / maxValue) * 100),
  ];

  return (
    <div className="h-80 w-full">
      <Chart options={options} series={series} type="radialBar" height={300} />
    </div>
  );
};

export default ProgressChart;
