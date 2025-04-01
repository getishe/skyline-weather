import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
// import WeeklyForecast from "./components/WeeklyForecast";
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

      // fetch fetch weekly forecast using latitude and longitude
      const { lat, lon } = weatherData.coord;
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=${unit}&appid=${API_KEY}`
      );

      const forecastData = await forecastResponse.json();
      setForecast(forecastData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Forecast not found");
      setWeather(null);
      setForecast(null);
    }
  };

  // fetchforecast data whether the city changes
  const fetchForecast = async (lat, lon) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=${unit}&appid=${API_KEY}`
    );
    const data = await response.json();
    // if (data.cod !== "200")
    //   throw new Error("Forecast not found");
    // // setForecast(data.list);
    return data;
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
      {/* <WeatherForecast /> */}
    </div>
  );
};

export default App;
//  /* <WeeklyForecast forecastData={forecast} /> */
