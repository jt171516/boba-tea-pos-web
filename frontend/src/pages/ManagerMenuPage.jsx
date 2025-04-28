import React, { useEffect, useState } from "react";
import AddMenuItem from "../components/AddMenuItem";
import { Plus } from "lucide-react"; // Import the Plus icon

const ManagerMenuPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [itemToEdit, setItemToEdit] = useState(null); // State for the item being edited

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
    const updatedItems = items.map((item) =>
      item.id === newItem.id ? newItem : item
    );

    // If the item doesn't exist, add it
    if (!items.some((item) => item.id === newItem.id)) {
      updatedItems.push(newItem);
    }

    setItems(updatedItems);
    setFilteredItems(updatedItems);
  };

  const handleDeleteItem = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/item/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Remove the item from the frontend state
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);
      setFilteredItems(updatedItems);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleEditItem = (item) => {
    setItemToEdit(item); // Set the item to be edited
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 p-3">
        <input
          type="text"
          placeholder="Search by ID or Name"
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
        />
        <button
          onClick={() => {
            setItemToEdit(null); // Clear the itemToEdit state for adding a new item
            setIsModalOpen(true);
          }}
          className="btn btn-primary px-3 py-3 text-lg flex items-center gap-1"
        >
          <Plus size={20} /> Add Item
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-center">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Category</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Calories</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Price</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Sales</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.category}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.calories}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.price}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.sales}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => handleEditItem(item)}
                  className="btn btn-warning btn-sm mr-2"
                >
                  Edit
                </button>
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

      {/* Add/Edit Item Modal */}
      <AddMenuItem
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
        initialData={itemToEdit} // Pass the item to edit as initial data
      />
    </div>
  );
};

export default ManagerMenuPage;