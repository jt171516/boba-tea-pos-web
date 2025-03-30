import React from "react";
import { useNavigate } from "react-router-dom";

const WorkerPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // replace with real login logic later
    navigate("/worker/dashboard"); // example route
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-100">
      <h1 className="text-4xl font-bold mb-4">Worker Portal</h1>
      <p className="mb-6 text-lg">Welcome, worker. Please log in to access your tools.</p>
      <button onClick={handleLogin} className="btn btn-secondary text-lg">
        Log In as Worker
      </button>
    </div>
  );
};

export default WorkerPage;
