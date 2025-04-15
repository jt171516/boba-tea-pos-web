import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PaymentPage() {
  const { orderId } = useParams(); // Get the orderId from the URL
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigate = useNavigate();

  const handlePaymentSelection = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    try {
      // Update the payment column in the orders table
      await fetch(`http://localhost:5001/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment: paymentMethod }),
      });

      alert(`Payment method updated to ${paymentMethod}.`);
    } catch (error) {
      console.error('Error updating payment method:', error);
      alert(`Failed to update payment method: ${error.message}`);
    }
  };

  const handleFinishOrder = () => {
    // Navigate back to the HomePage
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Select Payment Method</h1>
      <div className="flex gap-4 mb-6">
        <button
          className={`btn ${paymentMethod === 'Card' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setPaymentMethod('card')}
        >
          Card
        </button>
        <button
          className={`btn ${paymentMethod === 'Cash' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setPaymentMethod('cash')}
        >
          Cash
        </button>
      </div>
      <button className="btn btn-success mb-4" onClick={handlePaymentSelection}>
        Confirm Payment Method
      </button>
      <button className="btn btn-warning" onClick={handleFinishOrder}>
        Finish Order
      </button>
    </div>
  );
}

export default PaymentPage;