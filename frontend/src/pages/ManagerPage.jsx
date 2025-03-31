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
          <div className="w-full">
            <TopBar />
          </div>

          <div className="flex flex-grow">
            <ManagerSideMenu />

            <div className="flex-grow p-4">
              <Outlet />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-base-100">
          <h1 className="text-4xl font-bold mb-4">Manager Portal</h1>
          <p className="mb-6 text-lg">Welcome, manager. Please log in to continue.</p>
          <button onClick={handleLogin} className="btn btn-primary text-lg">
            Log In as Manager
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerPage;