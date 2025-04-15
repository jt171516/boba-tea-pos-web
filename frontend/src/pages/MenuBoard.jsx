import React, { useEffect, useState } from "react";

const MenuBoard = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/item`);
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        console.log("Fetched items:", data); // Debugging log
        setItems(data.sort((a, b) => a.id - b.id)); // Sort items by ID
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-5xl font-bold text-center text-white mb-8">Menu Board</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={item.image || "https://via.placeholder.com/150"}
              alt={item.name || "Unnamed Item"}
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
            <h2 className="text-xl font-bold text-white">{item.name || "Unnamed Item"}</h2>
            <p className="text-gray-400">{item.category || "Uncategorized"}</p>
            <p className="text-lg font-semibold text-white mt-2">
              ${item.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuBoard;
