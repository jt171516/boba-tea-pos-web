import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Archive, DollarSign, List, Signpost, User } from "lucide-react";

function ManagerSideMenu() {

  const location = useLocation(); // Get the current route
  const handleLogout = () => {
  const currentUrl = window.location.href;
  window.location.href = `${import.meta.env.VITE_APP_AUTH_URL}/logout?state=${encodeURIComponent(currentUrl)}`;

  };

  const categories = [
    { name: "Overview", icon: <List size={20} /> },
    { name: "Sales", icon: <DollarSign size={20} /> },
    { name: "Menu", icon: <Signpost size={20} /> },
    { name: "Inventory", icon: <Archive size={20} /> },
    { name: "Employees", icon: <User size={20} /> },
  ];

  return (
    <div className="bg-gray-900 text-gray-200 h-[calc(100vh-3.5rem)] w-56 shadow-lg flex flex-col p-4 sticky top-14">
      <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">Manager Panel</h2>
      <nav className="flex flex-col gap-3">
        {categories.map((category) => {
          const isActive = location.pathname === `/manager/${category.name.toLowerCase().replace(/\s+/g, "-")}`;
          return (
            <Link
              key={category.name}
              to={`/manager/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              className={`flex items-center gap-3 p-3 rounded-lg transition duration-200 ease-in-out ${
                isActive ? "bg-gray-700 text-white font-bold" : "hover:bg-gray-700"
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto mx-auto">
        <button onClick={handleLogout} className="btn btn-primary btn-lg gap-2">
          Logout
        </button>
      </div>
    </div>
  );
}

export default ManagerSideMenu;