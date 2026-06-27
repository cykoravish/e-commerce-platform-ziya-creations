'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Trash2, Edit, Plus, X } from 'lucide-react';
import axios from 'axios';

interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
}

export default function AdminCoupons() {
  const { user, loading, isAdmin, authToken } = useAuth();
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as const,
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    usageLimit: 0,
    expiryDate: '',
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    if (user && authToken) {
      fetchCoupons();
    }
  }, [user, authToken]);

  const fetchCoupons = async () => {
    try {
      setPageLoading(true);
      const response = await axios.get('/api/admin/coupons', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data.statusCode === 'SUCCESS') {
        setCoupons(response.data.data || []);
      }
    } catch (err) {
      console.error('[v0] Failed to fetch coupons:', err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle number fields - remove leading zeros and parse decimals
    if (name === 'discountValue' || name === 'minOrderValue' || name === 'maxDiscount' || name === 'usageLimit') {
      // Allow empty string for clearing
      if (value === '') {
        setFormData((prev) => ({ ...prev, [name]: 0 }));
      } else {
        // Remove leading zeros but keep decimals
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          setFormData((prev) => ({ ...prev, [name]: numValue }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update coupon
        const response = await axios.patch(
          `/api/admin/coupons/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        if (response.data.statusCode === 'SUCCESS') {
          fetchCoupons();
          setShowForm(false);
          setEditingId(null);
        }
      } else {
        // Create coupon
        const response = await axios.post('/api/admin/coupons/create', formData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.data.statusCode === 'CREATED') {
          fetchCoupons();
          setShowForm(false);
        }
      }

      // Reset form
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderValue: 0,
        maxDiscount: 0,
        usageLimit: 0,
        expiryDate: '',
      });
    } catch (err: any) {
      console.error('[v0] Failed to save coupon:', err);
      alert(err.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit || 0,
      expiryDate: coupon.expiryDate.split('T')[0],
    });
    setEditingId(coupon._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await axios.delete(`/api/admin/coupons/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data.statusCode === 'SUCCESS') {
        fetchCoupons();
      }
    } catch (err) {
      console.error('[v0] Failed to delete coupon:', err);
      alert('Failed to delete coupon');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: 0,
      maxDiscount: 0,
      usageLimit: 0,
      expiryDate: '',
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Coupons Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <Plus size={20} />
            {showForm ? 'Cancel' : 'Add Coupon'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Coupon' : 'Create New Coupon'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g., SUMMER20"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!!editingId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Discount Type *</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="text"
                    name="discountValue"
                    value={formData.discountValue === 0 ? '' : formData.discountValue}
                    onChange={handleInputChange}
                    placeholder="Enter value"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Min Order Value (₹) *</label>
                  <input
                    type="text"
                    name="minOrderValue"
                    value={formData.minOrderValue === 0 ? '' : formData.minOrderValue}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Max Discount (₹)</label>
                  <input
                    type="text"
                    name="maxDiscount"
                    value={formData.maxDiscount === 0 ? '' : formData.maxDiscount}
                    onChange={handleInputChange}
                    placeholder="Leave blank for no limit"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Usage Limit</label>
                  <input
                    type="text"
                    name="usageLimit"
                    value={formData.usageLimit === 0 ? '' : formData.usageLimit}
                    onChange={handleInputChange}
                    placeholder="Leave blank for unlimited"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Summer sale - 20% off on all products"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
                >
                  {editingId ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Coupons List */}
        {pageLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">No coupons found</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Create First Coupon
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div key={coupon._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{coupon.code}</p>
                    <p className="text-sm text-gray-600">{coupon.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-all"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-semibold">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Min Order:</span>
                    <span className="font-semibold">₹{coupon.minOrderValue}</span>
                  </div>
                  {coupon.maxDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Max Discount:</span>
                      <span className="font-semibold">₹{coupon.maxDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expiry:</span>
                    <span className="font-semibold">{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usage:</span>
                    <span className="font-semibold">
                      {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${coupon.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
