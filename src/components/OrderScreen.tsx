import { Order } from '../App';
import { Package, Calendar, StickyNote, X } from 'lucide-react';

type OrderScreenProps = {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
};

export function OrderScreen({ orders, onCancelOrder }: OrderScreenProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-gray-600 mb-2">Chưa có đơn</h2>
        <p className="text-gray-400 text-center">
          Đơn gọi món của bạn sẽ xuất hiện ở đây sau khi đặt món
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-gray-900">Danh sách đơn hàng</h2>
      
      {orders.map(order => (
        <div
          key={order.id}
          className="bg-white rounded-lg shadow-sm p-4 space-y-3"
        >
          {/* Order Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(order.date)}</span>
              </div>
              <p className="text-xs text-gray-500">Đơn hàng #{order.id.slice(-8)}</p>
            </div>
            <button
              onClick={() => onCancelOrder(order.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-3 space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <p className="text-gray-900">{item.menuItem.name}</p>
                    <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-gray-900">
                  ${(item.menuItem.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="border-t border-gray-200 pt-3">
              <div className="flex gap-2 text-gray-600">
                <StickyNote className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm">Ghi chú:</p>
                  <p className="text-sm text-gray-500">{order.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Total */}
          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${order.total.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
