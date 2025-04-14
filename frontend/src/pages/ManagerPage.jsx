import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ManagerSideMenu from "../components/ManagerSideMenu";
import TopBar from "../components/TopBar";
import { toast, Toaster } from "react-hot-toast";

const ManagerPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Google login is temporarily disabled.");
  };

  // Function to handle login and redirect to the auth server
  // const handleLogin = () => {
  //   const currentUrl = window.location.href;
  //   window.location.href = `${import.meta.env.VITE_APP_AUTH_URL}/google?state=${encodeURIComponent(currentUrl)}`;
  // };

  // Effect to check URL parameters
  // useEffect(() => {

  //   // Check for login failure or logout in the URL parameters
  //   const urlParams = new URLSearchParams(location.search);
  //   const loginFailure = urlParams.get("loginFailure");
  //   const logout = urlParams.get("logout");
    
  //   // Display appropriate toast messages based on URL parameters
  //   if (loginFailure) {
  //     toast.error("Login failed. Please try again.");
  //     navigate(location.pathname, { replace: true });
  //   }

  //   if (logout) {
  //     toast.success("Logged out successfully.");
  //     navigate(location.pathname, { replace: true });
  //   }

  //   // Check if the user is logged in by making a request to protected route
  //   fetch(`${import.meta.env.VITE_APP_AUTH_URL}/protected`, { credentials: "include" })
  //     .then((response) => {
  //       if (response.ok) {
  //         setIsLoggedIn(true);
  //       } else {
  //         setIsLoggedIn(false);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching login status:", error);
  //       setIsLoggedIn(false);
  //     });
  // }, [location, navigate]);

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-center" />
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