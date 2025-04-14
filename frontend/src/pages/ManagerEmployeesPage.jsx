import React, { useEffect, useState } from "react";

const ManagerEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/employees`);
        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }
        const data = await response.json();

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-center">Employee Management</h1>

      <div className="mb-4 flex items-center gap-4">
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
            <th className="border border-gray-300 px-4 py-2 text-center">Manager</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Password</th>
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
              <td className="border border-gray-300 px-4 py-2 text-center">{employee.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerEmployeesPage;