import React, { useEffect, useState } from "react";
import AddEmployee from "../components/AddEmployee";
import { Plus } from "lucide-react";

const ManagerEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        console.log("Fetching employees...");
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/employees`);
        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }
        const data = await response.json();
        console.log("Fetched employees:", data);

        const sortedData = data.sort((a, b) => a.id - b.id);
        setEmployees(sortedData);
        setFilteredEmployees(sortedData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = employees.filter(
      (employee) =>
        employee.id.toString().includes(query) ||
        employee.name.toLowerCase().includes(query)
    );
    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = (newEmployee) => {
    console.log("Adding employee:", newEmployee);

    const updatedEmployees = employees.some((employee) => employee.id === newEmployee.id)
      ? employees.map((employee) =>
          employee.id === newEmployee.id ? newEmployee : employee
        )
      : [...employees, newEmployee]; // Add new employee if it doesn't exist

    setEmployees(updatedEmployees);
    setFilteredEmployees(updatedEmployees);
  };

  const handleDeleteEmployee = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this employee?");
    if (!confirmDelete) return;

    try {
      console.log("Deleting employee with ID:", id);
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/employees/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove employee");
      }

      const updatedEmployees = employees.filter((employee) => employee.id !== id);
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
    } catch (error) {
      console.error("Error removing employee:", error);
      alert("Failed to delete employee. Please try again.");
    }
  };

  const handleEditEmployee = (employee) => {
    console.log("Editing employee:", employee);
    setEmployeeToEdit(employee);
    setIsModalOpen(true);
  };

  const handleAddEmployeeClick = () => {
    // Set the modal to "Add Employee" mode by clearing initialData
    setEmployeeToEdit(null);
    setIsModalOpen(true);
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
          onClick={handleAddEmployeeClick}
          className="btn btn-primary px-3 py-3 text-lg flex items-center gap-1"
        >
          <Plus size={20} /> Add Employee
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-center">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Manager</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Password</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td className="border border-gray-300 px-4 py-2 text-center">{employee.id}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{employee.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {employee.manager ? "Yes" : "No"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {"*".repeat(employee.password.length)} {/* Hide password */}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => handleEditEmployee(employee)}
                  className="btn btn-warning btn-sm mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="btn btn-error btn-sm"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Employee Modal */}
      <AddEmployee
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEmployee}
        initialData={employeeToEdit}
      />
    </div>
  );
};

export default ManagerEmployeesPage;