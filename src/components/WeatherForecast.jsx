import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherForecast = () => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  const apiKey = "953f118534dab5c1aa583cb08f201db2"; // Replace with your OpenWeatherMap API key
  const lat = "35"; // Replace with latitude
  const lon = "139"; // Replace with longitude

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast`,
          {
            params: {
              lat,
              lon,
              appid: apiKey,
              units: "metric",
            },
          }
        );
        setForecast(response.data.list);
      } catch (err) {
        setError("Failed to fetch the forecast data.");
      }
    };

    fetchWeather();
  }, [lat, lon, apiKey]);

  return (
    <div>
      <h1>5-Day Weather Forecast</h1>
      {error && <p>{error}</p>}
      {!error &&
        forecast.slice(0, 5).map((item, index) => (
          <div key={index}>
            <h3>{new Date(item.dt * 1000).toLocaleString()}</h3>
            <p>Temperature: {item.main.temp}°C</p>
            <p>Weather: {item.weather[0].description}</p>
          </div>
        ))}
    </div>
  );
};

export default WeatherForecast;
