import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage';
import FoodMenu from './pages/FoodMenu';
import CustomerPage from './pages/CustomerPage';
import ManagerPage from './pages/ManagerPage';
import WorkerPage from './pages/WorkerPage';
import SalesPage from "./pages/SalesPage";
import InventoryPage from "./pages/InventoryPage";
import EmployeesPage from "./pages/EmployeesPage";


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<FoodMenu />} />
        <Route path="/customer/:category?" element={<CustomerPage />} />

        <Route path="/manager" element={<ManagerPage />}>
          <Route path="sales" element={<SalesPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="employees" element={<EmployeesPage />} />
        </Route>

        <Route path="/worker" element={<WorkerPage />} />  
      </Routes>
    </div>
  );
}

export default App;
