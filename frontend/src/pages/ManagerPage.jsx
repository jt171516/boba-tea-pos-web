import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ManagerSideMenu from "../components/ManagerSideMenu";
import TopBar from "../components/TopBar";
import { toast, Toaster } from "react-hot-toast";
import sharetaele from '../img/sharetaele.png';

const ManagerPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to handle login and redirect to the auth server
  const handleLogin = () => {
    const currentUrl = window.location.href;
    window.location.href = `${import.meta.env.VITE_APP_AUTH_URL}/google?state=${encodeURIComponent(currentUrl)}`;
  };

  // Effect to check URL parameters
  useEffect(() => {

    // Check for login failure or logout in the URL parameters
    const urlParams = new URLSearchParams(location.search);
    const loginFailure = urlParams.get("loginFailure");
    const logout = urlParams.get("logout");
    const URLtoken = urlParams.get("token");

    if (URLtoken) {
      localStorage.setItem("token", URLtoken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Display appropriate toast messages based on URL parameters
    if (loginFailure) {
      toast.error("Login failed. Please try again.");
      navigate(location.pathname, { replace: true });
    }

    if (logout) {
      localStorage.removeItem("token");
      toast.success("Logged out successfully.");
      navigate(location.pathname, { replace: true });
    }

    // Check if the user is logged in by making a request to protected route
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${import.meta.env.VITE_APP_AUTH_URL}/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.ok) {
          fetch(`${import.meta.env.VITE_APP_AUTH_URL}/manager`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.ok) {
              setIsLoggedIn(true);
              if (!location.pathname.match("/manager")) {
                navigate("/manager/overview", { replace: true });
              }
            } 
            else {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
              toast.error("Login failed. Must be manager.");
            }
          })
          .catch((error) => {
            console.error("Error fetching login status:", error);
            setIsLoggedIn(false);
          });
        } 
        else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching login status:", error);
        setIsLoggedIn(false);
      });
    }
    else {
      setIsLoggedIn(false);
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col h-auto min-h-screen">
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
          <div><img src={sharetaele} width="500" alt="Sharetaele"></img></div>
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