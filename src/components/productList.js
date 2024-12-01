import React, { useState, useEffect } from "react";
import { Loader2, ShoppingCart } from "lucide-react";

// 未优化版本：一次性加载所有数据，没有分页，没有延迟加载，重复渲染，性能较差
const ProductListWithCart = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCartPreview, setShowCartPreview] = useState(false);

  // 生成大量产品数据来模拟性能问题
  const generateProducts = () => {
    return Array.from({ length: 500 }, (_, i) => ({
      id: i,
      name: `Product ${i}`,
      description: `This is a very long and detailed description for product ${i}. It contains a lot of unnecessary text that could be truncated. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      price: Math.floor(Math.random() * 1000) + 1,
      image: `/images/product${(i % 10) + 1}.jpg`,
    }));
  };

  // 模拟较慢的数据加载
  useEffect(() => {
    const loadProducts = async () => {
      // 模拟较慢的网络请求
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const data = generateProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  // 每次渲染都重新计算的购物车总价（未优化）
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 未优化的添加到购物车功能 - 每次都创建新数组
  const addToCart = (product) => {
    const newCart = [...cart];
    const existingItem = newCart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      setCart(newCart);
    } else {
      setCart([...newCart, { ...product, quantity: 1 }]);
    }

    // 显示购物车预览
    setShowCartPreview(true);
    setTimeout(() => setShowCartPreview(false), 3000);
  };

  const removeFromCart = (productId) => {
    // 未优化的删除方法 - 每次都创建新数组
    const newCart = [...cart];
    const index = newCart.findIndex((item) => item.id === productId);
    if (index > -1) {
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    // 未优化的更新方法 - 每次都创建新数组
    const newCart = [...cart];
    const item = newCart.find((item) => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
      setCart(newCart);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative p-4">
      {/* 购物车图标 */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowCartPreview(!showCartPreview)}
          className="bg-blue-500 text-white p-3 rounded-full relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </button>
      </div>

      {/* 购物车预览 - 未优化版本，每次都完整渲染 */}
      {showCartPreview && (
        <div className="fixed top-20 right-4 w-80 bg-white shadow-lg rounded-lg p-4 z-40">
          <h3 className="text-lg font-bold mb-4">Shopping Cart</h3>
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
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 bg-gray-100 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 bg-gray-100 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.price * item.quantity}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
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
            <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* 产品列表 - 一次性渲染所有产品 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-lg font-bold">${product.price}</span>
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListWithCart;
