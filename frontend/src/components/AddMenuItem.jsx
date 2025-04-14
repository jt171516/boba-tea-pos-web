import React, { useState } from "react";

const AddMenuItem = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    calories: "",
    price: "",
    sales: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert id, price, calories, and sales to integers
    const formattedData = {
      ...formData,
      id: parseInt(formData.id, 10),
      price: parseInt(formData.price, 10),
      calories: parseInt(formData.calories, 10),
      sales: parseInt(formData.sales, 10),
    };

    console.log("Submitting form data:", formattedData); // Log the form data

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      console.log("Response status:", response.status); // Log the response status

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText); // Log the response error
        console.log("POST URL:", `${import.meta.env.VITE_APP_API_URL}/api/item`);
        throw new Error("Failed to add item to the database");
      }

      const newItem = await response.json();
      console.log("New item added:", newItem); // Log the added item
      onAdd(newItem);
      setFormData({ id: "", name: "", category: "", calories: "", price: "", sales: "" });
      onClose();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Menu Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">ID</label>
            <input
              type="number"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="milk-tea">Milk Tea</option>
              <option value="brewed-tea">Brewed Tea</option>
              <option value="fruit-tea">Fruit Tea</option>
              <option value="boba-tea">Boba Tea</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Calories</label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Sales</label>
            <input
              type="number"
              name="sales"
              value={formData.sales}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;