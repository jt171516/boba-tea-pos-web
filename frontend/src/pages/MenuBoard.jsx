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

  // Modifiers (static – tweak as needed)
  const toppings = [
    "Pearl",
    "Aloe Vera",
    "Lychee Jelly",
    "Mini Pearl",
    "Red Bean",
    "Creama",
    "Herb Jelly",
    "Crystal Boba",
    "Pudding",
    "Aiyu Jelly",
  ];
  const iceLevels = ["Regular Ice", "Less Ice", "No Ice"];
  const sweetnessLevels = ["100% Normal", "80% Less", "50% Half", "30% Light", "0% No Sugar"];

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/item`);
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data = await res.json();

        /* group + sort */
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
    <div className="min-h-screen w-full bg-[#faf9f7] p-4 font-sans text-[#111]">
      <div className="mx-auto mb-4 flex max-w-7xl flex-col items-center gap-1 text-center">
        <h1 className="text-3xl font-extrabold tracking-wider text-[#d72631] sm:text-4xl">
          Sharetaele
        </h1>
        <span className="text-xs italic tracking-wide text-gray-700">
          EST. 2025 Taiwan – Bubblicious
        </span>
        <h2 className="mt-2 text-5xl font-black italic tracking-tight sm:text-6xl">MENU</h2>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_ORDER.map(
          key =>
            itemsByCategory[key] && (
              <section key={key} className="space-y-1">
                <h3 className="mb-1 font-serif text-2xl italic text-[#f57c00]">
                  {DISPLAY_NAME[key]}
                </h3>

                <ul className="space-y-0.5 text-sm">
                  {itemsByCategory[key].map(drink => (
                    <li key={drink.id} className="flex items-start justify-between">
                      <div className="flex gap-1">
                        <span className="mt-[0.4rem] inline-block h-[3px] w-[3px] rounded-full bg-[#111]" />
                        <span>{drink.name}</span>
                        {(drink.recommended || drink.hot || drink.nonCaffeinated) && (
                          <span className="ml-1 space-x-1 text-[#111]">
                            {drink.recommended && <span>{INDICATORS.recommended}</span>}
                            {drink.hot && <span>{INDICATORS.hot}</span>}
                            {drink.nonCaffeinated && <span>{INDICATORS.nonCaffeinated}</span>}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-sm">${drink.price?.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ),
        )}

        <aside className="col-span-full grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-2">
          <div>
            <h4 className="mb-1 font-serif text-2xl italic text-[#f57c00]">Ice Level</h4>
            <ul className="space-y-0.5 text-sm">
              {iceLevels.map(lvl => (
                <li key={lvl}>{lvl}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-1 font-serif text-2xl italic text-[#f57c00]">Sweetness Level</h4>
            <ul className="space-y-0.5 text-sm">
              {sweetnessLevels.map(lvl => (
                <li key={lvl}>{lvl}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-1 font-serif text-2xl italic text-[#f57c00]">Topping</h4>
            <p className="mb-1 text-[0.65rem] italic text-gray-500">For each extra topping</p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-sm md:grid-cols-1">
              {toppings.map(top => (
                <li key={top}>{top}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Legend – icons explanation - Reduced font size and margins */}
      <footer className="mx-auto mt-6 max-w-4xl text-xs text-gray-600">
        <h5 className="mb-1 font-semibold text-gray-700">Legend</h5>
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
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

        <p className="mt-3 max-w-xl text-[0.65rem] text-gray-500">
          <strong>Food Allergy Notice</strong> – We cannot guarantee that any of our products are free
          from allergens (including dairy, eggs, soy, tree nuts, wheat and others) as we use shared
          equipment to store, prepare and serve them. Additional nutrition information available upon
          request.
        </p>
      </footer>
    </div>
  );
}
