import React from "react";

const WeatherCard = ({ weather, unit }) => {
  if (!weather) return <p> Loading....</p>;

  if (weather.cod !== 200) {
    return <p>City not found</p>;
  }
  return (
    <div className="mx-auto max-w-screen-xl mt-4 py-5 px-32 bg-gray-300 rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold">{weather.name}</h1>
      <p className="text-lg">{weather.weather[0].description}</p>
      <p className="text-lg">
        {weather.main.temp}°{unit}
      </p>
      <p className="text-lg">Humidity: {weather.main.humidity}%</p>
      <p className="text-lg">Wind Speed: {weather.wind.speed} m/s</p>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
    </div>
  );
};

export default WeatherCard;
