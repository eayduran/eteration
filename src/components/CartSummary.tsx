import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateQuantity } from '../store/slices/cartSlice';
import type { CartItem } from '../store/slices/cartSlice';

const CartSummary: React.FC = () => {
  const { items, total } = useSelector((state: RootState) => state.cart as { items: CartItem[], total: number });
  const dispatch = useDispatch();

  return (
    <div className="space-y-4">
      {/* Cart Items */}
      <p className="text-gray-600 text-xs">Cart</p>
      <div className="bg-white shadow-detailCard p-4">
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-blue-600 text-sm">{item.price.toLocaleString('tr-TR')}₺</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                  className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200"
                >
                  -
                </button>
                <span className="w-8 text-center bg-blue-600 text-white rounded">
                  {item.quantity}
                </span>
                <button
                  onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                  className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout */}
      <p className="text-gray-600 text-xs">Checkout</p>
      <div className="bg-white shadow-detailCard p-4">
        <div className="flex justify-start gap-2 items-center mb-4">
          <span className="font-medium">Total Price:</span>
          <span className="text-blue-600 font-bold">{total.toLocaleString('tr-TR')}₺</span>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartSummary; 