import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FoodMenu from './pages/FoodMenu';

function App() {
  return (
    <div>
      <h1 className="text-red-500">hi</h1>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<FoodMenu />} />
      </Routes>
    </div>
  );
}
export default App;