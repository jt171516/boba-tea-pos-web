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
    <div className="z-10 w-full h-10 bg-gray-800 text-white flex justify-between items-center px-4 py-2 sticky top-0">
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
