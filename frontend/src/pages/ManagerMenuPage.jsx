import React, { useEffect, useState } from "react";
import AddMenuItem from "../components/AddMenuItem";

const ManagerMenuPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredItems, setFilteredItems] = useState([]); 
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/item`);
        if (!response.ok) {
          throw new Error("Failed to fetch item data");
        }
        const data = await response.json();

        const sortedData = data.sort((a, b) => a.id - b.id);
        setItems(sortedData);
        setFilteredItems(sortedData);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    fetchItems();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = items.filter(
      (item) =>
        item.id.toString().includes(query) || item.name.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
    setFilteredItems([...items, newItem]);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Menu Item Management</h1>

      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by ID or Name"
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          Add Item
        </button>
      </div>
    

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Calories</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Sales</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.category}</td>
              <td className="border border-gray-300 px-4 py-2">{item.calories}</td>
              <td className="border border-gray-300 px-4 py-2">{item.price}</td>
              <td className="border border-gray-300 px-4 py-2">{item.sales}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddMenuItem
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
};

export default ManagerMenuPage;