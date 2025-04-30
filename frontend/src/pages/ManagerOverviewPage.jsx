import React, { useEffect, useState } from "react";

const ManagerOverviewPage = () => {
  const [weeklySales, setWeeklySales] = useState(0);
  const [weeklyOrders, setWeeklyOrders] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [lowInventoryItems, setLowInventoryItems] = useState([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        // Fetch total sales and orders for the last 7 days
        const salesResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/orders`);
        if (!salesResponse.ok) throw new Error("Failed to fetch sales data");
        const salesData = await salesResponse.json();

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklySalesData = salesData.filter(
          (order) => new Date(order.timestamp) >= oneWeekAgo
        );

        const totalWeeklySales = weeklySalesData.reduce(
          (sum, order) => sum + (order.totalprice || 0),
          0
        );

        setWeeklySales(totalWeeklySales);
        setWeeklyOrders(weeklySalesData.length);

        // Fetch total employees
        const employeesResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/employees`);
        if (!employeesResponse.ok) throw new Error("Failed to fetch employees data");
        const employeesData = await employeesResponse.json();
        setTotalEmployees(employeesData.length);

        // Fetch low inventory items
        const inventoryResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/inventory`);
        if (!inventoryResponse.ok) throw new Error("Failed to fetch inventory data");
        const inventoryData = await inventoryResponse.json();
        const lowStockItems = inventoryData.filter((item) => item.qty < 10); // Items with quantity < 10
        setLowInventoryItems(lowStockItems);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };

    fetchOverviewData();
  }, []);

  return (
    <div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-black">Weekly Sales</h2>
          <p className="text-2xl font-semibold text-black">${weeklySales.toFixed(2)}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-black">Weekly Orders</h2>
          <p className="text-2xl font-semibold text-black">{weeklyOrders}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-black">Total Employees</h2>
          <p className="text-2xl font-semibold text-black">{totalEmployees}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-black">Low Inventory Items</h2>
          <p className="text-2xl font-semibold text-black">{lowInventoryItems.length}</p>
        </div>
      </div>

      {/* Low Inventory Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Low Inventory Items</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-center">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {lowInventoryItems.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerOverviewPage;