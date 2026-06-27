'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { Package, Calendar, DollarSign, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface Order {
  _id: string;
  orderId: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function Orders() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && token) {
      fetchOrders();
    }
  }, [user, token]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await fetch(`/api/user/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('[v0] Fetch orders error:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (loading || loadingOrders) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Package size={28} className="text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600">Track and manage all your purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6 text-lg">You haven&apos;t placed any orders yet</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/orders/${order.orderId}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Order</p>
                        <p className="text-lg md:text-xl font-bold text-gray-900">#{order.orderId}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar size={16} />
                        <p>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <DollarSign size={18} className="text-green-600" />
                        <p className="text-2xl md:text-3xl font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-3 w-full sm:w-auto">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status === 'delivered' ? <CheckCircle size={14} /> : <Clock size={14} />}
                        <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        <span>{order.paymentStatus === 'completed' ? '✓ Paid' : 'Payment'}</span>
                      </div>
                    </div>
                    <div className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors flex items-center gap-1">
                      View Details <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
