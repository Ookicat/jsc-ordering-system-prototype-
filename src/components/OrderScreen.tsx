import { useState } from 'react';
import { Order } from '../App';
import { Clock, Check, Package, StickyNote, X, AlertCircle, CreditCard } from 'lucide-react';

type OrderScreenProps = {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateOrderPaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus']) => void;
};

type StatusFilter = 'all' | Order['status'];

export function OrderScreen({ orders, onCancelOrder, onUpdateOrderStatus, onUpdateOrderPaymentStatus }: OrderScreenProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [paymentModalOrderId, setPaymentModalOrderId] = useState<string | null>(null);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <Check className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ';
      case 'completed':
        return 'Hoàn thành';
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const toggleNoteExpand = (orderId: string) => {
    setExpandedNoteId(expandedNoteId === orderId ? null : orderId);
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-gray-600 mb-2">Chưa có đơn hàng</h2>
        <p className="text-gray-400 text-center">
          Đơn hàng sẽ xuất hiện ở đây sau khi khách đặt món
        </p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Status Filter Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[57px] z-10">
        <div className="flex">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 py-3 px-4 ${
              statusFilter === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600'
            }`}
          >
            Tất cả ({orderCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`flex-1 py-3 px-4 ${
              statusFilter === 'pending'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600'
            }`}
          >
            Chờ ({orderCounts.pending})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`flex-1 py-3 px-4 ${
              statusFilter === 'completed'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600'
            }`}
          >
            Hoàn thành ({orderCounts.completed})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-400">Không có đơn hàng trong danh mục này</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const isExpanded = expandedOrderId === order.id;
            const isNoteExpanded = expandedNoteId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Order Header - Clickable */}
                <div
                  onClick={() => toggleOrderExpand(order.id)}
                  className="p-4 cursor-pointer active:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-gray-900">
                          Đơn #{order.id.slice(-6)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full border text-xs bg-gray-100 text-gray-700 border-gray-300">
                          Bàn {order.tableNumber}
                        </span>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span>{getStatusLabel(order.status)}</span>
                        </div>
                        {order.paymentStatus === 'unpaid' && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs bg-red-100 text-red-700 border-red-300">
                            <CreditCard className="w-3 h-3" />
                            <span>Chưa thanh toán</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(order.date)} - {formatDate(order.date)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-900">{order.total.toLocaleString('vi-VN')}₫</div>
                      <div className="text-xs text-gray-500">{order.items.length} món</div>
                    </div>
                  </div>

                  {/* Order Summary - Always visible */}
                  <div className="text-sm text-gray-600 line-clamp-1">
                    {order.items.map(item => `${item.quantity}x ${item.menuItem.name}`).join(', ')}
                  </div>

                  {/* Notes - Always visible when present */}
                  {order.notes && (
                    <div className="mt-2 rounded p-2" style={{ backgroundColor: '#90e0ef', borderColor: '#48cae4', borderWidth: '1px' }}>
                      <div className="flex gap-2" style={{ color: '#023e8a' }}>
                        <StickyNote className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs">Ghi chú:</p>
                          <p className="text-sm line-clamp-2">{order.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
                    {/* Order Items Detail */}
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white p-2 rounded">
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-gray-900">{item.menuItem.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.menuItem.price.toLocaleString('vi-VN')}₫ x {item.quantity}
                            </p>
                          </div>
                          <p className="text-gray-900">
                            {(item.menuItem.price * item.quantity).toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Notes in expanded view */}
                    {order.notes && (
                      <div className="rounded p-3" style={{ backgroundColor: '#90e0ef', borderColor: '#48cae4', borderWidth: '1px' }}>
                        <div className="flex gap-2" style={{ color: '#023e8a' }}>
                          <StickyNote className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs mb-1">Ghi chú:</p>
                            <p className={`text-sm ${!isNoteExpanded ? 'line-clamp-2' : ''}`}>
                              {order.notes}
                            </p>
                            {order.notes.length > 80 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleNoteExpand(order.id);
                                }}
                                className="text-xs mt-1 underline hover:opacity-80"
                                style={{ color: '#023e8a' }}
                              >
                                {isNoteExpanded ? 'Ẩn bớt' : 'Xem thêm'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {order.status === 'pending' && order.paymentStatus === 'unpaid' ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPaymentModalOrderId(order.id);
                            }}
                            className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Thanh toán</span>
                          </button>
                          <button
                            onClick={() => onCancelOrder(order.id)}
                            className="px-4 py-2.5 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Hủy</span>
                          </button>
                        </>
                      ) : order.status === 'pending' && order.paymentStatus === 'paid' ? (
                        <>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                            className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            <span>Hoàn thành</span>
                          </button>
                          <button
                            onClick={() => onCancelOrder(order.id)}
                            className="px-4 py-2.5 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Hủy</span>
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Payment Modal */}
      {paymentModalOrderId && (() => {
        const order = orders.find(o => o.id === paymentModalOrderId);
        if (!order) return null;

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-gray-900">Thanh toán đơn hàng</h3>
                <button
                  onClick={() => setPaymentModalOrderId(null)}
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
                  <p className="text-gray-900">{order.total.toLocaleString('vi-VN')}₫</p>
                </div>

                {/* QR Code */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 text-center mb-3">Quét mã QR để thanh toán</p>
                  <div className="flex justify-center">
                    <img
                      src={`https://img.vietqr.io/image/MB-0776706371-compact.png?amount=${Math.round(order.total)}&addInfo=\"JSC Maid Cafe\"`}
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
                    onClick={() => {
                      onUpdateOrderPaymentStatus(order.id, 'paid');
                      setPaymentModalOrderId(null);
                    }}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Đã thanh toán
                  </button>
                  <button
                    onClick={() => setPaymentModalOrderId(null)}
                    className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}