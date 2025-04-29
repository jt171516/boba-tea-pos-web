import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, CupSoda, GlassWater, Citrus, List } from 'lucide-react';


function SideMenu() 
{
  const categories = [
    {
        name: 'All Drinks', icon: <List size={20} />
    },
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
    <nav className="bg-gray-900 text-gray-200 h-[calc(100vh-2.5rem)] w-56 p-4 sticky top-10">
      <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">
        Drink Categories
      </h2>
      <ul className="flex flex-col gap-3">
        {categories.map(cat => (
          <li key={cat.name}>
            <Link
              to={`/customer/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
              tabIndex={0}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
              onFocus={() => speak(cat.name)}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SideMenu;
