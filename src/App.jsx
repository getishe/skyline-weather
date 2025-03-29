import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("London");
  const [unit, setUnit] = useState("C");

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (city) => {
    const API_KEY = "YOUR_API_KEY";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    setWeather(data);
  };

  return (
    <div className="app">
      {/* hello */}
      <SearchBar onSearch={setCity} />
      <WeatherCard weather={weather} unit={unit} />
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
