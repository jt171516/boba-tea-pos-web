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
  const [inventoryItems, setInventoryItems] = useState([]); // State for inventory items
  const [selectedItem, setSelectedItem] = useState(null); // State for the selected item
  const [inventoryUsageData, setInventoryUsageData] = useState([]); // State for inventory usage data
  const [showInventoryUsageReport, setShowInventoryUsageReport] = useState(false); // State to toggle the report visibility

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

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/inventory-usage`);
        if (!response.ok) throw new Error("Failed to fetch inventory items");
        const data = await response.json();
        setInventoryItems(data);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };

    fetchInventoryItems();
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

  const handleXReport = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/x-report`);
      if (!response.ok) throw new Error("Failed to fetch X Report");
      const data = await response.json();

      // Construct the row-like string
      let report = "X Report:\n\n";
      data.forEach((row) => {
        report += `Hour: ${row.hour}\n`;
        report += `Total Orders: ${row.total_orders}\n`;
        report += `Sales: $${parseFloat(row.total_sales).toFixed(2)}\n`;
        report += `Returns: $${parseFloat(row.total_returns).toFixed(2)}\n`;
        report += `Total Items: ${row.total_items}\n`;
        report += `Cash Payments: ${row.cash_payments}\n`;
        report += `Card Payments: ${row.card_payments}\n`;
        report += `-----------------------------\n`;
      });

      // Display the report in a browser pop-up
      alert(report);
    } catch (error) {
      console.error("Error fetching X Report:", error);
      alert("Failed to fetch X Report");
    }
  };

  const handleZReport = async () => {
    const confirmRun = window.confirm(
      "Are you sure you want to run the Z Report? This will reset daily sales data."
    );

    if (!confirmRun) {
      return; // Exit if the user cancels
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/z-report`);
      if (!response.ok) throw new Error("Failed to fetch Z Report");
      const data = await response.json();

      // Ensure all values are numbers before formatting
      const totalSales = parseFloat(data.total_sales) || 0;
      const cashTotal = parseFloat(data.cash_total) || 0;
      const cardTotal = parseFloat(data.card_total) || 0;
      const cashCount = data.cash_count || 0;
      const cardCount = data.card_count || 0;
      const totalItems = data.total_items || 0;

      // Construct the row-like string
      let report = "Z Report:\n\n";
      report += `Total Sales: $${totalSales.toFixed(2)}\n`;
      report += `Cash Sales: $${cashTotal.toFixed(2)}\n`;
      report += `Cash Transactions: ${cashCount}\n`;
      report += `Card Sales: $${cardTotal.toFixed(2)}\n`;
      report += `Card Transactions: ${cardCount}\n`;
      report += `Total Items: ${totalItems}\n`;

      // Display the report in a browser pop-up
      alert(report);
    } catch (error) {
      console.error("Error fetching Z Report:", error);
      alert("Failed to fetch Z Report");
    }
  };

  const handleGenerateStats = async (itemId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/product-usage/${itemId}`);
      if (!response.ok) throw new Error("Failed to fetch product usage stats");
      const data = await response.json();

      console.log("Product Usage Stats:", data);
      alert("Product Usage Stats fetched successfully. Check the console for details.");
    } catch (error) {
      console.error("Error fetching product usage stats:", error);
      alert("Failed to fetch product usage stats");
    }
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

      {/* Inventory Dropdown */}
      <div className="mb-4">
        <label htmlFor="inventoryDropdown" className="font-medium">
          Select an Inventory Item:
        </label>
        <select
          id="inventoryDropdown"
          value={selectedItem || ""}
          onChange={(e) => setSelectedItem(e.target.value)}
          className="select select-bordered ml-2"
        >
          <option value="">-- Select an Item --</option>
          {inventoryItems.map((item) => (
            <option key={item.inventory_id} value={item.inventory_id}>
              {item.inventory_name} (Qty: {item.quantity})
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (selectedItem) {
              handleGenerateStats(selectedItem);
            } else {
              alert("Please select an inventory item to generate stats.");
            }
          }}
          className="btn btn-accent ml-4"
        >
          Generate Stats
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex gap-4">
        <button onClick={handleXReport} className="btn btn-primary">
          Generate X Report
        </button>
        <button onClick={handleZReport} className="btn btn-secondary">
          Generate Z Report
        </button>
      </div>

      {/* Inventory Usage Report */}
      {showInventoryUsageReport && (
        <div className="inventory-usage-report">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Inventory Usage Report</h2>
            <button
              onClick={() => setShowInventoryUsageReport(false)}
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Inventory Name</th>
                <th className="border border-gray-300 px-4 py-2">Inventory Count</th>
              </tr>
            </thead>
            <tbody>
              {inventoryUsageData.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{item.inventory_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.inventory_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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