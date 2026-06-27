'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { Star, Send } from 'lucide-react';

interface OrderItem {
  product: { _id: string; name: string; images: string[] };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function OrderDetail() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [reviewingProductId, setReviewingProductId] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && token && orderId) {
      fetchOrder();
    }
  }, [user, token, orderId]);

  const fetchOrder = async () => {
    try {
      setLoadingOrder(true);
      const response = await fetch(`/api/user/orders?orderId=${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setOrder(data.data[0] || null);
      }
    } catch (error) {
      console.error('[v0] Fetch order error:', error);
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleSubmitReview = async (productId: string) => {
    if (!reviewData.title.trim() || !reviewData.comment.trim()) {
      setReviewMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          orderId: order?._id,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
        }),
      });

      const data = await response.json();
      if (data.statusCode === 'CREATED') {
        setReviewMessage({ type: 'success', text: 'Review submitted successfully!' });
        setReviewingProductId(null);
        setReviewData({ rating: 5, title: '', comment: '' });
        setTimeout(() => setReviewMessage(null), 3000);
      } else {
        setReviewMessage({ type: 'error', text: data.message || 'Failed to submit review' });
      }
    } catch (error) {
      setReviewMessage({ type: 'error', text: 'Error submitting review' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || loadingOrder) return <div className="p-8">Loading...</div>;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link href="/orders" className="text-blue-600 hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/orders" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Orders
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.orderId}</h1>
              <p className="text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()} at{' '}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">₹{order.total.toFixed(2)}</p>
              <div className="flex gap-2 mt-2 justify-end">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Order Items</h2>
          <div className="space-y-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="border-b pb-6 last:border-b-0">
                <div className="flex gap-4 mb-4">
                  {item.product.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-lg font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>

                {order.status === 'delivered' && (
                  <div className="mt-4">
                    {reviewingProductId === item.product._id ? (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-2">Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setReviewData({ ...reviewData, rating: star })}
                                className="p-1"
                              >
                                <Star
                                  size={24}
                                  className={
                                    star <= reviewData.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Review Title</label>
                          <input
                            type="text"
                            value={reviewData.title}
                            onChange={(e) =>
                              setReviewData({ ...reviewData, title: e.target.value })
                            }
                            placeholder="e.g., Great product!"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Review Comment</label>
                          <textarea
                            value={reviewData.comment}
                            onChange={(e) =>
                              setReviewData({ ...reviewData, comment: e.target.value })
                            }
                            placeholder="Share your experience..."
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSubmitReview(item.product._id)}
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Send size={18} />
                            {submitting ? 'Submitting...' : 'Submit Review'}
                          </button>
                          <button
                            onClick={() => {
                              setReviewingProductId(null);
                              setReviewData({ rating: 5, title: '', comment: '' });
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>

                        {reviewMessage && (
                          <div
                            className={`p-2 rounded text-sm ${
                              reviewMessage.type === 'success'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {reviewMessage.text}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setReviewingProductId(item.product._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Write Review
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
