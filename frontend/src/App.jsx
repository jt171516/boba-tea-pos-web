import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage';
import FoodMenu from './pages/FoodMenu';
import CustomerPage from './pages/CustomerPage';
import ManagerPage from './pages/ManagerPage'; // <-- new
import WorkerPage from './pages/WorkerPage';   // <-- new

import TopBar from './components/TopBar';
import SideMenu from './components/SideMenu';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <TopBar />
      <Toaster />
      <div className="flex flex-grow">
        <SideMenu />
        <div className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<FoodMenu />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/manager" element={<ManagerPage />} /> 
            <Route path="/worker" element={<WorkerPage />} />  
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
