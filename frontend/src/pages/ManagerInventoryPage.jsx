import React, { useEffect, useState } from "react";

const ManagerInventoryPage = () => {
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

    const filtered = inventory.filter(
      (item) =>
        item.id.toString().includes(query) || item.name.toLowerCase().includes(query)
    );
    setFilteredInventory(filtered);
  };

  const handleDeleteItem = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/inventory/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete inventory item");
      }

      const updatedInventory = inventory.filter((item) => item.id !== id);
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      alert("Failed to delete inventory item. Please try again.");
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/inventory/${id}/quantity`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update inventory quantity");
      }

      const updatedItem = await response.json();

      const updatedInventory = inventory.map((item) =>
        item.id === id ? { ...item, qty: updatedItem.qty } : item
      );
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
    } catch (error) {
      console.error("Error updating inventory quantity:", error);
      alert("Failed to update inventory quantity. Please try again.");
    }
  };

  return (
    <div>
      <div className="mb-4 p-3">
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
            <th className="border border-gray-300 px-4 py-2 text-center">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, Math.max(0, item.qty - 1))
                    }
                    className="btn btn-sm btn-outline"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleQuantityChange(item.id, Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="input input-bordered w-16 text-center"
                  />
                  <button
                    onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                    className="btn btn-sm btn-outline"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="btn btn-error btn-sm"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerInventoryPage;