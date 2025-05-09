import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import TopBar from '../components/TopBar';
import SideMenu from '../components/SideMenu';
import ItemPopUp from '../components/ItemPopUp';
import toast, { Toaster } from 'react-hot-toast'; 
import OrderSummaryPanel from '../components/OrderSummaryPanel';
import {  ShoppingCart } from 'lucide-react';


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
  const [orderSummary, setOrderSummary] = useState([]); //state to keep track of the order summary
  const [isSummaryOpen, setIsSummaryOpen] = useState(false); //state to keep track of the order summary pop-up
  const navigate = useNavigate(); //useNavigate hook to navigate to the payment page
  const location = useLocation(); //useLocation hook to get the current location
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [fullTranscript, setFullTranscript] = useState(''); 

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
      recognitionRef.current.continuous = true; // Keep true
      recognitionRef.current.interimResults = true; // Set true for frequent updates
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setFullTranscript(prev => prev + finalTranscript);

        if (interimTranscript) {
            console.log("Interim:", interimTranscript);
        }
        if (finalTranscript) {
            console.log("Final segment:", finalTranscript);
            toast(`Heard: ${finalTranscript}`); 
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== 'no-speech' && event.error !== 'audio-capture') { 
             toast.error(`Speech error: ${event.error}`);
             setListening(false);
        } else {
            console.log(`Non-critical speech error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended.");
        if (listening) {
          console.log("Attempting restart after unexpected end...");
          try {
            setTimeout(() => {
                if (listening && recognitionRef.current) { 
                    recognitionRef.current.start();
                    console.log("Restarted listening.");
                }
            }, 250); // 250ms delay
          } catch (error) {
            console.error("Could not restart voice recognition:", error);
            toast.error("Could not automatically restart listening.");
            setListening(false);
          }
        } else {
            console.log("Not restarting, listening was set to false.");
        }
      };

    } else {
      console.warn("Web Speech API is not supported in this browser.");
    }

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, []); 

  // Function to handle adding item via API
  const addItemToOrderAPI = async (itemToAdd, size, ice, sugar, toppings) => {
    try {
        if (!size || !ice || !sugar) {
            toast.error('Please ensure size, ice, and sugar levels are specified.');
            return false; // Indicate failure
        }
        // Preprocess customizations
        const processedSize = size === 'Small' ? 'S' : size === 'Medium' ? 'M' : 'L';
        const processedIce = parseInt(ice.replace('%', ''), 10);
        const processedSugar = parseInt(sugar.replace('%', ''), 10);

        // Fetch item ID (assuming itemToAdd has name property)
        const itemResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/item/${itemToAdd.name}`);
        if (!itemResponse.ok) throw new Error('Failed to fetch item details');
        const itemData = await itemResponse.json(); // Contains id, price etc.

        // Create entry in ordersitemjunction
        const orderItemResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/orderItemId`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                orderId: currentOrderId,
                itemId: itemData.id,
                itemName: itemData.name,
            }),
        });
        if (!orderItemResponse.ok) throw new Error('Failed to create order item link');
        const { orderItemId } = await orderItemResponse.json();

        // Get modifier IDs
        const modifiersResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/modifiers`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                size: processedSize,
                sugar: processedSugar,
                ice: processedIce,
                toppings: toppings,
            }),
        });
        if (!modifiersResponse.ok) throw new Error('Failed to fetch modifiers');
        const modifiersData = await modifiersResponse.json();

        // Link modifiers to the order item
        await fetch(`${import.meta.env.VITE_APP_API_URL}/ordersitemmodifierjunction`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                orderItemId,
                modifiers: modifiersData.map(modifier => modifier.id),
            }),
        });

        // Update local state
        updateSum(itemData.price); // Use price from fetched itemData
        updateOrderSummary(itemData, toppings);

        toast.success(`${itemData.name} added to order!`);
        return true; // Indicate success

    } catch (error) {
        console.error('Error adding item to order:', error);
        toast.error(`Failed to add item: ${error.message}`);
        return false; // Indicate failure
    }
  };


  const processFullTranscript = async (transcript) => { // Make async
      console.log("Processing full transcript:", transcript);
      if (!transcript) {
          toast.error("No command recorded.");
          return;
      }

      const lowerTranscript = transcript.toLowerCase();
      let matchedItem = null;
      let requestedSize = null;
      let requestedIce = null;
      let requestedSugar = null;
      let requestedToppings = [];
      let addToCartCommand = false; // Flag for add to cart command

      if (lowerTranscript.includes("submit order") || lowerTranscript.includes("finish order") || lowerTranscript.includes("checkout")) {
          toast.success("Submitting order...");
          handleSubmitOrder();
          return;
      }

      // Check for "add to cart" command
      if (lowerTranscript.includes("add to cart") || lowerTranscript.includes("add to order")) {
          addToCartCommand = true;
      }

      const sortedItems = [...items].sort((a, b) => b.name.length - a.name.length);
      matchedItem = sortedItems.find(item => lowerTranscript.includes(item.name.toLowerCase()));

      if (matchedItem) {
         // --- Extract Size, Ice, Sugar ---
         if (lowerTranscript.includes("large")) requestedSize = "Large";
         else if (lowerTranscript.includes("medium")) requestedSize = "Medium";
         else if (lowerTranscript.includes("small")) requestedSize = "Small";
         else requestedSize = "Large"; // Default size

         const iceMatch = lowerTranscript.match(/(?:(\d{1,3})\s*%?\s*ice)|(no ice)|(less ice)|(half ice)|(light ice)|(normal ice)|(regular ice)/);
         if (iceMatch) {
           if (iceMatch[1]) {
             const percent = parseInt(iceMatch[1], 10);
             if (percent === 0) requestedIce = "0%";
             else if (percent <= 25) requestedIce = "25%";
             else if (percent <= 50) requestedIce = "50%";
             else if (percent <= 75) requestedIce = "75%";
             else requestedIce = "100%";
           }
           else if (iceMatch[2]) { requestedIce = "0%"; }
           else if (iceMatch[3]) { requestedIce = "75%"; }
           else if (iceMatch[4]) { requestedIce = "50%"; }
           else if (iceMatch[5]) { requestedIce = "25%"; }
           else requestedIce = "100%";
         } else {
             requestedIce = "100%"; // Default ice
         }

         const sugarMatch = lowerTranscript.match(/(?:(\d{1,3})\s*%?\s*sugar)|(no sugar)|(less sugar)|(half sugar)|(light sugar)|(regular sugar)|(normal sugar)/);
          if (sugarMatch) {
           if (sugarMatch[1]) {
             const percent = parseInt(sugarMatch[1], 10);
             if (percent === 0) requestedSugar = "0%";
             else if (percent <= 25) requestedSugar = "25%";
             else if (percent <= 50) requestedSugar = "50%";
             else if (percent <= 75) requestedSugar = "75%";
             else requestedSugar = "100%";
           }
           else if (sugarMatch[2]) { requestedSugar = "0%"; }
           else if (sugarMatch[5]) { requestedSugar = "25%"; }
           else if (sugarMatch[4]) { requestedSugar = "50%"; }
           else if (sugarMatch[3]) { requestedSugar = "75%"; }
           else requestedSugar = "100%";
         } else {
             requestedSugar = "100%"; // Default sugar
         }

         // --- Extract Toppings ---
         const availableToppings = ["boba", "crystal boba", "honey jelly", "lychee jelly", "pudding", "mango popping boba", "creama", "coffee jelly", "ice cream"];
         const sortedToppings = [...availableToppings].sort((a, b) => b.length - a.length);
         let tempTranscript = lowerTranscript;

         sortedToppings.forEach(topping => {
             // ... (existing topping extraction logic remains the same) ...
             const toppingRegex = new RegExp(`\\b${topping}\\b`, 'i');
             if (topping === "creama") {
                  const cremaVariations = ["creama", "crema", "cream"];
                  for (const variation of cremaVariations) {
                     const variationRegex = new RegExp(`\\b${variation}\\b`, 'i');
                     if (tempTranscript.match(variationRegex)) {
                         const properToppingName = "Creama";
                         if (!requestedToppings.includes(properToppingName)) {
                             requestedToppings.push(properToppingName);
                         }
                         tempTranscript = tempTranscript.replace(variationRegex, '');
                         break;
                     }
                  }
             } else if (tempTranscript.match(toppingRegex)) {
                   const properToppingName = topping.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                   if (!requestedToppings.includes(properToppingName)) {
                       requestedToppings.push(properToppingName);
                   }
                    tempTranscript = tempTranscript.replace(toppingRegex, '');
               }
           });

        // --- Decide Action: Add to Cart or Open Popup ---
        if (addToCartCommand) {
            toast.success(`Adding ${matchedItem.name} to cart via voice...`);
            await addItemToOrderAPI(matchedItem, requestedSize, requestedIce, requestedSugar, requestedToppings);
        } else {
            toast.success(`Processing ${matchedItem.name}... Opening details.`);
            handleItemClick(matchedItem, {
                size: requestedSize,
                ice: requestedIce,
                sugar: requestedSugar,
                toppings: requestedToppings
            });
        }
      } else if (addToCartCommand) {
          toast.error("Please specify an item to add to the cart.");
      }
       else {
        toast.error("Sorry, I couldn't recognize a valid item or command in your request.");
      }
  };

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
        toast.error("Voice recognition not supported or initialized.");
        return;
    }
    if (listening) {
      recognitionRef.current.stop(); 
      setListening(false);
      toast("Voice ordering stopped. Processing command...");
      processFullTranscript(fullTranscript);
      setFullTranscript(''); 

    } else {
      setFullTranscript(''); 
      try {
        recognitionRef.current.start();
        setListening(true);
        toast.success("Listening for order...");
      } catch (error) {
          console.error("Could not start voice recognition:", error);
          toast.error("Could not start listening.");
          setListening(false);
      }
    }
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

  const updateOrderSummary = (item, toppings, orderItemId) => {
    setOrderSummary((prevSummary) => [
      ...prevSummary,
      { ...item, toppings, orderItemId},
    ]);

  };

  const handleItemClick = (item, customizations = null) => {
    setSelectedItem({ ...item, initialCustomizations: customizations }); 
    setIsPopUpOpen(true);
  };

  const handleSubmitOrder = async () => {
    // Ensure listening stops if order is submitted via voice
    if (listening) {
        recognitionRef.current.stop();
        setListening(false);
        setFullTranscript('');
    }
    try {
      await fetch(`${import.meta.env.VITE_APP_API_URL}/orders/${currentOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalprice: sum,
          payment: "Pending",
          // is_closed: true,
        }),
      });

      navigate(`/payment/${currentOrderId}`, { replace: true, state: {from: location.pathname} });

    } catch (error) {
      console.error('Error submitting order:', error);
      alert(`Failed to submit order: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar />
      <Toaster /> {/* Ensure Toaster is included */}
      <div className="flex flex-grow">
        <SideMenu />
        <div className="flex flex-col flex-grow bg-base-100 p-4">

          {/* Show current drinks category */}
          <h1 className="text-4xl font-bold mb-6 text-center">
            {category && category.toLowerCase() !== 'all-drinks' ? `${format(category)} Menu` : 'Menu'}
          </h1>

          <div className="mb-4 mx-4 flex gap-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              aria-label="Search" 
            />
            <button
                onClick={handleVoiceToggle}
                className={`btn ${listening ? 'btn-error' : 'btn-info'}`} 
                disabled={!('webkitSpeechRecognition' in window)} 
            >
              {listening ? "🛑 Stop Voice" : "🎤 Start Voice"}
            </button>
            <button onClick = {() => setIsSummaryOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200 relative">
              <ShoppingCart className = "w-6 h-6 text-gray-500" aria-label="Cart"/>
              {orderSummary.length > 0 && (
                <span className = "absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {orderSummary.length}
                </span>
              )}
            </button>
          </div>

          {/* Display filtered drinks using ItemCard */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mx-auto">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item) } />
            ))}
          </div>
        </div>
      </div>

      {isPopUpOpen && (
            <ItemPopUp
            isOpen={isPopUpOpen}
            onClose={() => setIsPopUpOpen(false)}
            item={selectedItem} // selectedItem now includes initialCustomizations
            currentOrderId = {currentOrderId}
            updateSum = {(itemPrice) => updateSum(itemPrice)}
            updateOrderSummary = {(item, toppings, orderItemId) => updateOrderSummary(item, toppings, orderItemId)}
            addItemToOrderAPI={addItemToOrderAPI}
          />
        )}

      {isSummaryOpen && (
        <OrderSummaryPanel
        orderSummary={orderSummary}
        totalPrice={sum}
        onClose={() => setIsSummaryOpen(false)}
        handleSubmitOrder = {handleSubmitOrder}
        setOrderSummary = {setOrderSummary}
        setSum = {setSum}
        />
      )}
    </main>
  );
}

export default CustomerPage;