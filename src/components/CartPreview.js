import React from "react";

const CartPreview = ({ cart, cartTotal, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div className="fixed top-20 right-4 w-80 bg-white shadow-lg rounded-lg p-4 z-40">
      <h3 className="text-lg font-bold mb-4">Shopping Cart</h3>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-2 mb-2">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="px-2 bg-gray-100 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="px-2 bg-gray-100 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.price * item.quantity}</p>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${cartTotal}</span>
            </div>
            <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPreview;
