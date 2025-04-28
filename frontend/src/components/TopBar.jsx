import React, { useState, useEffect } from 'react';
import AccessibilityControls from './AccessibilityControls';
// import ContrastToggle       from './ContrastToggle';
import Translate from './Translate';

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
    <div className="z-10 w-full h-14 bg-gray-800 text-white flex justify-between items-center px-4 py-2 sticky top-0">
      <div>
        {time.toLocaleTimeString()}
      </div>
      <div className="flex items-center space-x-4">
        <Translate />
        <AccessibilityControls />     {/* text-size buttons */}
        {/* <ContrastToggle />          high-contrast button */}
        <span>
          Weather:{' '}
          <span className="text-blue-300">
            {weatherData ? weatherData.name : 'Loading...'}
            {weatherData?.main?.temp && ` ${weatherData.main.temp}°K`}
          </span>
        </span>
      </div>
    </div>
  );
}

export default TopBar;
