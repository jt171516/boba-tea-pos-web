import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import TopBar from '../components/TopBar';
import SideMenu from '../components/SideMenu';
import ItemPopUp from '../components/ItemPopUp';
import { Toaster } from 'react-hot-toast';

function format(str) {
  if (!str) return '';
  return str.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function CustomerPage() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { category } = useParams();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); //state to keep track of the selected item

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/item`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const sortedData = data.sort((a, b) => a.id - b.id);
        setItems(sortedData);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const inCategory = !category || category === 'all-drinks' || item.category.toLowerCase() === category.toLowerCase();
    const inSearchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return inCategory && inSearchQuery;
  });

  //function to handle when an ItemCard is clicked
  const handleItemClick = (item) => {
    setSelectedItem(item); //set the selected item
    setIsPopUpOpen(true); //open the pop-up
  };

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar />
      <Toaster />
      <div className="flex flex-grow">
        <SideMenu />
        <div className="flex flex-col flex-grow bg-base-100 p-4">
          <h1 className="text-4xl font-bold mb-6 text-center">
            {category && category.toLowerCase() !== 'all-drinks' ? `${format(category)} Menu` : 'Menu'}
          </h1>
          <div className="mb-4 mx-4">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mx-auto">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item)}/>
            ))}
          </div>
        </div>
      </div>
      {selectedItem && (
            <ItemPopUp
            isOpen={isPopUpOpen}
            onClose={() => setIsPopUpOpen(false)}
            item={selectedItem}
          />
        )}
    </main>
  );
}

export default CustomerPage;