import React from 'react';

function FoodMenu() {
    console.log('FoodMenu component test');
    return (
        <div>
            <h1>Food Menu</h1>
            <div className="grid">
                <div className="items">Item 1</div>
                <div className="items">Item 2</div>
                <div className="items">Item 3</div>
                <div className="items">Item 4</div>
                <div className="items">Item 5</div>
                <div className="items">Item 6</div>
            </div>
        </div>
    );
}
export default FoodMenu;