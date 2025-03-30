import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("London");
  const [unit, setUnit] = useState("C");
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (city) => {
    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!weatherResponse.ok) throw new Error("Weather data fetch failed");
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!forecastResponse.ok) throw new Error("Forecast data fetch failed");
      const forecastData = await forecastResponse.json();
      setForecast(forecastData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
      setForecast(null);
    }
  };

  return (
    <div className="app">
      {/* hello */}
      <SearchBar onSearch={setCity} />
      <WeatherCard weather={weather} forecast={forecast} unit={unit} />
      <button onClick={() => setUnit(unit === "C" ? "F" : "C")}>
        Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
      </button>
    </div>
  );
};

export default App;

// <div>
// <a href="https://vite.dev" target="_blank">
//   <img src={viteLogo} className="logo" alt="Vite logo" />
// </a>
// <a href="https://react.dev" target="_blank">
//   <img src={reactLogo} className="logo react" alt="React logo" />
// </a>
// </div>
// <h1>Vite + React</h1>
// <div className="card">
// <button onClick={() => setCount((count) => count + 1)}>
//   count is {count}
// </button>
// <p>
//   Edit <code>src/App.jsx</code> and save to test HMR
// </p>
// </div>
// <p className="read-the-docs">
// Click on the Vite and React logos to learn more
// </p>
