'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

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
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { user } = useAuth();

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
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=20`;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Ziya Creations
            </Link>
            <nav className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">{user.name}</span>
                  {user.role !== 'customer' && (
                    <Link href="/admin" className="text-sm text-blue-600 hover:underline">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/cart" className="text-sm text-blue-600 hover:underline">
                    Cart
                  </Link>
                  <Link href="/account" className="text-sm text-blue-600 hover:underline">
                    Account
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signup" className="text-sm text-blue-600 hover:underline">
                    Sign Up
                  </Link>
                  <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-4">Categories</h2>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-3 py-2 rounded ${
                    selectedCategory === ''
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category._id)}
                    className={`w-full text-left px-3 py-2 rounded ${
                      selectedCategory === category._id
                        ? 'bg-blue-500 text-white'
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
          <div className="md:col-span-3">
            {loading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    No products found
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
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square bg-gray-200 flex items-center justify-center">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <div>
              {product.discountedPrice ? (
                <>
                  <span className="text-lg font-bold text-blue-600">
                    ₹{product.discountedPrice}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ₹{product.price}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-blue-600">
                  ₹{product.price}
                </span>
              )}
            </div>
            {product.rating > 0 && (
              <span className="text-sm text-yellow-500">★ {product.rating.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
