import { useState } from 'react';
import { CartItem } from '../App';
import { Trash2, Plus, Minus, ShoppingBag, X } from 'lucide-react';

type CartScreenProps = {
  cart: CartItem[];
  onDeleteItem: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onCheckout: (notes: string, paymentStatus: 'paid' | 'unpaid', tableNumber: number) => void;
};

export function CartScreen({
  cart,
  onDeleteItem,
  onUpdateQuantity,
  onCheckout,
}: CartScreenProps) {
  const [notes, setNotes] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tableNumber, setTableNumber] = useState(1);

  const total = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const handleOrderClick = () => {
    if (cart.length === 0) return;
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    onCheckout(notes, 'paid', tableNumber);
    setNotes('');
    setShowPaymentModal(false);
  };

  const handlePayLater = () => {
    onCheckout(notes, 'unpaid', tableNumber);
    setNotes('');
    setShowPaymentModal(false);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  const handleQuantityClick = (itemId: string, currentQuantity: number) => {
    setEditingItemId(itemId);
    setEditValue(currentQuantity.toString());
  };

  const handleQuantityBlur = (itemId: string) => {
    const newQuantity = parseInt(editValue);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      onUpdateQuantity(itemId, newQuantity);
    }
    setEditingItemId(null);
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === 'Enter') {
      handleQuantityBlur(itemId);
    } else if (e.key === 'Escape') {
      setEditingItemId(null);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-gray-600 mb-2">Khay trống</h2>
        <p className="text-gray-400 text-center">
          Thêm món từ menu vào khay để bắt đầu
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-57px-80px)]">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex justify-between items-center">
        <h2 className="text-gray-900">Món đã chọn</h2>
        <select
          value={tableNumber}
          onChange={(e) => setTableNumber(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-lg text-gray-900 bg-white"
        >
          {[1, 2, 3, 4].map(num => (
            <option key={num} value={num}>Bàn {num}</option>
          ))}
        </select>
      </div>

      {/* Scrollable Cart Items List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-3">
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
                    {item.menuItem.price.toLocaleString('vi-VN')}₫
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
                      {editingItemId === item.id ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleQuantityBlur(item.id)}
                          onKeyDown={(e) => handleQuantityKeyDown(e, item.id)}
                          className="px-3 w-[2rem] text-center bg-transparent border-none outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          style={{ width: `${Math.max(2, editValue.length * 0.6)}rem` }}
                          autoFocus
                          min="1"
                        />
                      ) : (
                        <span
                          onClick={() => handleQuantityClick(item.id, item.quantity)}
                          className="px-3 min-w-[2rem] text-center cursor-pointer hover:bg-gray-200 rounded"
                        >
                          {item.quantity}
                        </span>
                      )}
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-200 rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-900">
                      {(item.menuItem.price * item.quantity).toLocaleString('vi-VN')}₫
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
      </div>

      {/* Fixed Bottom Section: Notes, Total and Checkout */}
      <div className="border-t border-gray-200 bg-white p-4 space-y-4">
        {/* Notes Section */}
        <div>
          <label htmlFor="order-notes" className="block text-gray-900 mb-2">
            Ghi chú cho bếp
          </label>
          <textarea
            id="order-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Thêm ghi chú đặc biệt..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-gray-900">Tổng cộng</span>
          <span className="text-gray-900">{total.toLocaleString('vi-VN')}₫</span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleOrderClick}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
        >
          Đặt Món
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-gray-900">Thanh toán đơn hàng</h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Order Total */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 mb-1">Tổng thanh toán</p>
                <p className="text-gray-900">{total.toLocaleString('vi-VN')}₫</p>
              </div>

              {/* QR Code */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 text-center mb-3">Quét mã QR để thanh toán</p>
                <div className="flex justify-center">
                  <img
                    src={`https://img.vietqr.io/image/MB-0776706371-compact.png?amount=${Math.round(total)}&addInfo="JSC Maid Cafe"`}
                    alt="VietQR Payment QR Code"
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <p className="text-gray-500 text-center mt-2 text-xs">
                  Mở app ngân hàng hoặc MoMo và quét mã QR
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleConfirmPayment}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Đã thanh toán
                </button>
                <button
                  onClick={handlePayLater}
                  className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Thanh toán sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}