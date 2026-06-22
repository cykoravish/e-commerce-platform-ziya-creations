'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { ShoppingCart, User, LogOut, Search, Menu, X, Heart } from 'lucide-react';

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
  stock: number;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
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
        setProducts(data.data.products || []);
      }
    } catch (error) {
      console.error('[v0] Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setMobileMenuOpen(false);
    fetchProducts(categoryId || undefined);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="text-2xl font-bold text-white">Ziya</div>
              <div className="text-xs text-secondary font-bold">Creations</div>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <div className="flex-1 hidden md:block max-w-md mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full px-4 py-2 rounded text-sm text-gray-900"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  {user.role !== 'customer' && (
                    <Link href="/admin" className="text-white text-sm font-medium hover:text-secondary transition">
                      Admin
                    </Link>
                  )}
                  <Link href="/orders" className="text-white text-sm font-medium hover:text-secondary transition">
                    Orders
                  </Link>
                  <Link href="/cart" className="relative text-white hover:text-secondary transition">
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <div className="relative group">
                    <button className="text-white hover:text-secondary transition flex items-center gap-1">
                      <User size={20} />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Account
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-white text-sm font-medium hover:text-secondary transition">
                    Login
                  </Link>
                  <Link href="/auth/signup" className="bg-secondary text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-blue-400 pt-3 space-y-3 animate-in fade-in slide-in-from-top">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-3 py-2 rounded text-sm text-gray-900"
                />
                <button className="bg-secondary text-white px-3 py-2 rounded">
                  <Search size={16} />
                </button>
              </div>
              {user ? (
                <>
                  <Link href="/cart" className="flex items-center gap-2 text-white text-sm font-medium hover:text-secondary">
                    <ShoppingCart size={16} /> Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                  <Link href="/orders" className="block text-white text-sm font-medium hover:text-secondary">
                    Orders
                  </Link>
                  <Link href="/account" className="block text-white text-sm font-medium hover:text-secondary">
                    My Account
                  </Link>
                  {user.role !== 'customer' && (
                    <Link href="/admin" className="block text-white text-sm font-medium hover:text-secondary">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={logout} className="w-full text-left text-white text-sm font-medium hover:text-secondary">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block text-white text-sm font-medium hover:text-secondary">
                    Login
                  </Link>
                  <Link href="/auth/signup" className="block bg-secondary text-white px-4 py-2 rounded text-sm font-medium text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary via-blue-600 to-primary text-white p-6 md:p-12 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome to Ziya Creations</h1>
          <p className="text-lg md:text-xl opacity-90">Discover amazing products at unbeatable prices</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Sidebar - Categories */}
          <div className="md:col-span-1">
            <div className="bg-white rounded shadow-sm sticky top-24">
              <div className="bg-primary text-white p-4 font-bold rounded-t">
                Categories
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-4 py-3 rounded text-sm font-medium transition transform hover:scale-105 ${
                    selectedCategory === ''
                      ? 'bg-primary text-white'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category._id)}
                    className={`w-full text-left px-4 py-3 rounded text-sm font-medium transition transform hover:scale-105 ${
                      selectedCategory === category._id
                        ? 'bg-primary text-white'
                        : 'text-gray-900 hover:bg-gray-50'
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
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {selectedCategory ? 'Category Products' : 'All Products'}
              </h2>
              {!loading && products.length > 0 && (
                <span className="text-sm text-gray-600 font-medium">
                  {products.length} products
                </span>
              )}
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-primary border-t-secondary rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading amazing products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded shadow-sm">
                <p className="text-lg font-medium text-gray-600 mb-4">No products found</p>
                <button
                  onClick={() => handleCategoryChange('')}
                  className="bg-primary text-white px-6 py-2 rounded font-semibold hover:opacity-90 transition"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product}
                    isWishlisted={wishlist.has(product._id)}
                    onWishlistToggle={() => toggleWishlist(product._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
}

function ProductCard({ product, isWishlisted, onWishlistToggle }: ProductCardProps) {
  const discount = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group flex flex-col h-full">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative flex-shrink-0">
        <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <p className="text-sm">No Image</p>
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-secondary text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
              {discount}% OFF
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={onWishlistToggle}
        className="absolute top-3 left-3 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
      >
        <Heart
          size={18}
          className={`transition ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Content */}
      <Link href={`/products/${product.slug}`} className="flex-1 p-4 flex flex-col">
        <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 mb-3 group-hover:text-primary transition">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          {product.discountedPrice ? (
            <>
              <span className="text-lg font-bold text-primary">
                ₹{product.discountedPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-yellow-500">★</span>
            <span className="text-sm font-medium text-gray-900">{product.rating.toFixed(1)}</span>
          </div>
          {product.reviewCount > 0 && (
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          )}
        </div>
      </Link>

      {/* Add to Cart Button - Shows on hover */}
      <div className="px-4 pb-4">
        <button className="w-full bg-secondary text-white py-2 rounded font-semibold hover:opacity-90 transition text-sm">
          View Details
        </button>
      </div>
    </div>
  );
}
