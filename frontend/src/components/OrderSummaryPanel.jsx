import React from 'react';

const OrderSummaryPanel = ({ orderSummary, totalPrice, onClose, handleSubmitOrder}) => {
    return (
        <div className="fixed top-12 right-0 h-auto max-h-[50vh] w-96 bg-base-100 shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <button className="text-red-500 font-bold" onClick={onClose}>
                    Close
                </button>
            </div>
            
            <div className = "overflow-y-auto flex-grow">
                <ul>
                    {orderSummary.map((item, index) => (
                        <li key={index} className="mb-4 border-b pb-2">
                            <div className="flex justify-between">
                                <span className="font-bold">{item.name}</span>
                                <span>${item.price.toFixed(2)}</span>
                            </div>
                            {item.toppings.length > 0 && (
                                <ul className="ml-4 mt-2">
                                    {item.toppings.map((topping, i) => (
                                        <li key={i} className="text-sm text-gray-600">
                                            - {topping}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-4 border-t pt-4">
                <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button
                    className="btn btn-primary w-full py-2 text-lg font-bold"
                    onClick={handleSubmitOrder}
                >
                    Submit Order
                </button>
            </div>
        </div>
    );
};

export default OrderSummaryPanel;
