import { useState } from 'react';
import { MenuItem } from '../App';
import { Plus, Minus } from 'lucide-react';

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'burger-1',
    name: 'Đồ ăn siu cấp JSC 1',
    price: 50000,
    category: 'food',
    image: 'https://i.ibb.co/RGJTs33k/JSC-ERM.png',
  },
  {
    id: 'pizza-1',
    name: 'Đồ ăn siu cấp JSC 2',
    price: 65000,
    category: 'food',
    image: 'https://i.ibb.co/RGJTs33k/JSC-ERM.png',
  },
  {
    id: 'pasta-1',
    name: 'Đồ ăn siu cấp JSC 3',
    price: 60000,
    category: 'food',
    image: 'https://i.ibb.co/RGJTs33k/JSC-ERM.png',
  },
  {
    id: 'salad-1',
    name: 'Lẩu femboi',
    price: 1000000,
    category: 'food',
    image: 'https://i.ibb.co/RGJTs33k/JSC-ERM.png',
  },
  {
    id: 'coffee-1',
    name: 'Signature',
    price: 20000,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBkcmlua3xlbnwxfHx8fDE3NjUxMjkwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'juice-1',
    name: 'Trà Đào',
    price: 25000,
    category: 'drink',
    image: 'https://horecavn.com/wp-content/uploads/2024/05/huong-dan-cong-thuc-tra-dao-cam-sa-hut-khach-ngon-kho-cuong_20240526180626.jpg',
  },
  {
    id: 'smoothie-1',
    name: 'Trà Matcha',
    price: 28000,
    category: 'drink',
    image: 'https://amivietnam.com/wp-content/uploads/2024/03/tra-sua-matcha.jpg',
  },
  {
    id: 'tea-1',
    name: 'Chanh Dây',
    price: 18000,
    category: 'drink',
    image: 'https://tiemphonui.com/cdn/shop/articles/nuoc-cot-chanh-day.webp?v=1693797609',
  },
  {
    id: 'tea-2',
    name: 'Soda Việt Quất',
    price: 18000,
    category: 'drink',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa8gd8iGX--phW1VRp56K64ZkNTDsOrLx-5Q&s',
  },
  {
    id: 'service-1',
    name: 'Service 1',
    price: 80000,
    category: 'service',
    image: 'https://i.ibb.co/RGJTs33k/JSC-ERM.png',
  },
  {
    id: 'service-2',
    name: 'Service 2',
    price: 100000,
    category: 'service',
    image: 'https://i.ibb.co/RGJTs33k/JSC-ERM.png',
  },
];

type MenuScreenProps = {
  onAddToCart: (menuItem: MenuItem, quantity: number) => void;
};

export function MenuScreen({ onAddToCart }: MenuScreenProps) {
  const [category, setCategory] = useState<'food' | 'drink' | 'service'>('food');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showToast, setShowToast] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filteredItems = MENU_ITEMS.filter(item => item.category === category);

  const incrementQuantity = (itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const decrementQuantity = (itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) - 1),
    }));
  };

  const handleQuantityClick = (itemId: string, currentQuantity: number) => {
    setEditingItemId(itemId);
    setEditValue(currentQuantity.toString());
  };

  const handleQuantityBlur = (itemId: string) => {
    const newQuantity = parseInt(editValue);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setQuantities(prev => ({
        ...prev,
        [itemId]: newQuantity,
      }));
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

  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    onAddToCart(item, quantity);
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="pb-4">
      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[57px] z-10">
        <div className="flex">
          <button
            onClick={() => setCategory('food')}
            className={`flex-1 py-3 px-4 ${
              category === 'food'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600'
            }`}
          >
            Đồ ăn
          </button>
          <button
            onClick={() => setCategory('drink')}
            className={`flex-1 py-3 px-4 ${
              category === 'drink'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600'
            }`}
          >
            Đồ uống
          </button>
          <button
            onClick={() => setCategory('service')}
            className={`flex-1 py-3 px-4 ${
              category === 'service'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600'
            }`}
          >
            Dịch vụ
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {filteredItems.map(item => {
          const quantity = quantities[item.id] || 1;
          return (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="flex">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover"
                />
                <div className="flex-1 p-3 flex flex-col">
                  <h3 className="text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 mt-1">{item.price.toLocaleString('vi-VN')}₫</p>
                  
                  {/* Quantity Selector */}
                  <div className="mt-auto flex items-center gap-2">
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="p-2 hover:bg-gray-200 rounded-l-lg"
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
                          min="0"
                        />
                      ) : (
                        <span
                          onClick={() => handleQuantityClick(item.id, quantity)}
                          className="px-3 min-w-[2rem] text-center cursor-pointer hover:bg-gray-200 rounded"
                        >
                          {quantity}
                        </span>
                      )}
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="p-2 hover:bg-gray-200 rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                      Chọn món
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
          Đã thêm vào Khay!
        </div>
      )}
    </div>
  );
}