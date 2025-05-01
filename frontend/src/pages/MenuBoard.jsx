import React, { useEffect, useState } from "react";

const CATEGORY_ORDER = [
  "milk-tea",
  "brewed-tea",
  "fruit-tea",
  "fresh-milk",
  "ice-blended",
  "tea-mojito",
  "creama",
];

const DISPLAY_NAME = {
  "milk-tea": "Milk Tea",
  "brewed-tea": "Brewed Tea",
  "fruit-tea": "Fruit Tea",
  "fresh-milk": "Fresh Milk (milk alternatives)",
  "ice-blended": "Ice Blended",
  "tea-mojito": "Tea Mojito",
  creama: "Creama",
};

const INDICATORS = {
  recommended: "★", // star
  hot: "▲",          // triangle
  nonCaffeinated: "◯", // outline circle
};

export default function MenuBoard() {
  const [itemsByCategory, setItemsByCategory] = useState({});

  const toppings = [
    "Crystal Boba",
    "Honey Jelly",
    "Lychee Jelly",
    "Pudding",
    "Mango Popping Boba",
    "Creama",
    "Coffee Jelly",
    "Ice Cream",
  ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

  const iceLevels = ["100% Normal", "75% Less", "50% Half", "25% Light", "0% No Ice"];
  const sweetnessLevels = ["100% Normal", "75% Less", "50% Half", "25% Light", "0% No Sugar"];

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/item`);
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data = await res.json();

        const grouped = data.reduce((acc, item) => {
          // Ensure boolean fields are treated as booleans
          const processedItem = {
            ...item,
            recommended: !!item.recommended, // Convert to boolean just in case
            hot: !!item.hot,
            nonCaffeinated: !!item.noncaffeinated, // Corrected field name if it's noncaffeinated in DB
          };
          const key = processedItem.category || "uncategorized";
          (acc[key] ||= []).push(processedItem);
          return acc;
        }, {});
        Object.values(grouped).forEach(arr => arr.sort((a, b) => a.id - b.id));
        setItemsByCategory(grouped);
      } catch (err) {
        // eslint‑disable‑next‑line no-console
        console.error("Error fetching or processing items:", err); // Added more context
      }
    })();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#faf9f7] p-3 font-sans text-[#111]">
      <div className="mx-auto mb-3 flex max-w-6xl flex-col items-center gap-0.5 text-center">
        <h1 className="text-2xl font-extrabold tracking-wider text-[#d72631] sm:text-3xl">
          Sharetaele
        </h1>
        <span className="text-[0.6rem] italic tracking-wide text-gray-700 sm:text-xs">
          EST. 2025 Taiwan – Bubblicious
        </span>
        <h2 className="mt-1 text-4xl font-black italic tracking-tight sm:text-5xl">MENU</h2>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_ORDER.map(
          key =>
            itemsByCategory[key] && (
              <section key={key} className="space-y-0.5">
                <h3 className="mb-0.5 font-serif text-xl italic text-[#f57c00] sm:text-2xl">
                  {DISPLAY_NAME[key]}
                </h3>

                <ul className="space-y-0 text-xs sm:text-sm">
                  {itemsByCategory[key].map(drink => (
                    <li key={drink.id} className="flex items-start justify-between">
                      <div className="flex gap-1">
                        <span className="mt-[0.3rem] inline-block h-[2px] w-[2px] rounded-full bg-[#111] sm:mt-[0.4rem] sm:h-[3px] sm:w-[3px]" />
                        <span>{drink.name}</span>
                        {(drink.recommended || drink.hot || drink.nonCaffeinated) && (
                          <span className="ml-1 space-x-0.5 text-[#111]"> 
                            {drink.recommended && <span>{INDICATORS.recommended}</span>}
                            {drink.hot && <span>{INDICATORS.hot}</span>}
                            {drink.nonCaffeinated && <span>{INDICATORS.nonCaffeinated}</span>}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-xs sm:text-sm">${drink.price?.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ),
        )}

        <aside className="col-span-full grid grid-cols-1 gap-4 md:grid-cols-3 lg:mt-1">
          <div>
            <h4 className="mb-0.5 font-serif text-xl italic text-[#f57c00] sm:text-2xl">Ice Level</h4>
            <ul className="space-y-0 text-xs sm:text-sm">
              {iceLevels.map(lvl => (
                <li key={lvl}>{lvl}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-0.5 font-serif text-xl italic text-[#f57c00] sm:text-2xl">Sweetness Level</h4>
            <ul className="space-y-0 text-xs sm:text-sm">
              {sweetnessLevels.map(lvl => (
                <li key={lvl}>{lvl}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-0.5 font-serif text-xl italic text-[#f57c00] sm:text-2xl">Topping</h4>
            <p className="mb-0.5 text-[0.6rem] italic text-gray-500 sm:text-[0.65rem]">For each extra topping</p>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-0 text-xs md:grid-cols-1 sm:text-sm">
              {toppings.map(top => (
                <li key={top}>{top}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <footer className="mx-auto mt-4 max-w-5xl text-[0.65rem] text-gray-600 sm:text-xs">
        <h5 className="mb-0.5 font-semibold text-gray-700">Legend</h5>
        <ul className="flex flex-wrap gap-x-2 gap-y-0.5 sm:gap-x-3 sm:gap-y-1">
          <li>
            <span className="mr-1 text-black">★</span> Recommended
          </li>
          <li>
            <span className="mr-1 text-black">▲</span> Hot Available
          </li>
          <li>
            <span className="mr-1 text-black">◯</span> Non‑Caffeinated
          </li>
        </ul>

        <p className="mt-2 max-w-lg text-[0.6rem] text-gray-500 sm:max-w-xl sm:text-[0.65rem]">
          <strong>Food Allergy Notice</strong> – We cannot guarantee that any of our products are free
          from allergens (including dairy, eggs, soy, tree nuts, wheat and others) as we use shared
          equipment to store, prepare and serve them. Additional nutrition information available upon
          request.
        </p>
      </footer>
    </div>
  );
}
