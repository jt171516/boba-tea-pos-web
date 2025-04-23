import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import TopBar from '../components/TopBar';
import SideMenu from '../components/SideMenu';
import ItemPopUp from '../components/ItemPopUp';
import { Toaster } from 'react-hot-toast';

// Format the category names
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
  const [currentOrderId, setCurrentOrderId] = useState(null); 
  const [sum, setSum] = useState(0);
  const navigate = useNavigate(); //useNavigate hook to navigate to the payment page
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  // Fetch items from database
  useEffect(() => {
    const initializePage = async () => {
      try {
        const fetchItems = async () => {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/item`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
    
            // Sort items by ID
            const sortedData = data.sort((a, b) => a.id - b.id);
            setItems(sortedData);
        };
    
        await fetchItems();

        //Check to see if there is an open order, if not a create a new one
        const fetchOpenOrder = async () => {
          const response = await fetch (`${import.meta.env.VITE_APP_API_URL}/orders/open`);
          if (response.ok){
            const data = await response.json();
            setCurrentOrderId(data.id); //Use the exisitng open order
            console.log("Open Order ID:", data.id);
          } else {
            //No open order, create a new one
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}/createOrder`, {
              method: "POST",
              headers: {"Content-Type": "application/json"},
            });
            const createData = await response.json();
            setCurrentOrderId(createData.orderId); // Set the new order ID
          }
        };

      await fetchOpenOrder();
      } catch (error) {
        console.error('Error fetching or creating order:', error);
      }
    };

    initializePage();

  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript); // For example, setSearchQuery(transcript) or parse items to order
      };
    }
  }, []);

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setListening(!listening);
  };

  // Filter items based on category and search
  const filteredItems = items.filter((item) => {
    const inCategory = !category || category === 'all-drinks' || item.category.toLowerCase() === category.toLowerCase();
    const inSearchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return inCategory && inSearchQuery;
  });

  const updateSum = (itemPrice) => {
    setSum((prevSum) => prevSum + itemPrice);
  };

  //function to handle when an ItemCard is clicked
  const handleItemClick = (item) => {
    setSelectedItem(item); //set the selected item
    setIsPopUpOpen(true); //open the pop-up
  };

  const handleSubmitOrder = async () => {
    try {
      await fetch(`${import.meta.env.VITE_APP_API_URL}/orders/${currentOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalprice: sum,
          payment: "Pending",
          is_closed: true,
        }),
      });

     navigate(`/payment/${currentOrderId}`);

    } catch (error) {
      console.error('Error submitting order:', error);
      alert(`Failed to submit order: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar />
      <Toaster />
      <div className="flex flex-grow">
        <SideMenu />
        <div className="flex flex-col flex-grow bg-base-100 p-4">

          {/* Show current drinks category */}
          <h1 className="text-4xl font-bold mb-6 text-center">
            {category && category.toLowerCase() !== 'all-drinks' ? `${format(category)} Menu` : 'Menu'}
          </h1>

          {/* Search for drinks */}
          <div className="mb-4 mx-4 flex gap-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
            <button onClick={handleVoiceToggle} className="btn">
              {listening ? "Stop Voice Ordering" : "Start Voice Ordering"}
            </button>
          </div>

          {/* Display filtered drinks using ItemCard */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mx-auto">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <button
          className="btn btn-primary px-6 py-2 text-lg font-bold"
          onClick={handleSubmitOrder}
        >
          Submit Order
        </button>
      </div>

      {isPopUpOpen && (
            <ItemPopUp
            isOpen={isPopUpOpen}
            onClose={() => setIsPopUpOpen(false)}
            item={selectedItem}
            currentOrderId = {currentOrderId}
            updateSum = {(itemPrice) => updateSum(itemPrice)}
          />
        )}
    </main>
  );
}

export default CustomerPage;