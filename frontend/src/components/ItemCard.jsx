import React from 'react'

export default function ItemCard({ item, onClick }) {
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      onClick();
    }
  };

  return (
    <div className="card z-0 w-80 h-80 bg-base-300 m-4 transition duration-300 ease-in-out hover: hover:scale-105"
    role ="button"
    onClick={onClick}
    onKeyDown={handleEnter}
    tabIndex={0}
    aria-label = {item.name}
    data-speak-text={item.name}
    >
      <figure>
        <img
          src={item?.image || "https://s3-media0.fl.yelpcdn.com/bphoto/GBAD5WodnuFXpi3Q3CnQGw/348s.jpg"}
          alt={item.name}
          className="w-full h-40 object-cover rounded-t-lg"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{item.name}</h2>
        <p>{item.calories} Cal.</p>
        <p>${item.price.toFixed(2)}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {item.vegetarian && (<span className="badge badge-success">{item.vegetarian}</span>)}
          {item.allergen && item.allergen.map((allergen, index) => (
            <span key={index} className="badge badge-warning">{allergen}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
