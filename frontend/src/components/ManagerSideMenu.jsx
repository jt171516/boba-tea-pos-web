import React from 'react';
import { Link } from 'react-router-dom';

function ManagerSideMenu() {
  const handleLogout = () => {
  const currentUrl = window.location.href;
  window.location.href = `${import.meta.env.VITE_APP_AUTH_URL}/logout?state=${encodeURIComponent(currentUrl)}`;
  };

  return (
    <div className="bg-gray-900 text-gray-200 h-[calc(100vh-3.5rem)] w-56 shadow-lg flex flex-col p-4 sticky top-14">
      <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">Manager Panel</h2>
      <nav className="flex flex-col gap-3">
        <Link
          to="/manager/"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
        >
          Overview
        </Link>
        <Link
          to="/manager/sales"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
        >
          Sales
        </Link>
        <Link
          to="/manager/menu"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
        >
          Menu
        </Link>
        <Link
          to="/manager/inventory"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
        >
          Inventory
        </Link>
        <Link
          to="/manager/employees"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
        >
          Employees
        </Link>
      </nav>
      <div className="mt-auto mx-auto">
        <button
          onClick={handleLogout}
          className="btn btn-primary btn-lg gap-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default ManagerSideMenu;