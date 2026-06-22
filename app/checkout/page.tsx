'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

interface Address {
  _id: string;
  name: string;
  street: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
    fetchAddresses();
  }, [user, items, router]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setAddresses(data.data);
        const defaultAddr = data.data.find((a: Address) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr._id);
        }
      }
    } catch (error) {
      console.error('[v0] Fetch addresses error:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select an address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Create order
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
            address: selectedAddress,
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (orderData.statusCode === 'CREATED') {
        // In production, redirect to Razorpay checkout
        // For now, simulate payment success
        setTimeout(() => {
          clearCart();
          router.push(`/orders/${orderData.data.order.orderId}`);
        }, 1000);
      } else {
        setError(orderData.message || 'Failed to place order');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No addresses found</p>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add New Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddress === address._id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-semibold">{address.name}</p>
                        <p className="text-sm text-gray-600">
                          {address.street}, {address.city} - {address.pincode}
                        </p>
                        {address.isDefault && (
                          <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm font-semibold"
                  >
                    + Add New Address
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <input
                  type="radio"
                  id="razorpay"
                  name="payment"
                  defaultChecked
                  className="cursor-pointer"
                />
                <label htmlFor="razorpay" className="cursor-pointer flex-1">
                  <p className="font-semibold">Razorpay</p>
                  <p className="text-sm text-gray-600">Pay securely using Razorpay</p>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-semibold">₹{(total * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{(total * 1.18).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress}
                className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              <Link
                href="/cart"
                className="block text-center mt-3 text-blue-600 hover:underline text-sm"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
