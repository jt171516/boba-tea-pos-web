import React, { useEffect, useState } from "react";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredInventory, setFilteredInventory] = useState([]); 
  
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/inventory`);
        if (!response.ok) {
          throw new Error("Failed to fetch inventory data");
        }
        const data = await response.json();

        const sortedData = data.sort((a, b) => a.id - b.id);
        setInventory(sortedData);
        setFilteredInventory(sortedData);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };

    fetchInventory();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter inventory by ID or name
    const filtered = inventory.filter(
      (item) =>
        item.id.toString().includes(query) || item.name.toLowerCase().includes(query)
    );
    setFilteredInventory(filtered);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Inventory Management</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by ID or Name"
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
        />
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;