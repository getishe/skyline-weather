import React from "react";

/**
 * WeatherCard Component
 * Purpose: Displays current weather information for a selected city
 *
 * Props:
 * @param {Object} weather - Current weather data from OpenWeather API
 * @param {Object} forecast - Forecast data (unused in current implementation)
 * @param {string} unit - Temperature unit (C/F)
 *
 * Features:
 * - Displays weather icon
 * - Shows city name
 * - Shows weather description
 * - Displays temperature
 * - Shows humidity and wind speed
 * - Handles loading and error states
 */

/**
 * Component Responsibility:
 * Displays current weather data in a card format
 *
 * Data Flow:
 * 1. Receives weather data and unit preference from App.jsx
 * 2. Performs null checks and error handling
 * 3. Renders weather information in organized sections
 *
 * Display Sections:
 * - Weather icon from OpenWeather
 * - City name
 * - Current temperature
 * - Weather description
 * - Humidity and wind data
 */

const WeatherCard = ({ weather, forecast, unit }) => {
  // Debug logging
  console.log("Weather object:", weather);
  console.log("Forecast object:", forecast); // Debug log

  // Loading state check
  if (!weather || Object.keys(weather).length === 0) return <p> Loading....</p>;

  // Error state check
  if (weather.cod && weather.cod !== 200) {
    return (
      <div className="mx-auto max-w-screen-xl mt-4 py-5 px-32 bg-gray-300 rounded-lg shadow-xl">
        <p className="text-xl text-red-600">Forecast not found</p>
      </div>
    );
  }
  // Helper function to format date
  // const formatDate = (timestamp) => {
  //   return new Date(timestamp * 1000).toLocaleDateString("en-us", {
  //     weekday: "short",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };

  // const convertTemp = (temp) => {
  //   return unit === "C" ? temp : (temp * 9) / 5 + 32;
  // };

  // Main weather display
  return (
    <div className="mx-4   mt-4 py-5 px-32 bg-gray-300 rounded-lg shadow-xl">
      {/* Weather icon */}
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      {/* City name */}
      <h1 className="text-2xl font-bold">{weather.name}</h1>

      {/* Weather description */}
      <p className="text-lg">{weather.weather[0].description}</p>

      {/* Temperature */}
      <p className="text-lg">
        {weather.main.temp}°{unit}
      </p>

      {/* Additional weather details */}
      <p className="text-lg">Humidity: {weather.main.humidity}%</p>
      <p className="text-lg">Wind Speed: {weather.wind.speed} m/s</p>

      {/* <p className="text-lg">Pressure: {weather.main.pressure} hPa</p>
      <p className="text-lg">Visibility: {weather.visibility / 1000} km</p> */}

      {/* Forecast data */}
      {/* <h2 className="text-xl font-semibold mt-4">other cities </h2> */}
    </div>
  );
};

export default WeatherCard;
