import React from 'react'
import PropTypes from 'prop-types'

export default function ItemCard({ item }) {
  return (
    <div className="card w-96 h-96 shadow-xl bg-base-300 m-4">
      <figure>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-t-lg"
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
    image: PropTypes.string.isRequired
  }).isRequired,
};
