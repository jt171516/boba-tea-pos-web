import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, CupSoda, GlassWater, Citrus } from 'lucide-react';

function SideMenu() 
{
  const categories = [
    { 
        name: 'Milk Tea', icon: <Coffee size={20} /> 
    },
    { 
        name: 'Brewed Tea', icon: <GlassWater size={20} /> 
    },
    { 
        name: 'Fruit Tea', icon: <Citrus size={20} /> 
    },
    { 
        name: 'Boba Tea', icon: <CupSoda size={20} /> 
    },
  ];

  return (
    <div className="bg-gray-900 text-gray-200 h-screen w-56 shadow-lg flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">Drink Categories</h2>
      <nav className="flex flex-col gap-3">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/menu/${category.name.toLowerCase()}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
          >
            {category.icon}
            <span>{category.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default SideMenu;
