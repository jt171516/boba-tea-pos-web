import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import FoodMenu from './pages/FoodMenu';
import CustomerPage from './pages/CustomerPage';
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
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
