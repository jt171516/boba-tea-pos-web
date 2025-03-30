import React, { useState, useEffect } from 'react';

function TopBar() 
{
  const [time, setTime] = useState(new Date());

  useEffect(() => 
    {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="w-full bg-gray-800 text-white flex justify-between items-center px-4 py-2">
      <div>
        {time.toLocaleTimeString()}
      </div>
      <div>
        Weather: <span className="text-blue-300">Sunny, 75 degrees F</span>
      </div>
    </div>
  );
}

export default TopBar;
