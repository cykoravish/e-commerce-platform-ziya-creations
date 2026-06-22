'use client';

import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link href="/" className="text-primary hover:underline mb-4 inline-block font-medium">
          ← Back to Shopping
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {items.length === 0 ? (
              <div className="bg-white rounded border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-600 text-lg mb-6">Your cart is empty. Start shopping!</p>
                <Link
                  href="/"
                  className="inline-block px-8 py-3 bg-primary text-white rounded font-semibold hover:opacity-90 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={item.productId} className="bg-white rounded border border-gray-200 p-4 hover:shadow-md transition">
                    <div className="flex gap-4">
                      {item.image && (
                        <div className="w-24 h-24 bg-gray-100 rounded border border-gray-200 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <Link href={`/products/${item.slug}`} className="font-semibold text-gray-800 hover:text-primary transition line-clamp-2">
                          {item.name}
                        </Link>
                        <p className="text-primary font-bold text-lg mt-1">₹{item.price}</p>
                        <p className="text-xs text-gray-500 mt-1">Item {idx + 1}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.productId, item.quantity - 1);
                              }
                            }}
                            className="px-3 py-1 hover:bg-gray-100 text-gray-700 font-bold"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 border-l border-r border-gray-300 font-semibold min-w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 text-gray-700 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-secondary text-sm font-medium hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">Price Details</h2>
              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Price ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span className="font-medium">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Discount</span>
                  <span className="text-secondary font-medium">No discount</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg text-gray-800">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="w-full px-6 py-3 bg-secondary text-white font-bold rounded hover:opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
              <Link
                href="/"
                className="block text-center mt-4 text-primary font-medium hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
