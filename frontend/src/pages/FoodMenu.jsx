import React from 'react';

function FoodMenu() {
    console.log('FoodMenu component test');
    return (
        <div>
            <h1>Food Menu</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4">Item 1</div>
                <div className="bg-gray-100 p-4">Item 2</div>
                <div className="bg-gray-100 p-4">Item 3</div>
                <div className="bg-gray-100 p-4">Item 4</div>
                <div className="bg-gray-100 p-4">Item 5</div>
                <div className="bg-gray-100 p-4">Item 6</div>
            </div>
        </div>
    );
}
export default FoodMenu;