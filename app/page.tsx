'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { ShoppingCart, User, LogOut } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: Category;
  rating: number;
  reviewCount: number;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { user, logout } = useAuth();
  const { items: cart } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('[v0] Fetch categories error:', error);
    }
  };

  const fetchProducts = async (categoryId?: string) => {
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=12`;
      if (categoryId) {
        url += `&category=${categoryId}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setProducts(data.data.products);
      }
    } catch (error) {
      console.error('[v0] Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId || undefined);
  };

  const handleLogout = () => {
    logout();
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-white">Ziya</div>
              <div className="text-xs text-secondary font-bold">Creations</div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 mx-8 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded text-sm"
                />
                <button className="absolute right-3 top-2 bg-secondary text-white px-4 py-1 rounded text-sm font-semibold">
                  Search
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              {user ? (
                <>
                  {user.role !== 'customer' && (
                    <Link
                      href="/admin"
                      className="text-white text-sm font-medium hover:text-secondary transition"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    className="text-white text-sm font-medium hover:text-secondary transition"
                  >
                    Orders
                  </Link>
                  <Link href="/cart" className="relative text-white hover:text-secondary transition">
                    <ShoppingCart size={24} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <div className="relative group">
                    <button className="text-white hover:text-secondary transition">
                      <User size={24} />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded hidden group-hover:block">
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {user.name}
                      </Link>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-white text-sm font-medium hover:text-secondary transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-secondary text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Sidebar - Categories */}
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-200 rounded">
              <div className="bg-primary text-white p-4 font-bold rounded-t">
                Shop by Category
              </div>
              <div className="p-4">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-3 py-2 rounded mb-2 text-sm transition ${
                    selectedCategory === ''
                      ? 'bg-primary text-white font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category._id)}
                    className={`w-full text-left px-3 py-2 rounded mb-2 text-sm transition ${
                      selectedCategory === category._id
                        ? 'bg-primary text-white font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">
                {selectedCategory ? 'Category Products' : 'All Products'}
              </h2>
              {!loading && products.length > 0 && (
                <p className="text-sm text-gray-600">Showing {products.length} products</p>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">
                  <div className="w-8 h-8 border-4 border-primary border-t-secondary rounded-full"></div>
                </div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <p className="text-lg">No products found in this category</p>
                    <button
                      onClick={() => handleCategoryChange('')}
                      className="mt-4 bg-primary text-white px-4 py-2 rounded hover:opacity-90 transition"
                    >
                      View All Products
                    </button>
                  </div>
                ) : (
                  products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const discount = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
        <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-secondary text-white px-2 py-1 rounded text-xs font-bold">
              {discount}% OFF
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 text-gray-800 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            {product.discountedPrice ? (
              <>
                <span className="text-lg font-bold text-primary">
                  ₹{product.discountedPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">
                ₹{product.price}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <span className="text-sm font-medium">★ {product.rating.toFixed(1)}</span>
            {product.reviewCount > 0 && (
              <span className="text-xs text-gray-600">({product.reviewCount})</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
