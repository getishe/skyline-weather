import React from "react";

/**
 * WeeklyForecast Component
 * Purpose: Displays a 7-day weather forecast
 *
 * Props:
 * @param {Object} forecastData - Weather forecast data from API
 * @param {string} unit - Temperature unit (C/F)
 *
 * Features:
 * - Groups forecast data by day
 * - Displays weather icons
 * - Shows daily temperatures
 * - Formats dates for display
 * - Handles temperature unit conversion
 */

/**
 * Component Purpose:
 * Displays a 7-day weather forecast grid
 *
 * Data Processing:
 * 1. Receives raw forecast data from OpenWeather API
 * 2. Groups forecast entries by day using reduce()
 * 3. Takes first forecast of each day as representative
 *
 * Display Logic:
 * - Shows one card per day
 * - Each card contains:
 *   - Formatted date
 *   - Weather icon
 *   - Temperature
 *   - Weather description
 *
 * Helper Functions:
 * - formatDate: Converts Unix timestamps to readable dates
 * - convertTemp: Handles C/F temperature conversion
 */

const WeeklyForecast = ({ forecastData, unit }) => {
  // Null check for data availability
  if (!forecastData || !forecastData.list) return null;

  /**
   * Reduces forecast list into daily entries
   * Takes the first forecast of each day as the daily representative
   */
  const dailyForecasts = forecastData.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = item;
    }
    return acc;
  }, {});

  /**
   * Helper Functions
   * formatDate: Converts Unix timestamp to formatted date string
   * convertTemp: Handles temperature unit conversion between C and F
   */
  const formatDate = (dt) => {
    return new Date(dt * 1000).toLocaleDateString("en-us", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const convertTemp = (temp) => {
    return unit === "C" ? temp : (temp * 9) / 5 + 32;
  };

  return (
    <div className="mx-auto max-w-screen-xl mt-4  px-7  bg-white rounded-lg shadow-xl ">
      <h2 className="text-xl font-semibold mb-4">7-Day Forecast</h2>
      <div className="flex justify-center items-center h-full ">
        <div className="grid grid-cols-7 gap-4 w-full max-w-screen-lg ">
          {Object.values(dailyForecasts)
            .slice(0, 7)
            .map((day, index) => (
              <div
                key={index}
                className="text-center p-2 bg-gray-50 rounded-md"
              >
                <div className="font-medium">{formatDate(day.dt)}</div>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  className="w-12 h-12 mx-auto"
                />
                <div className="text-sm">
                  <span className="font-bold">
                    {Math.round(convertTemp(day.main.temp))}°{unit}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {day.weather[0].description}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyForecast;
