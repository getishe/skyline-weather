import React from "react";

const WeeklyForecast = ({ forecastData }) => {
  if (!forecastData) return null;

  return (
    <div className="mt-4 bg-white rounded-lg shadow-xl p-4">
      <h2 className="text-xl font-semibold mb-4">7-Day Forecast</h2>
      <div className="grid grid-cols-7 gap-4">
        {forecastData.map((day, index) => (
          <div key={index} className="text-center p-2 bg-gray-50 rounded-md">
            <div className="font-medium">{day.date}</div>
            <img
              src={day.icon}
              alt={day.weather}
              className="w-12 h-12 mx-auto"
            />
            <div className="text-sm">
              <span className="font-bold">{day.temp}°C</span>
            </div>
            <div className="text-xs text-gray-600">{day.weather}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;
