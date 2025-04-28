import React, {useEffect, useState} from 'react';

const ItemPopUp = ({ isOpen, onClose, item, currentOrderId, updateSum}) => {
    useEffect(() => {
        if (isOpen) {
            //add the no-scroll class to the body when the popup is open
            document.body.classList.add('no-scroll');
        }
        else {
            //remove the no-scroll class from the body when the popup is closed
            document.body.classList.remove('no-scroll');
        }
        return () => {
            //cleanup function to ensure the class is removed when the component unmounts
            document.body.classList.remove('no-scroll'); 
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const topping = [
        { name: "Boba", image: "https://images.squarespace-cdn.com/content/v1/61e8bb2a2cf8670534839093/feb1a05c-547e-42a8-b293-2cda95c33050/Topping_Pearls+%28Boba%29.png?format=500w" },
        { name: "Crystal Boba", image: "https://images.squarespace-cdn.com/content/v1/61e8bb2a2cf8670534839093/b4e31e7b-4ca6-4915-8184-548f6a0cb93e/Topping_LycheeJelly.png?format=500w" },
        { name: "Honey Jelly", image: "https://images.squarespace-cdn.com/content/v1/61e8bb2a2cf8670534839093/1e91bb32-9e6d-4e00-a7cf-28eaae4bee93/Topping_HoneyJelly.png?format=500w" },
        { name: "Lychee Jelly", image: "https://images.squarespace-cdn.com/content/v1/61e8bb2a2cf8670534839093/b4e31e7b-4ca6-4915-8184-548f6a0cb93e/Topping_LycheeJelly.png?format=500w" },
        { name: "Pudding", image: "https://images.squarespace-cdn.com/content/v1/61e8bb2a2cf8670534839093/a8a501b1-7e95-40cf-9917-bb352a6da13d/Topping_Pudding.png?format=500w" },
        { name: "Mango Popping Boba", image: "https://images.squarespace-cdn.com/content/v1/61e8bb2a2cf8670534839093/8da7f0f0-1587-47f9-a573-46f997b2883f/Topping_MangoPoppingBoba.png?format=500w" },
        { name: "Creama", image: "https://images.squarespace-cdn.com/content/v1/61e8bb2a2cf8670534839093/c9746d52-a8ab-4ecb-9c62-46c4e7d45b34/Topping_Creama.png?format=500w" },
        { name: "Coffee Jelly", image: "https://images.squarespace-cdn.com/content/v1/61e8bb2a2cf8670534839093/e8308489-ff59-4351-95fb-06c01d0a1b38/Topping_CoffeeJelly.png?format=500w" },
        { name: "Ice Cream", image: "https://images.squarespace-cdn.com/content/v1/61e8bb2a2cf8670534839093/ee270494-a5e6-4080-96ae-3e21cccfa0d6/Topping_IceCream.png?format=500w" },
    ];

    //state to keep track of selected toppings
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedIce, setSelectedIce] = useState('');
    const [selectedSugar, setSelectedSugar] = useState('');
    const [selectedToppings, setSelectedToppings] = useState([]);

    //handle topping selection
    const handleToppingClick = (toppingName) => {
        if (selectedToppings.includes(toppingName)) {
            setSelectedToppings(selectedToppings.filter((t) => t !== toppingName));
        }else{
            setSelectedToppings([...selectedToppings, toppingName]);
        }
    }

    const handleAddToOrder = async () => {
        try {
            if (!selectedSize || !selectedIce || !selectedSugar) {
                alert('Please make sure size, ice level, and sugar level are all selected.');
                return;
            }
            // Preprocess ice and sugar levels to remove the '%' symbol and convert to integers
            const processedSize = selectedSize == 'Small' ? 'S':
                                  selectedSize == 'Medium' ? 'M' :
                                  selectedSize == 'Large' ? 'L' : '';

            const processedIce = parseInt(selectedIce.replace('%', ''), 10);
            const processedSugar = parseInt(selectedSugar.replace('%', ''), 10);

            // Get the item id by item name
            const itemResponse = await fetch (`${import.meta.env.VITE_APP_API_URL}/item/${item.name}`);
            if (!itemResponse.ok) {
                throw new Error('Failed to fetch item ID');
            }
            const itemData = await itemResponse.json();

            console.log('Item name:', item.name);
            //Add the orderid and itemid to the ordersitemjunction
            const orderItemResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/orderItemId`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    orderId: currentOrderId,
                    itemId: itemData.id,
                    itemName: item.name,
                }),
            });
            if (!orderItemResponse.ok) {
                throw new Error('Failed to create orderItemId');
            }
            const {orderItemId} = await orderItemResponse.json();
            
            // Get the modifiers
            const modifiersResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/modifiers`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    size: processedSize,
                    sugar: processedSugar,
                    ice: processedIce,
                    toppings: selectedToppings,
                }),
            });

            if (!modifiersResponse.ok) {
                throw new Error('Failed to fetch modifiers');
            }
            const modifiersData = await modifiersResponse.json();

            console.log('Modifiers Data:', modifiersData);

            console.log('Payload for /api/ordersitemmodifierjunction:', {
                orderItemId,
                modifiers_id: modifiersData.map((modifier) => modifier.id),
            });

            updateSum(itemData.price);

            // Insert into ordersitemmodifierjunction table
            await fetch(`${import.meta.env.VITE_APP_API_URL}/ordersitemmodifierjunction`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    orderItemId,
                    modifiers: modifiersData.map(modifier => modifier.id),
                }),
            });

            alert(`Item added successfully to order!`);

            onClose();
        }catch (error) {
            console.error('Error adding order:', error);
            alert(`Failed to add order: ${error.message}`);
        }
}

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-base-100 rounded-lg shadow-lg w-auto h-5/6 p-6 m-6 relative overflow-y-scroll ml-64">
                <div className="flex items-start space-x-4">
                    <img
                        src={item?.image || "https://s3-media0.fl.yelpcdn.com/bphoto/GBAD5WodnuFXpi3Q3CnQGw/348s.jpg"}
                        alt={item?.name || "Item Name"}
                        className="w-40 h-40 object-cover rounded"
                    />
                    <div>
                        <h2 className="text-xl font-bold">{item?.name || "Item Name"}</h2>
                        <p>
                            {item?.price ? `$${item.price}` : "Price not available"} | {item?.calories ? `${item.calories} calories` : "Calories not available"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                        {item.vegetarian && (<span className="badge badge-success">{item.vegetarian}</span>)}
                        {item.allergen && item.allergen.map((allergen, index) => (
                            <span key={index} className="badge badge-warning">{allergen}</span>
                        ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        className="absolute top-4 right-4 btn btn-primary"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

                <div className="mt-6 flex justify-start">
                    <button 
                        className="btn btn-primary px-6 py-2 text-lg font-bold"
                        onClick={() => handleAddToOrder()}
                    >
                        Add to Order
                    </button>
                </div>

                <div className="flex justify-between mt-4 space-x-8">
                    <div className="sizes">
                        <h3 className="text-lg font-bold mb-2">Size:</h3>
                        <input className="join-item btn m-1" type="radio" name="size"  value="Small" onChange={(e) => setSelectedSize(e.target.value)} aria-label="Small" />
                        <input className="join-item btn m-1" type="radio" name="size"  value="Medium" onChange={(e) => setSelectedSize(e.target.value)} aria-label="Medium" />
                        <input className="join-item btn m-1" type="radio" name="size"  value="Large" onChange={(e) => setSelectedSize(e.target.value)} aria-label="Large" />
                    </div>

                    <div className="ice level">
                        <h3 className="text-lg font-bold mb-2">Ice Level:</h3>
                        <input className="join-item btn m-1" type="radio" name="ice"  value="0%" onChange={(e) => setSelectedIce(e.target.value)} aria-label="0%" />
                        <input className="join-item btn m-1" type="radio" name="ice"  value="25%" onChange={(e) => setSelectedIce(e.target.value)} aria-label="25%" />
                        <input className="join-item btn m-1" type="radio" name="ice"  value="50%" onChange={(e) => setSelectedIce(e.target.value)} aria-label="50%" />
                        <input className="join-item btn m-1" type="radio" name="ice"  value="75%" onChange={(e) => setSelectedIce(e.target.value)} aria-label="75%" />
                        <input className="join-item btn m-1" type="radio" name="ice"  value="100%" onChange={(e) => setSelectedIce(e.target.value)} aria-label="100%" />
                    </div>

                    <div className="sugar level"></div>
                    <div className="sugar level">
                        <h3 className="text-lg font-bold mb-2">Sugar Level:</h3>
                        <input className="join-item btn m-1" type="radio" name="sugar" value="0%" onChange={(e) => setSelectedSugar(e.target.value)} aria-label="0%" />
                        <input className="join-item btn m-1" type="radio" name="sugar" value="25%" onChange={(e) => setSelectedSugar(e.target.value)} aria-label="25%" />
                        <input className="join-item btn m-1" type="radio" name="sugar" value="50%" onChange={(e) => setSelectedSugar(e.target.value)} aria-label="50%" />
                        <input className="join-item btn m-1" type="radio" name="sugar" value="75%" onChange={(e) => setSelectedSugar(e.target.value)} aria-label="75%" />
                        <input className="join-item btn m-1" type="radio" name="sugar" value="100%" onChange={(e) => setSelectedSugar(e.target.value)} aria-label="100%" />
                    </div>
                </div>

                <div className = "mt-6">
                    <h3 className = "text-lg font-bold mb-2">Toppings:</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {topping.map((topping) => (
                            <div
                                key={topping.name}
                                className="relative cursor-pointer border rounded-lg p-2 flex flex-col items-center" 
                                onClick={() => handleToppingClick(topping.name)}
                            >
                                <img 
                                    src={topping.image} 
                                    alt={topping.name} 
                                    className="w-full h-[200px] object-cover rounded" 
                                />

                                {selectedToppings.includes(topping.name) && (
                                    <div className = "absolute inset-0 bg-white bg-opacity-50 rounded"></div>
                                )}

                                <p className="text-sm mt-2">{topping.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemPopUp;