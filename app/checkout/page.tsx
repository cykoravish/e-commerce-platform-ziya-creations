'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import axios from 'axios';

interface Address {
  _id: string;
  name: string;
  street: string;
  city: string;
  pincode: string;
  phone?: string;
  state?: string;
  isDefault: boolean;
}

function AddressForm({
  onSubmit,
  onCancel,
  userEmail,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  userEmail?: string;
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: userEmail || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home',
    isDefault: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.street || !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-gray-50 space-y-4">
      <h3 className="font-semibold mb-4">Add New Address</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email address"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address *</label>
        <textarea
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="Street address"
          rows={2}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="w-4 h-4 rounded"
        />
        <label htmlFor="isDefault" className="ml-2 text-sm">
          Set as default address
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user, authToken } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxPercentage, setTaxPercentage] = useState(18);
  const [codAdvance, setCodAdvance] = useState(500);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (!user || !authToken) {
      router.push('/auth/login');
      return;
    }
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
    fetchAddresses();
    fetchSettings();
  }, [user, items, router, authToken]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setTaxEnabled(data.data.taxEnabled);
        setTaxPercentage(data.data.taxPercentage);
        setCodAdvance(data.data.codAdvanceAmount);
      }
    } catch (error) {
      console.error('[v0] Fetch settings error:', error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      setCouponError('');
      const taxAmount = taxEnabled ? (total * (taxPercentage / 100)) : 0;
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal: total + taxAmount }),
      });

      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setAppliedCoupon(data.data);
        setCouponCode('');
      } else {
        setCouponError(data.message || 'Invalid coupon');
      }
    } catch (error) {
      setCouponError('Failed to validate coupon');
      console.error('[v0] Coupon error:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/addresses`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.statusCode === 'SUCCESS' && data.data) {
        setAddresses(data.data);
        const defaultAddr = data.data.find((a: Address) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr._id);
        }
      } else {
        setError(data.message || 'Failed to load addresses');
      }
    } catch (error) {
      console.error('[v0] Fetch addresses error:', error);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (formData: any) => {
    try {
      console.log('[v0] Adding address with data:', formData);
      const response = await fetch(
        `/api/user/addresses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log('[v0] Add address response:', data);

      if (data.statusCode === 'CREATED') {
        setSuccess('Address added successfully!');
        setShowAddressForm(false);
        fetchAddresses();
      } else {
        setError(data.message || 'Failed to add address');
      }
    } catch (err) {
      console.error('[v0] Add address error:', err);
      setError('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select an address');
      return;
    }

    setError('');
    setSuccess('');
    setOrderLoading(true);

    try {
      // Create order in backend
      const orderResponse = await fetch(
        `/api/orders/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
            address: selectedAddress,
            coupon: appliedCoupon?.code || null,
            discountAmount: appliedCoupon?.discount || 0,
            taxAmount: taxEnabled ? (total * (taxPercentage / 100)) : 0,
            taxEnabled: taxEnabled,
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        setError(orderData.message || 'Failed to place order');
        setOrderLoading(false);
        return;
      }

      if (orderData.statusCode === 'CREATED' && orderData.data) {
        const orderId = orderData.data.order?.orderId || orderData.data.orderId;
        const taxAmount = taxEnabled ? (total * (taxPercentage / 100)) : 0;
        const subtotalWithTax = total + taxAmount;
        // Use coupon discount if applied, otherwise use subtotal with tax
        const finalTotal = appliedCoupon?.finalAmount || subtotalWithTax;

        if (paymentMethod === 'cod') {
          // Cash on Delivery - charge advance
          const advanceAmount = Math.round(codAdvance * 100); // Convert to paise
          try {
            const rzpOrderResponse = await axios.post('/api/payment/create-order', {
              amount: advanceAmount,
              orderId: orderId,
              userEmail: user.email,
              userName: user.name,
            });

            const razorpayOrder = rzpOrderResponse.data.data;
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
              const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: advanceAmount,
                currency: 'INR',
                name: 'Ziya Creations',
                description: `Order #${orderId} - COD Advance (₹${codAdvance})`,
                order_id: razorpayOrder.id,
                handler: async (response: any) => {
                  try {
                    const verifyResponse = await axios.post('/api/orders/verify-payment', {
                      orderId: orderId,
                      razorpayOrderId: razorpayOrder.id,
                      razorpayPaymentId: response.razorpay_payment_id,
                      razorpaySignature: response.razorpay_signature,
                      paymentMethod: 'cod',
                    });

                    if (verifyResponse.data.statusCode === 'SUCCESS') {
                      setSuccess('Advance payment successful! Order confirmed.');
                      setTimeout(() => {
                        clearCart();
                        router.push(`/orders/${orderId}`);
                      }, 1500);
                    } else {
                      setError('Payment verification failed. Please contact support.');
                    }
                  } catch (err: any) {
                    setError(err.response?.data?.message || 'Payment verification failed');
                  }
                  setOrderLoading(false);
                },
                modal: {
                  ondismiss: () => {
                    setOrderLoading(false);
                    setError('Payment cancelled. Please try again if you wish to proceed.');
                  },
                },
                prefill: {
                  name: user.name,
                  email: user.email,
                  contact: user.phone || '',
                },
                theme: {
                  color: '#0066cc',
                },
              };

              const rzp = new (window as any).Razorpay(options);
              rzp.open();
            };
            document.body.appendChild(script);
            return;
          } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create advance payment');
            setOrderLoading(false);
            return;
          }
        }

        // Razorpay full payment
        const totalAmount = Math.round((finalTotal) * 100); // Razorpay expects amount in paise

        // Create Razorpay order
        try {
          const rzpOrderResponse = await axios.post('/api/payment/create-order', {
            amount: totalAmount,
            orderId: orderId,
            userEmail: user.email,
            userName: user.name,
          });

          const razorpayOrder = rzpOrderResponse.data.data;

          // Open Razorpay checkout
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => {
            let paymentHandled = false;

            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
              amount: totalAmount,
              currency: 'INR',
              name: 'Ziya Creations',
              description: `Order #${orderId}`,
              order_id: razorpayOrder.id,
              handler: async (response: any) => {
                paymentHandled = true;
                try {
                  // Verify payment
                  const verifyResponse = await axios.post('/api/payment/verify', {
                    orderId: orderId,
                    razorpayOrderId: razorpayOrder.id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  });

                  if (verifyResponse.data.statusCode === 'SUCCESS') {
                    setSuccess('Payment successful! Order confirmed.');
                    setTimeout(() => {
                      clearCart();
                      router.push(`/orders/${orderId}`);
                    }, 1500);
                  } else {
                    setError('Payment verification failed. Please contact support.');
                  }
                } catch (err: any) {
                  setError(err.response?.data?.message || 'Payment verification failed');
                }
                setOrderLoading(false);
              },
              modal: {
                ondismiss: () => {
                  if (!paymentHandled) {
                    setOrderLoading(false);
                    setError('Payment cancelled. Please try again if you wish to proceed.');
                  }
                },
              },
              prefill: {
                name: user.name,
                email: user.email,
                contact: user.phone || '',
              },
              theme: {
                color: '#0066cc',
              },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          };
          document.body.appendChild(script);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to create payment order');
          setOrderLoading(false);
        }
      } else {
        setError(orderData.message || 'Failed to place order');
        setOrderLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setOrderLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-secondary rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading checkout...</p>
        </div>
      </div>
    );
  }

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
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  <strong>Success:</strong> {success}
                </div>
              )}

              {showAddressForm ? (
                <AddressForm
                  onSubmit={handleAddAddress}
                  onCancel={() => setShowAddressForm(false)}
                  userEmail={user?.email || ''}
                />
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No addresses found</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
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
                    onClick={() => setShowAddressForm(true)}
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
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                  <input
                    type="radio"
                    id="razorpay"
                    name="payment"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="cursor-pointer"
                  />
                  <label htmlFor="razorpay" className="cursor-pointer flex-1">
                    <p className="font-semibold">Razorpay</p>
                    <p className="text-sm text-gray-600">Pay securely using Razorpay</p>
                  </label>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="cursor-pointer"
                  />
                  <label htmlFor="cod" className="cursor-pointer flex-1">
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay ₹{codAdvance} advance online, rest on delivery</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Have a coupon code?</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-600 text-xs mt-2">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-green-600 text-xs mt-2">✓ Coupon applied: Save ₹{appliedCoupon.discount}</p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>
                {taxEnabled && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({taxPercentage}%)</span>
                    <span className="font-semibold">₹{(total * (taxPercentage / 100)).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{appliedCoupon?.finalAmount ? appliedCoupon.finalAmount.toFixed(2) : (total + (taxEnabled ? total * (taxPercentage / 100) : 0)).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={orderLoading || !selectedAddress}
                className={`w-full px-4 py-3 font-bold rounded-lg transition-all ${
                  orderLoading || !selectedAddress
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                }`}
              >
                {orderLoading ? 'Processing...' : 'Place Order'}
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
