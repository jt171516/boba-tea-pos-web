import React from "react";

const ItemPopUp = ({ isOpen, onClose, item }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-1/2 h-1/2 p-6 relative">
                <div className = "flex items-start space-x-4">
                    <img
                        src={item?.image || "https://s3-media0.fl.yelpcdn.com/bphoto/GBAD5WodnuFXpi3Q3CnQGw/348s.jpg"}
                        alt={item?.name || "Item Name"}
                        className="w-35 h-35 object-cover rounded"
                    />
                    <div>
                        <h2 className="text-xl font-bold">{item?.name || "Item Name"}</h2>
                        <p className="text-gray-600">
                            {item?.price ? `$${item.price}` : "Price not available"} | {item?.calories ? `${item.calories} calories` : "Calories not available"}
                        </p>
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

                <div className="flex justify-between mt-4 space-x-8">
                    <div className="sizes">
                        <h3 className="text-lg font-bold mb-2">Size:</h3>
                        <input className="join-item btn" type="radio" name="size" aria-label="Small" />
                        <input className="join-item btn" type="radio" name="size" aria-label="Medium" />
                        <input className="join-item btn" type="radio" name="size" aria-label="Large" />

                    </div>

                    <div className="ice level">
                        <h3 className="text-lg font-bold mb-2">Ice Level:</h3>
                        <input className="join-item btn" type="radio" name="ice" aria-label="0%" />
                        <input className="join-item btn" type="radio" name="ice" aria-label="25%" />
                        <input className="join-item btn" type="radio" name="ice" aria-label="50%" />
                        <input className="join-item btn" type="radio" name="ice" aria-label="75%" />
                        <input className="join-item btn" type="radio" name="ice" aria-label="100%" />

                    </div>

                    <div className="sugar level">
                        <h3 className="text-lg font-bold mb-2">Sugar Level:</h3>
                        <input className="join-item btn" type="radio" name="sugar" aria-label="0%" />
                        <input className="join-item btn" type="radio" name="sugar" aria-label="25%" />
                        <input className="join-item btn" type="radio" name="sugar" aria-label="50%" />
                        <input className="join-item btn" type="radio" name="sugar" aria-label="75%" />
                        <input className="join-item btn" type="radio" name="sugar" aria-label="100%" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemPopUp;