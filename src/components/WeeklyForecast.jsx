// import React from "react";

// const WeeklyForecast = ({ forecastData }) => {
//   if (!forecastData) return null;

//   return (
//     <div className="mt-4 bg-white rounded-lg shadow-xl p-4">
//       <h2 className="text-xl font-semibold mb-4">7-Day Forecast</h2>
//       <div className="grid grid-cols-7 gap-4">
//         {forecastData.map((day, index) => (
//           <div key={index} className="text-center p-2 bg-gray-50 rounded-md">
//             <div className="font-medium">{day.date}</div>
//             <img
//               src={day.icon}
//               alt={day.weather}
//               className="w-12 h-12 mx-auto"
//             />
//             <div className="text-sm">
//               <span className="font-bold">{day.temp}°C</span>
//             </div>
//             <div className="text-xs text-gray-600">{day.weather}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WeeklyForecast;

// import React from "react";

// const WeeklyForecast = ({ forecastData, unit }) => {
//   if (!forecastData || !forecastData.daily) return null;

//   const formatDate = (dt) => {
//     return new Date(dt * 1000).toLocaleDateString("en-us", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const convertTemp = (temp) => {
//     return unit === "C" ? temp : (temp * 9) / 5 + 32;
//   };

//   return (
//     <div className="mx-auto max-w-screen-xl mt-4 py-5 px-32 bg-white rounded-lg shadow-xl">
//       <h2 className="text-xl font-semibold mb-4">7-Day Forecast</h2>
//       <div className="grid grid-cols-7 gap-4">
//         {forecastData.daily.slice(0, 7).map((day, index) => (
//           <div key={index} className="text-center p-2 bg-gray-50 rounded-md">
//             <div className="font-medium">{formatDate(day.dt)}</div>
//             <img
//               src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
//               alt={day.weather[0].description}
//               className="w-12 h-12 mx-auto"
//             />
//             <div className="text-sm">
//               <span className="font-bold">
//                 {Math.round(convertTemp(day.temp.day))}°{unit}
//               </span>
//             </div>
//             <div className="text-xs text-gray-600">
//               {day.weather[0].description}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WeeklyForecast;

import React from "react";

const WeeklyForecast = ({ forecastData, unit }) => {
  if (!forecastData || !forecastData.list) return null;

  // Group forecast by day
  const dailyForecasts = forecastData.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = item;
    }
    return acc;
  }, {});

  const formatDate = (dt) => {
    return new Date(dt * 1000).toLocaleDateString("en-us", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const convertTemp = (temp) => {
    return unit === "C" ? temp : (temp * 9) / 5 + 32;
  };

  return (
    <div className="mx-auto max-w-screen-xl mt-4 py-5 px-32 bg-white rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-4">7-Day Forecast</h2>
      <div className="grid grid-cols-7 gap-4">
        {Object.values(dailyForecasts)
          .slice(0, 7)
          .map((day, index) => (
            <div key={index} className="text-center p-2 bg-gray-50 rounded-md">
              <div className="font-medium">{formatDate(day.dt)}</div>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="w-12 h-12 mx-auto"
              />
              <div className="text-sm">
                <span className="font-bold">
                  {Math.round(convertTemp(day.main.temp))}°{unit}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {day.weather[0].description}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;
