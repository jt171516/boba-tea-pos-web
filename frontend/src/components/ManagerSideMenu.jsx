import React from 'react';
import { Link } from 'react-router-dom';
import sharetaele from "../img/sharetaele.png";

function ManagerSideMenu() {
  return (
    <div className="bg-gray-900 text-gray-200 h-[calc(100vh-2.5rem)] w-56 shadow-lg flex flex-col p-4 sticky top-10">
      <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">Manager Panel</h2>
      <nav className="flex flex-col gap-3">
        <Link
          to="/manager/sales"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
        >
          Sales
        </Link>
        <Link
          to="/manager/inventory"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
        >
          Inventory
        </Link>
      </nav>
    </div>
  );
}

export default ManagerSideMenu;