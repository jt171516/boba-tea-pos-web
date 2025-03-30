import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

function HomePage() {

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome to ShareTea!
      </h1>
      <Link to="/customer">
        <button
          className="btn btn-primary btn-lg gap-2"
        >
          <ShoppingCart className="w-6 h-6" />
          Start Order
        </button>
      </Link>

      <p className="mt-4 text-gray-600">
        Touch the button above to begin ordering.
      </p>
    </main>
  );
}

export default HomePage;
