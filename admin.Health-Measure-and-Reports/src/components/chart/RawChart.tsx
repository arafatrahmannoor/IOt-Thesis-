import { ApexOptions } from "apexcharts";
import React from "react";
import Chart from "react-apexcharts";

const RawChart: React.FC = () => {
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
        colors: ["#019532"],
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
                formatter: (value) => `${value} orders`,
            },
        },
    };

    const series = [
        {
            name: "Purchase Orders",
            data: [120, 98, 145, 178, 200, 165, 190, 220, 205, 240, 260, 300],
        },
    ];

    return (
        <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Purchase Orders Over Time
            </h3>
            <Chart options={options} series={series} type="area" height={300} />
        </div>
    );
};

export default RawChart;
