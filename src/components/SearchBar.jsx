import React, { useState } from "react";
import WeeklyForecast from "./WeeklyForecast";
import config from "../config/config";

/**
 * SearchBar Component
 * Handles user input for searching cities
 * @param {Function} onSearch - Callback function to handle search
 */
const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState(""); // Local state for input field
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return; // Prevent empty searches

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${config.WEATHER_API_URL}/forecast?q=${city}&appid=${config.WEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();

      // Process the forecast data
      const processedData = data.list
        .filter((item, index) => index % 8 === 0) // Get one reading per day
        .map((item) => ({
          date: new Date(item.dt * 1000).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          temp: Math.round(item.main.temp),
          weather: item.weather[0].main,
          icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        }));

      setForecastData(processedData);
      onSearch(city.trim());
      setCity("");
    } catch (error) {
      setError(error.message);
      console.error("Error fetching forecast:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl mt-4 py-5 px-32 bg-gray-300 rounded-lg shadow-xl">
      <div className="flex justify-between items-center flex-row">
        <h1 className="text-2xl font-bold text-blue-600">Skyline</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {" "}
              Search
            </button>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="text-center mt-4">
          <p className="text-blue-600">Loading forecast...</p>
        </div>
      )}

      {error && (
        <div className="text-center mt-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!isLoading && !error && <WeeklyForecast forecastData={forecastData} />}
    </div>
  );
};

export default SearchBar;
