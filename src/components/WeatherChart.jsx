import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherChart = ({ forecastData, unit }) => {
  if (!forecastData || !forecastData.list) return null;

  const dailyForecasts = forecastData.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = item;
    }
    return acc;
  }, {});

  //   const labels = Object.keys(dailyForecasts);
  //   const temperatures = Object.values(dailyForecasts).map((item) =>
  //     unit === "C"
  //       ? item.main.temp - 273.15
  //       : (item.main.temp - 273.15) * (9 / 5) + 32
  //   );

  const labels = Object.keys(dailyForecasts);
  const temperatures = Object.values(dailyForecasts).map((item) => {
    //     if (unit === "C") {
    //       return item.main.temp - 273.15;
    //     } else if (unit === "F") {
    //       return (item.main.temp - 273.15) * (9 / 5) + 32;
    //     } else {
    //       return Math.round(temp * 10) / 10;
    //     }
    //   });
    // .map((item) => {
    const temp =
      unit === "C"
        ? item.main.temp - 273.15
        : (item.main.temp - 273.15) * (9 / 5) + 32;
    return Math.round(temp * 10) / 10; // Round to 1 decimal place
  });

  // Null check for data availability

  /**
   * Reduces forecast list into daily entries
   * Takes the first forecast of each day as the daily representative
   */

  const data = {
    labels,
    datasets: [
      {
        label: `Temperature (${unit})`,
        data: temperatures,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },

    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    responsive: true,
  };
  return (
    <div className=" mt-4 py-5 bg-gray-300 rounded-lg shadow-xl ">
      <h2 className="mt-6 px-3">7-Day Weather Forecast</h2>
      <div className=" flex justify-center items-center h-64 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WeatherChart;
