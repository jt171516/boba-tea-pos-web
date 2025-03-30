import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import CustomerPage from './pages/CustomerPage';
import Navbar from './components/Navbar'; // Added import

function App() {
  return (
    <div className="min-h-screen">
      <Navbar /> {/* Added Navbar */}
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customer" element={<CustomerPage />} />
      </Routes>
    </div>
  );
}

export default App;
