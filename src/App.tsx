import { useState } from 'react';
import { MenuScreen } from './components/MenuScreen';
import { CartScreen } from './components/CartScreen';
import { OrderScreen } from './components/OrderScreen';

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: 'food' | 'drink';
  image: string;
};

export type CartItem = {
  id: string;
  menuItem: MenuItem;
  quantity: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  notes: string;
  total: number;
  date: Date;
};

type Screen = 'menu' | 'cart' | 'orders';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (menuItem: MenuItem, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.menuItem.id === menuItem.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { id: `cart-${Date.now()}`, menuItem, quantity }];
    });
  };

  const deleteFromCart = (cartItemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
  };

  const updateCartItemQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      deleteFromCart(cartItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const createOrder = (notes: string) => {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: [...cart],
      notes,
      total,
      date: new Date(),
    };
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setCart([]);
    setCurrentScreen('orders');
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-center text-gray-900">JSC Ordering System</h1>
        </div>
      </header>

      <main className="pb-20">
        {currentScreen === 'menu' && (
          <MenuScreen onAddToCart={addToCart} />
        )}
        {currentScreen === 'cart' && (
          <CartScreen
            cart={cart}
            onDeleteItem={deleteFromCart}
            onUpdateQuantity={updateCartItemQuantity}
            onCheckout={createOrder}
          />
        )}
        {currentScreen === 'orders' && (
          <OrderScreen
            orders={orders}
            onCancelOrder={cancelOrder}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex">
          <button
            onClick={() => setCurrentScreen('menu')}
            className={`flex-1 py-3 px-4 text-center ${
              currentScreen === 'menu'
                ? 'text-blue-600 border-t-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Thực đơn
          </button>
          <button
            onClick={() => setCurrentScreen('cart')}
            className={`flex-1 py-3 px-4 text-center relative ${
              currentScreen === 'cart'
                ? 'text-blue-600 border-t-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Khay
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1/4 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentScreen('orders')}
            className={`flex-1 py-3 px-4 text-center ${
              currentScreen === 'orders'
                ? 'text-blue-600 border-t-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Đơn hàng
          </button>
        </div>
      </nav>
    </div>
  );
}
