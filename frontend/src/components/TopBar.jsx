import React, { useState, useEffect } from 'react';

function TopBar() 
{
  const [time, setTime] = useState(new Date());

  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherData = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Texas,us&appid=${import.meta.env.VITE_WEATHER_KEY}`)
      .then(res => res.json())
      .then(data => {
        setWeatherData(data);
      })
      .catch(err => {
        console.error('Error fetching weather data:', err);
      });
  };

  useEffect(() => 
    {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div className="w-full bg-gray-800 text-white flex justify-between items-center px-4 py-2">
      <div>
        {time.toLocaleTimeString()}
      </div>
      <div>
        Weather:{" "}
        <span className="text-blue-300">
          {weatherData ? weatherData.name : 'Loading...'}{" "}
          {weatherData && weatherData.main ? 
            weatherData.main.temp + '°K'
            : ''}
        </span>
      </div>
    </div>
  );
}

export default TopBar;
