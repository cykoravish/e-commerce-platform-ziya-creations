'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, ArrowLeft, ShoppingCart, Heart, Phone, Mail } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

interface CartItem {
  productId: string;
  name: string;
  slug?: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + ((item.discountedPrice || item.price) * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-secondary rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading cart...</p>
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
              <Link href="/wishlist" className="text-white hover:text-secondary transition">
                <Heart size={22} />
              </Link>
              <Link href="/cart" className="text-white hover:text-secondary transition font-bold">
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
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link href="/" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                {items.map((item, index) => (
                  <div key={item.productId} className={`p-6 border-b ${index === items.length - 1 ? 'border-b-0' : ''}`}>
                    <div className="flex gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <Link href={`/products/${item.slug}`} className="font-semibold text-gray-900 hover:text-primary">
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold text-primary">₹{item.price}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.productId, item.quantity - 1);
                                }
                              }}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              −
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{((item.discountedPrice || item.price) * item.quantity).toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 pb-4 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 mb-6">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-primary text-white py-3 rounded-lg font-semibold text-center hover:bg-secondary transition"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/"
                  className="block w-full mt-3 border border-primary text-primary py-2 rounded-lg text-center hover:bg-primary hover:text-white transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
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
