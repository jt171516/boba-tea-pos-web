import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage';
import FoodMenu from './pages/FoodMenu';
import CustomerPage from './pages/CustomerPage';
import PaymentPage from './pages/PaymentPage';

import ManagerPage from './pages/ManagerPage';
import ManagerMenuPage from "./pages/ManagerMenuPage"
import ManagerSalesPage from "./pages/ManagerSalesPage";
import ManagerInventoryPage from "./pages/ManagerInventoryPage";
import ManagerEmployeesPage from "./pages/ManagerEmployeesPage";

import WorkerPage from './pages/WorkerPage';


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<FoodMenu />} />
        <Route path="/customer/:category?" element={<CustomerPage />} />
        <Route path= "/payment/:orderId" element={<PaymentPage />} />

        <Route path="/manager" element={<ManagerPage />}>
          <Route path="sales" element={<ManagerSalesPage />} />
          <Route path="menu" element={<ManagerMenuPage />}/>
          <Route path="inventory" element={<ManagerInventoryPage />} />
          <Route path="employees" element={<ManagerEmployeesPage />} />
        </Route>

        <Route path="/worker" element={<WorkerPage />} />  
      </Routes>
    </div>
  );
}

export default App;
