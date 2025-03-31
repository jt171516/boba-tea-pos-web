// filepath: /Users/caseyear/Documents/CS Classes/CSCE331/project3/project3-team11/frontend/src/pages/ManagerDashboard.jsx
import React from "react";
import ManagerSideMenu from "../components/ManagerSideMenu";
import TopBar from '../components/TopBar';

const ManagerDashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="w-full">
        <TopBar />
      </div>

      <div className="flex flex-grow">
        <ManagerSideMenu />

        <div className="flex-grow p-4">
          <h1 className="text-4xl font-bold text-center">Quick Overview</h1>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;