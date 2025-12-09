import { useState } from 'react';
import { CartItem } from '../App';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

type CartScreenProps = {
  cart: CartItem[];
  onDeleteItem: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onCheckout: (notes: string) => void;
};

export function CartScreen({
  cart,
  onDeleteItem,
  onUpdateQuantity,
  onCheckout,
}: CartScreenProps) {
  const [notes, setNotes] = useState('');

  const total = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    onCheckout(notes);
    setNotes('');
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-gray-600 mb-2">Khay trống</h2>
        <p className="text-gray-400 text-center">
          Thêm món từ menu vào khay của bạn để bắt đầu
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Cart Items List */}
      <div className="space-y-3">
        <h2 className="text-gray-900">Món đã chọn</h2>
        {cart.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm p-4"
          >
            <div className="flex items-start gap-3">
              <img
                src={item.menuItem.image}
                alt={item.menuItem.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-gray-900">{item.menuItem.name}</h3>
                <p className="text-gray-600 mt-1">
                  ${item.menuItem.price.toFixed(2)}
                </p>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-200 rounded-l-lg"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-gray-200 rounded-r-lg"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-900">
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              
              {/* Delete Button */}
              <button
                onClick={() => onDeleteItem(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                aria-label="Remove item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <label htmlFor="order-notes" className="block text-gray-900 mb-2">
          Ghi chú cho bếp
        </label>
        <textarea
          id="order-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add special instructions or dietary requirements..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {/* Total and Checkout */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
        >
          Đặt Món
        </button>
      </div>
    </div>
  );
}
