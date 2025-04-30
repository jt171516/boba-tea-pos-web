import React, { useEffect, useState } from "react";

const ManagerSalesPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [filterType, setFilterType] = useState("lastDay");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState(100);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/orders`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders data");
        }
        const data = await response.json();
        setSalesData(data);
        setFilteredSales(data);
      } catch (error) {
        console.error("Error fetching orders data:", error);
      }
    };

    fetchSalesData();
  }, []);

  const filterSales = () => {
    const now = new Date();
    let filtered = [];

    if (filterType === "lastDay") {
      const oneDayAgo = new Date(now);
      oneDayAgo.setDate(now.getDate() - 1);
      filtered = salesData.filter((sale) => new Date(sale.timestamp) >= oneDayAgo);
    } else if (filterType === "lastWeek") {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      filtered = salesData.filter((sale) => new Date(sale.timestamp) >= oneWeekAgo);
    } else if (filterType === "lastMonth") {
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      filtered = salesData.filter((sale) => new Date(sale.timestamp) >= oneMonthAgo);
    } else if (filterType === "custom") {
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      filtered = salesData.filter(
        (sale) => new Date(sale.timestamp) >= startDate && new Date(sale.timestamp) <= endDate
      );
    } else if (filterType === "allTime") {
      filtered = salesData;
    }

    setFilteredSales(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterSales();
  }, [filterType, customStartDate, customEndDate, salesData]);

  const sortSales = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...filteredSales].sort((a, b) => {
      if (field === "timestamp") {
        return order === "asc"
          ? new Date(a[field]) - new Date(b[field])
          : new Date(b[field]) - new Date(a[field]);
      } else {
        return order === "asc" ? a[field] - b[field] : b[field] - a[field];
      }
    });

    setFilteredSales(sorted);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handlers for new buttons
  const handleXReport = () => {
    console.log("Generating X Report...");
    alert("Filler");
    // Add logic to generate and download the X Report
  };

  const handleZReport = () => {
    console.log("Generating Z Report...");
    alert("Filler");
    // Add logic to generate and download the Z Report
  };

  const handleGenerateProductUsageChart = () => {
    console.log("Generating Product Usage Chart...");
    alert("Filler");
    // Add logic to generate and display the product usage chart
  };

  return (
    <div>
      {/* Filter Options */}
      <div className="mb-4 flex flex-wrap gap-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="select select-bordered"
        >
          <option value="lastDay">Last Day</option>
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="allTime">All Time</option>
          <option value="custom">Custom Range</option>
        </select>

        {filterType === "custom" && (
          <div className="flex gap-4">
            <input
              type="datetime-local"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="input input-bordered"
            />
            <input
              type="datetime-local"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="input input-bordered"
            />
          </div>
        )}

        {/* Orders Per Page */}
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="font-medium">
            Orders Per Page:
          </label>
          <input
            id="itemsPerPage"
            type="number"
            min="1"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="input input-bordered w-20"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex gap-4">
        <button onClick={handleXReport} className="btn btn-primary">
          Generate X Report
        </button>
        <button onClick={handleZReport} className="btn btn-secondary">
          Generate Z Report
        </button>
        <button onClick={handleGenerateProductUsageChart} className="btn btn-accent">
          Generate Product Usage Chart
        </button>
      </div>

      {/* Sales Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th
              className="border border-gray-300 px-4 py-2 text-center cursor-pointer"
              onClick={() => sortSales("id")}
            >
              Order ID {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">Order Contents</th>
            <th
              className="border border-gray-300 px-4 py-2 text-center cursor-pointer"
              onClick={() => sortSales("totalprice")}
            >
              Total Price {sortField === "totalprice" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">Payment Method</th>
            <th
              className="border border-gray-300 px-4 py-2 text-center cursor-pointer"
              onClick={() => sortSales("timestamp")}
            >
              Timestamp {sortField === "timestamp" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">Is Closed</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSales.map((sale) => (
            <tr key={sale.id}>
              <td className="border border-gray-300 px-4 py-2 text-center">{sale.id}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{sale.name || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">${sale.totalprice ? sale.totalprice.toFixed(2) : "0.00"}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{sale.payment || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {sale.timestamp ? new Date(sale.timestamp).toLocaleString() : "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {sale.is_closed ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="btn btn-secondary"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="btn btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManagerSalesPage;