'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { ShoppingCart, User, Search, Menu, X, Heart, MapPin, Phone, Mail, ChevronRight, Star } from 'lucide-react';

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
  totalSold: number;
  gender: string;
}

interface Banner {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [categoryScrollIndex, setCategoryScrollIndex] = useState(0);
  const [bestSellerIndex, setBestSellerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { user, logout } = useAuth();
  const { items: cart } = useCart();

  useEffect(() => {
    fetchData();
    const bannerTimer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % (banners.length || 1));
    }, 5000);
    return () => clearInterval(bannerTimer);
  }, [banners.length]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchProducts(),
        fetchBestSellers(),
        fetchBanners(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('[v0] Fetch categories error:', error);
    }
  };

  const fetchProducts = async (categoryId?: string, gender?: string) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=12`;
      if (categoryId) url += `&category=${categoryId}`;
      if (gender) url += `&gender=${gender}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setProducts(data.data?.products || []);
      }
    } catch (error) {
      console.error('[v0] Fetch products error:', error);
    }
  };

  const fetchBestSellers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=5&sort=-totalSold`);
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setBestSellers(data.data?.products || []);
      }
    } catch (error) {
      console.error('[v0] Fetch best sellers error:', error);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`);
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setBanners(data.data || []);
      }
    } catch (error) {
      console.error('[v0] Fetch banners error:', error);
    }
  };

  const handleCategoryFilter = (categoryId: string) => {
    const newCategory = categoryId === selectedCategory ? '' : categoryId;
    setSelectedCategory(newCategory);
    setSelectedGender('');
    fetchProducts(newCategory, '');
  };

  const handleGenderFilter = (gender: string) => {
    const newGender = gender === selectedGender ? '' : gender;
    setSelectedGender(newGender);
    fetchProducts(selectedCategory || undefined, newGender);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products?search=${encodeURIComponent(query)}&limit=20`
        );
        const data = await response.json();
        if (data.statusCode === 'SUCCESS') {
          setProducts(data.data?.products || []);
        }
      } catch (error) {
        console.error('[v0] Search error:', error);
      }
    } else {
      fetchProducts();
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev);
      newWishlist.has(productId) ? newWishlist.delete(productId) : newWishlist.add(productId);
      return newWishlist;
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="text-2xl font-bold text-white">Ziya</div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 hidden md:block max-w-md mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-900 bg-white border-2 border-white focus:outline-none focus:border-secondary placeholder-gray-500"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/wishlist" className="relative text-white hover:text-secondary transition">
                <Heart size={22} fill={wishlist.size > 0 ? 'currentColor' : 'none'} />
                {wishlist.size > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.size}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative text-white hover:text-secondary transition">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-white hover:text-secondary transition">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    {user.role !== 'customer' && (
                      <span className="text-xs bg-yellow-400 text-gray-900 px-2 py-1 rounded-full font-bold">
                        {user.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
                      </span>
                    )}
                  </button>
                  <div className="absolute right-0 mt-0 w-56 bg-white shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-2 transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      <p className="text-xs text-secondary font-bold capitalize mt-1">{user.role.replace('_', ' ')}</p>
                    </div>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      My Orders
                    </Link>
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      My Account
                    </Link>
                    {user.role !== 'customer' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-secondary font-semibold hover:bg-gray-50 border-t border-gray-200">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t border-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/auth/login" className="text-white text-sm font-medium hover:text-secondary transition">
                    Login
                  </Link>
                  <Link href="/auth/signup" className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Search & Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-blue-400 pt-4 max-h-[calc(100vh-64px)] overflow-y-auto animate-in fade-in slide-in-from-top">
              <div className="px-0 space-y-3">
                <div className="relative mx-0">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-900 border-2 border-white focus:outline-none focus:border-secondary"
                  />
                  <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                {user ? (
                  <div className="space-y-0 text-white text-sm">
                    <div className="flex items-center gap-3 px-4 py-3 bg-blue-700 rounded-lg mb-2">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 text-base">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-blue-100">{user.email}</p>
                      </div>
                      {user.role !== 'customer' && (
                        <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                          {user.role === 'super_admin' ? 'ADMIN' : 'STAFF'}
                        </span>
                      )}
                    </div>

                    <Link href="/orders" className="block px-4 py-2.5 hover:bg-blue-700 rounded">
                      My Orders
                    </Link>
                    <Link href="/track-order" className="block px-4 py-2.5 hover:bg-blue-700 rounded">
                      Track Order
                    </Link>
                    
                    <div className="pt-2 px-4 border-t border-blue-500">
                      <p className="font-semibold mb-2 mt-2">Shop by Category</p>
                      <div className="space-y-1 ml-2">
                        {categories.map((cat) => (
                          <button
                            key={cat._id}
                            onClick={() => {
                              handleCategoryFilter(cat._id);
                              setMobileMenuOpen(false);
                            }}
                            className="block hover:text-secondary text-sm w-full text-left py-1"
                          >
                            • {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 px-4 border-t border-blue-500">
                      <p className="font-semibold mb-2 mt-2">Shop by Gender</p>
                      <div className="space-y-1 ml-2">
                        {['male', 'female', 'unisex'].map((gender) => (
                          <button
                            key={gender}
                            onClick={() => {
                              handleGenderFilter(gender);
                              setMobileMenuOpen(false);
                            }}
                            className="block hover:text-secondary text-sm w-full text-left py-1 capitalize"
                          >
                            • {gender}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Link href="/contact" className="block px-4 py-2.5 mt-2 border-t border-blue-500 hover:bg-blue-700 rounded">
                      Contact Us
                    </Link>
                    <Link href="/stores" className="block px-4 py-2.5 hover:bg-blue-700 rounded">
                      Store Locator
                    </Link>

                    {user.role !== 'customer' && (
                      <Link href="/admin" className="block px-4 py-2.5 bg-secondary text-white font-semibold hover:opacity-90 rounded mt-2">
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full mt-3 bg-red-500 text-white px-4 py-2.5 rounded font-medium hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 px-4">
                    <Link href="/auth/login" className="block bg-secondary text-white px-4 py-2.5 rounded text-center font-medium hover:opacity-90">
                      Login
                    </Link>
                    <Link href="/auth/signup" className="block bg-white text-primary px-4 py-2.5 rounded text-center font-medium border-2 border-primary hover:bg-gray-50">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Floating Banner Carousel */}
      {banners.length > 0 && (
        <div className="relative h-64 md:h-80 bg-gray-200 overflow-hidden">
          <div className="relative h-full">
            {banners.map((banner, idx) => (
              <div
                key={banner._id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  idx === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">{banner.title}</h2>
                    <p className="text-lg md:text-xl mb-4">{banner.description}</p>
                    {banner.link && (
                      <Link href={banner.link} className="bg-secondary text-white px-6 py-2 rounded font-semibold hover:opacity-90">
                        Shop Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Banner Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className={`w-3 h-3 rounded-full transition ${
                    idx === currentBannerIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-secondary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading amazing products...</p>
          </div>
        ) : (
          <>
            {/* Product Categories Carousel */}
            {categories.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  <button
                    onClick={() => handleCategoryFilter('')}
                    className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${
                      selectedCategory === ''
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryFilter(category._id)}
                      className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${
                        selectedCategory === category._id
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shop by Gender */}
            <div className="mb-12 flex gap-3">
              {['male', 'female', 'unisex'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => handleGenderFilter(gender)}
                  className={`px-6 py-2 rounded-lg font-semibold capitalize transition ${
                    selectedGender === gender
                      ? 'bg-secondary text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>

            {/* Best Sellers Carousel */}
            {bestSellers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Sellers</h2>
                <div className="relative">
                  <div className="overflow-hidden">
                    <div className="transition-transform duration-500" style={{ transform: `translateX(-${bestSellerIndex * 100}%)` }}>
                      <div className="flex">
                        {bestSellers.map((product) => (
                          <div key={product._id} className="w-full flex-shrink-0">
                            <ProductCardLarge product={product} isWishlisted={wishlist.has(product._id)} onWishlistToggle={() => toggleWishlist(product._id)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={() => setBestSellerIndex((prev) => (prev - 1 + bestSellers.length) % bestSellers.length)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-primary text-white p-2 rounded-full hover:opacity-90"
                  >
                    <ChevronRight size={24} className="rotate-180" />
                  </button>
                  <button
                    onClick={() => setBestSellerIndex((prev) => (prev + 1) % bestSellers.length)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-primary text-white p-2 rounded-full hover:opacity-90"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            )}

            {/* All Products */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Products</h2>
              {products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">No products found</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedGender('');
                      fetchProducts();
                    }}
                    className="bg-primary text-white px-6 py-2 rounded font-semibold hover:opacity-90"
                  >
                    View All Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Ziya</h3>
              <p className="text-gray-400 text-sm">Premium lifestyle products for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/stores" className="hover:text-white">Store Locator</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex gap-2"><Phone size={16} /> +91-XXX-XXX-XXXX</li>
                <li className="flex gap-2"><Mail size={16} /> support@ziya.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 Ziya Creations. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, isWishlisted, onWishlistToggle }: any) {
  const discount = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group flex flex-col h-full">
      <Link href={`/products/${product.slug}`} className="block relative flex-shrink-0">
        <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <div className="text-gray-400">No Image</div>
          )}
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-secondary text-white px-2 py-1 rounded text-xs font-bold">
              {discount}% OFF
            </div>
          )}
        </div>
      </Link>

      <button
        onClick={onWishlistToggle}
        className="absolute top-3 left-3 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
      >
        <Heart size={18} className={`transition ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
      </button>

      <Link href={`/products/${product.slug}`} className="flex-1 p-4 flex flex-col">
        <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 mb-3 group-hover:text-primary transition">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          {product.discountedPrice ? (
            <>
              <span className="text-lg font-bold text-primary">₹{product.discountedPrice.toLocaleString()}</span>
              <span className="text-sm text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <span className="text-yellow-500">★</span>
          <span className="text-sm font-medium text-gray-900">{product.rating.toFixed(1)}</span>
          {product.reviewCount > 0 && <span className="text-xs text-gray-500">({product.reviewCount})</span>}
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button className="w-full bg-secondary text-white py-2 rounded font-semibold hover:opacity-90 transition text-sm">
          View Details
        </button>
      </div>
    </div>
  );
}

function ProductCardLarge({ product, isWishlisted, onWishlistToggle }: any) {
  const discount = product.discountedPrice ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row h-80 md:h-96">
      <Link href={`/products/${product.slug}`} className="flex-1 relative overflow-hidden group">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">No Image</div>
        )}
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded text-sm font-bold">
            {discount}% OFF
          </div>
        )}
        <button onClick={onWishlistToggle} className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg">
          <Heart size={20} className={`transition ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </Link>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-primary transition">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm mb-4">{product.reviewCount} reviews</p>
        </div>

        <div className="flex items-center gap-3 mb-4">
          {product.discountedPrice ? (
            <>
              <span className="text-3xl font-bold text-primary">₹{product.discountedPrice.toLocaleString()}</span>
              <span className="text-lg text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-900">{product.rating.toFixed(1)}</span>
        </div>

        <Link href={`/products/${product.slug}`} className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:opacity-90 transition text-center">
          Shop Now
        </Link>
      </div>
    </div>
  );
}
