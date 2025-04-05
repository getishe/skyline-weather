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

  // fetchforecast data whether the city changes
  // const fetchForecast = async (lat, lon) => {
  //   const response = await fetch(
  //     `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=${unit}&appid=${API_KEY}`
  //   );
  //   const data = await response.json();
  //   // if (data.cod !== "200")
  //   //   throw new Error("Forecast not found");
  //   // // setForecast(data.list);
  //   return data;
  // };

  /**
   * Main render method
   * Conditionally renders:
   * - Search bar (always)
   * - Error message (when error exists)
   * - Weather card and forecast (when data exists)
   * - Unit toggle button
   */
  return (
    <div className="bg-gray-100 grid grid-cols-2 gap-4 p-4">
      <SearchBar onSearch={setCity} />
      {error ? (
        <div className="mx-auto max-w-screen-xl mt-4 py-5 px-32 bg-gray-300 rounded-lg shadow-xl">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      ) : (
        <>
          <WeatherCard weather={weather} forecast={forecast} unit={unit} />
          <WeeklyForecast forecastData={forecast} unit={unit} />
          <WeatherChart forecastData={forecast} unit={unit} />
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setUnit(unit === "C" ? "F" : "C")}
          >
            Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
          </button>
        </>
      )}
      {/* <WeatherForecast /> */}
    </div>
  );
};

export default App;
//  /* <WeeklyForecast forecastData={forecast} /> */
