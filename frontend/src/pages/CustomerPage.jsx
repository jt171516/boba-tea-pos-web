import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';

function CustomerPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/item');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <main className="flex flex-col bg-base-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Menu</h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mx-auto">
        {items.map((item) => (
          <ItemCard key={item.id} item={item}/>
        ))}
      </div>
    </main>
  );
}

export default CustomerPage;
