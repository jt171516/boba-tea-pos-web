import React, { useState, useEffect } from "react";

const AddEmployee = ({ isOpen, onClose, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    manager: false, // Boolean field for Manager
    password: "", // Field for Password
  });

  // Populate form fields when initialData is provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData); // Pre-fill the form with initial data
    } else {
      setFormData({
        id: "",
        name: "",
        manager: false,
        password: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox for manager
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `${import.meta.env.VITE_APP_API_URL}/employees/${formData.id}`
        : `${import.meta.env.VITE_APP_API_URL}/employees`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save employee");
      }

      const savedEmployee = await response.json();
      onAdd(savedEmployee); // Pass the saved employee to the parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Failed to save employee. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {initialData ? "Edit Employee" : "Add Employee"}
        </h2>
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
            <label className="block mb-2">Manager</label>
            <input
              type="checkbox"
              name="manager"
              checked={formData.manager}
              onChange={handleChange}
              className="checkbox"
            />
            <span className="ml-2">Is Manager</span>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input
              type={initialData ? "text" : "password"} // Show password as text when editing
              name="password"
              value={formData.password}
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
              {initialData ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;