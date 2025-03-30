import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FoodMenu from './pages/FoodMenu';
import TopBar from './components/TopBar';
import SideMenu from './components/SideMenu';

function App() {
  return (
    <div className="flex flex-col">
      <TopBar />
      <div className="flex">
        <SideMenu />
        <div className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<FoodMenu />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
export default App;