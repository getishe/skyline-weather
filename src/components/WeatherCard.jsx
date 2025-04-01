import React from "react";

/**
 * WeatherCard Component
 * Displays current weather information
 * @param {Object} weather - Weather data from API
 * @param {object} forecast - weekly forecast dat from API
 * @param {string} unit - Temperature unit (C/F)
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
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-us", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const convertTemp = (temp) => {
    return unit === "C" ? temp : (temp * 9) / 5 + 32;
  };

  // Main weather display
  return (
    <div className="mx-auto max-w-screen-xl mt-4 py-5 px-32 bg-gray-300 rounded-lg shadow-xl">
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

      {/* Weather icon */}
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      {/* Weekly forecast section */}
      {forecast?.daily?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Weekly Forecast</h2>
          <div className="grid grid-cols-5 gap-4">
            {forecast.daily.slice(1, 6).map((day) => (
              <div
                key={day.dt}
                className="text-center p-4 bg-gray-200 rounded-lg"
              >
                <p className="font-medium">{formatDate(day.dt)}</p>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description || "Weather icon"}
                  className="mx-auto"
                />
                <p className="font-bold">
                  {Math.round(convertTemp(day.temp.max))}°{unit}
                </p>
                <p className="text-sm text-gray-600">
                  {Math.round(convertTemp(day.temp.min))}°{unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
