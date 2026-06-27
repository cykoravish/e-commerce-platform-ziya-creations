'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, ArrowLeft, Phone, Mail } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountedPrice?: number;
  images?: string[];
  rating?: number;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setWishlistItems(data.data || []);
        }
      } catch (error) {
        console.error('[v0] Wishlist error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/wishlist`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
    } catch (error) {
      console.error('[v0] Remove error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-secondary rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-secondary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Ziya
            </Link>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <Link href="/wishlist" className="text-white hover:text-secondary transition font-bold">
                <Heart size={22} />
              </Link>
              <Link href="/cart" className="text-white hover:text-secondary transition">
                <ShoppingCart size={22} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-6">
          <ArrowLeft size={20} />
          Back to Shopping
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-4">Your wishlist is empty</p>
            <Link href="/" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <div className="aspect-square bg-gray-100 relative group">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <Heart size={20} fill="currentColor" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-primary">₹{product.discountedPrice || product.price}</span>
                    {product.discountedPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                    )}
                  </div>
                  {product.rating && (
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-600">{product.rating}</span>
                    </div>
                  )}
                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-4 block w-full bg-primary text-white py-2 rounded text-center hover:bg-secondary transition"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Ziya Creations</h3>
              <p className="text-gray-400 text-sm">Premium lifestyle products</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/orders" className="hover:text-white">Orders</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/track-order" className="hover:text-white">Track Order</Link></li>
                <li><Link href="/stores" className="hover:text-white">Stores</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2"><Phone size={16} /> 1234567890</div>
                <div className="flex items-center gap-2"><Mail size={16} /> info@ziyacreations.com</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
            <p>&copy; 2024 Ziya Creations. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
