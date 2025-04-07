import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ManagerSideMenu from "../components/ManagerSideMenu";
import TopBar from "../components/TopBar";

const ManagerPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="flex flex-col h-screen">
      {isLoggedIn ? (
        <>
          <TopBar />
          <div className="flex flex-grow">
            <ManagerSideMenu />
            <div className="flex-grow p-4 overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-base-100">
          <div><img src='/src/img/sharetaele.png' width="500"></img></div>
          <h1 className="text-4xl font-bold mb-4">Manager Portal</h1>
          <button onClick={handleLogin} className="btn btn-primary text-lg">
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerPage;