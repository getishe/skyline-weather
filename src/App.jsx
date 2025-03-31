import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

/**
 * Main App Component
 * Manages the application state and coordinates between components
 */
const App = () => {
  // State Management
  const [weather, setWeather] = useState(null); // Current weather data
  const [city, setCity] = useState("London"); // Selected city
  const [unit, setUnit] = useState("C"); // Temperature unit (C/F)
  const [forecast, setForecast] = useState(null); // Forecast data
  const [error, setError] = useState(null); // Error state

  // Fetch weather data when city changes
  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  /**
   * Fetches both current weather and forecast data from OpenWeather API
   * @param {string} city - City name to fetch weather for
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

      // Fetch forecast data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      if (forecastData.cod !== "200") {
        setError("Forecast not found");
        setForecast(null);
        return;
      }

      setForecast(forecastData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Forecast not found");
      setWeather(null);
      setForecast(null);
    }
  };

  return (
    <div className="app">
      <SearchBar onSearch={setCity} />
      {error ? (
        <div className="mx-auto max-w-screen-xl mt-4 py-5 px-32 bg-gray-300 rounded-lg shadow-xl">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      ) : (
        <WeatherCard weather={weather} forecast={forecast} unit={unit} />
      )}
      <button onClick={() => setUnit(unit === "C" ? "F" : "C")}>
        Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
      </button>
    </div>
  );
};

export default App;
