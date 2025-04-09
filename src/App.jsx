// Core React imports for state management and lifecycle
import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
// import WeeklyForecast from "./components/WeeklyForecast";
import "./App.css";
import WeeklyForecast from "./components/WeeklyForecast";
import WeatherChart from "./components/WeatherChart";

/**
 * Architecture Overview:
 * This is the main container component that:
 * 1. Manages global state for the entire application
 * 2. Handles API calls to OpenWeather
 * 3. Distributes data to child components
 *
 * Data Flow:
 * 1. User enters city in SearchBar
 * 2. App fetches weather data using OpenWeather API
 * 3. Data is passed down to WeatherCard and WeeklyForecast
 * 4. User can toggle temperature units (C/F)
 */

/**
 * Main App Component
 * Serves as the root component that:
 * - Manages global state (weather, city, unit, forecast, error)
 * - Coordinates data fetching
 * - Handles temperature unit conversion
 */

// Weather background mapping
const weatherBackgrounds = {
  Clear:
    "url('https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')",
  Clouds:
    "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2002&q=80')",
  Rain: "url('https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
  Snow: "url('https://images.unsplash.com/photo-1491002052546-bf38f186af56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2008&q=80')",
  default:
    "url('https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')",
};

const App = () => {
  /**
   * State Management:
   * - weather: Current weather conditions
   * - city: Currently selected city
   * - unit: Temperature unit (C/F)
   * - forecast: 7-day forecast data
   * - error: Error state for API calls
   */
  // State declarations with their purposes
  const [weather, setWeather] = useState(null); // Stores current weather data
  const [city, setCity] = useState("Addis Ababa"); // Tracks selected/searched city
  const [unit, setUnit] = useState("C"); // Temperature unit (Celsius/Fahrenheit)
  const [forecast, setForecast] = useState(null); // Stores 7-day forecast data
  const [error, setError] = useState(null); // Manages error states
  const [weatherCondition, setWeatherCondition] = useState("default"); // Tracks current weather condition

  /**
   * Effect hook that triggers weather fetch when city changes
   * This ensures new data is loaded whenever the user searches for a new city
   */
  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  /**
   * Fetches both current weather and forecast data
   * @param {string} city - Target city name
   * Uses OpenWeather API with environment variables for API key
   * Handles both success and error cases
   */
  const fetchWeather = async (city) => {
    try {
      setError(null);
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      if (weatherData.cod !== 200) {
        setError("Forecast not found");
        setWeather(null);
        setForecast(null);
        return;
      }

      setWeather(weatherData);
      setWeatherCondition(weatherData.weather[0].main); // Set weather condition

      // fetch fetch weekly forecast using latitude and longitude
      const { lat, lon } = weatherData.coord;
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const forecastData = await forecastResponse.json();
      if (forecastData.cod !== "200") {
        throw new Error("forecast no found");
      }
      setForecast(forecastData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Forecast not found");
      setWeather(null);
      setForecast(null);
    }
  };

  /**
   * Main render method
   * Conditionally renders:
   * - Search bar (always)
   * - Error message (when error exists)
   * - Weather card and forecast (when data exists)
   * - Unit toggle button
   */
  return (
    <div
      className="min-h-screen p-2 sm:p-4 mx-auto max-w-screen-xl bg-cover bg-center bg-no-repeat transition-all duration-500"
      style={{
        backgroundImage:
          weatherBackgrounds[weatherCondition] || weatherBackgrounds.default,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlend: "overlay",
      }}
    >
      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
        <SearchBar onSearch={setCity} />
        {error ? (
          <div className="mx-auto mt-4 p-4 bg-gray-300 rounded-lg shadow-xl">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 sm:p-4">
              <WeatherCard weather={weather} forecast={forecast} unit={unit} />
              <WeatherChart forecastData={forecast} unit={unit} />
              <div className="md:col-span-2">
                <WeeklyForecast forecastData={forecast} unit={unit} />
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setUnit(unit === "C" ? "F" : "C")}
            >
              Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
