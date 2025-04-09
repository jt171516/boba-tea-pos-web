import React from 'react'
import PropTypes from 'prop-types'

export default function ItemCard({ item, onClick }) {
  return (
    <div className="card z-0 w-80 h-80 bg-base-300 m-4 transition duration-300 ease-in-out hover: hover:scale-105"
    onClick={onClick}>
      <figure>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-60 object-cover rounded-t-lg"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{item.name}</h2>
        <p>{item.calories} Cal.</p>
        <p>${item.price.toFixed(2)}</p>
      </div>
    </div>
  )
}

ItemCard.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    calories: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
