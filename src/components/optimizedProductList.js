import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { Loader2, ShoppingCart } from "lucide-react";

// 懒加载购物车组件
const CartPreview = lazy(() => import("./CartPreview"));

// 使用 React.memo 优化 ProductCard 组件
const ProductCard = React.memo(
  ({ product, onAddToCart }) => {
    return (
      <div className="border p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
        <img
          loading="lazy"
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover mb-4 rounded"
          onError={(e) => {
            e.target.src = "images/placeholder-image.jpg";
          }}
        />
        <h2 className="text-xl font-semibold">{product.name}</h2>
        <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold">${product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.price === nextProps.product.price
    );
  }
);

const ProductListWithCart = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 使用 useMemo 缓存产品数据
  const allProducts = useMemo(() => {
    return Array.from({ length: 500 }, (_, i) => ({
      id: i,
      name: `Product ${i}`,
      description: `This is a detailed description for product ${i}...`,
      price: Math.floor(Math.random() * 1000) + 1,
      image: `/images/product${(i % 10) + 1}.jpg`,
    }));
  }, []);

  // 获取当前页的产品
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, allProducts]);

  // 模拟API加载
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProducts(currentProducts);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentProducts]);

  // 购物车相关操作
  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    setShowCartPreview(true);
    const timer = setTimeout(() => setShowCartPreview(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  // 使用 useMemo 缓存购物车计算结果
  const cartStats = useMemo(
    () => ({
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      count: cart.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [cart]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative p-4 max-w-7xl mx-auto">
      {/* 购物车图标 */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowCartPreview(!showCartPreview)}
          className="bg-blue-500 text-white p-3 rounded-full relative hover:bg-blue-600 transition-colors"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartStats.count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {cartStats.count}
            </span>
          )}
        </button>
      </div>

      {/* 购物车预览 */}
      <Suspense
        fallback={
          <div className="fixed top-20 right-4 w-80 bg-white shadow-lg rounded-lg p-4 z-40">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="space-y-3">
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        }
      >
        {showCartPreview && (
          <CartPreview
            cart={cart}
            cartTotal={cartStats.total}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
          />
        )}
      </Suspense>

      {/* 产品列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>

      {/* 简化的分页控件 */}
      <div className="mt-8 flex justify-center items-center space-x-4">
        <button
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          Previous
        </button>
        <span className="text-lg">
          Page {currentPage} of {Math.ceil(allProducts.length / itemsPerPage)}
        </span>
        <button
          onClick={() => setCurrentPage((page) => page + 1)}
          disabled={currentPage * itemsPerPage >= allProducts.length}
          className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductListWithCart;
