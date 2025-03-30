import React from "react";
import { useNavigate } from "react-router-dom";

const ManagerPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // replace this with actual login logic later
    navigate("/manager/dashboard"); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-100">
      <h1 className="text-4xl font-bold mb-4">Manager Portal</h1>
      <p className="mb-6 text-lg">Welcome, manager. Please log in to continue.</p>
      <button onClick={handleLogin} className="btn btn-primary text-lg">
        Log In as Manager
      </button>
    </div>
  );
};

export default ManagerPage;
