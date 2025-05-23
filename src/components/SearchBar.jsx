import React, { useState, useEffect } from "react";
import WeeklyForecast from "./WeeklyForecast";
import config from "../config/config";

/**
 * SearchBar Component
 * Purpose: Handles city search functionality
 *
 * Props:
 * @param {Function} onSearch - Callback to parent for city updates
 *
 * Features:
 * - Maintains local state for input field
 * - Handles form submission
 * - Makes API calls for weather data
 * - Manages loading and error states
 * - Processes forecast data
 * - Prevents empty searches
 */

/**
 * Component Purpose:
 * Handles user input for city searches
 *
 * Data Flow:
 * 1. User enters city name
 * 2. Form submission triggers handleSubmit
 * 3. API call is made to fetch forecast
 * 4. Results are processed and passed to parent
 *
 * Error Handling:
 * - Prevents empty searches
 * - Handles API errors
 * - Shows loading states
 *
 * Data Processing:
 * - Filters forecast data to one reading per day
 * - Formats dates and temperatures
 * - Prepares data for WeeklyForecast component
 */

const SearchBar = ({ onSearch }) => {
  // Local state management
  const [city, setCity] = useState(""); // Tracks input field value
  const [forecastData, setForecastData] = useState(null); // Stores processed forecast
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error handling
  const [recentSearches, setRecentSearches] = useState([]); // Tracks recent searches

  // Load recent searches from local storage on component mount
  useEffect(() => {
    const storedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  // Save recent searches to local storage
  const saveRecentSearch = (city) => {
    const updatedSearches = [
      city,
      ...recentSearches.filter((item) => item !== city),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  /**
   * Form submission handler
   * - Prevents default form behavior
   * - Validates input
   * - Makes API call
   * - Processes response
   * - Updates parent component
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
      saveRecentSearch(city.trim());
      setCity("");
    } catch (error) {
      setError(error.message);
      console.error("Error fetching forecast:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" mx-auto max-w-screen-xl mt-4 py-5  bg-gray-300 rounded-lg shadow-xl px-9 ">
      <div className="flex  flex-col sm:flex-row justify-between gap-4 sm:gap-x-6 mb-4 items-center ">
        <h1 className="text-2xl font-bold text-blue-600">Skyline</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-x-8">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              list="recent-searches"
            />
            <datalist id="recent-searches">
              {recentSearches.map((search, index) => (
                <option key={index} value={search} />
              ))}
            </datalist>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
