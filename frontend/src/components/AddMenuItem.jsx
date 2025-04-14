import React, { useState, useEffect } from "react";

const AddMenuItem = ({ isOpen, onClose, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    calories: "",
    price: "",
    sales: "",
  });

  // Populate form fields when initialData is provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData); // Pre-fill the form with initial data
    } else {
      setFormData({ id: "", name: "", category: "", calories: "", price: "", sales: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `${import.meta.env.VITE_APP_API_URL}/item/${formData.id}`
        : `${import.meta.env.VITE_APP_API_URL}/item`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save item");
      }

      const savedItem = await response.json();
      onAdd(savedItem); // Pass the saved item to the parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">{initialData ? "Edit Item" : "Add Item"}</h2>
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
              disabled={!!initialData} // Disable ID field when editing
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
              {initialData ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;