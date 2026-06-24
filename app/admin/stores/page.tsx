'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Trash2, Plus, MapPin } from 'lucide-react';

interface Store {
  _id: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

export default function AdminStores() {
  const { user, isAdmin } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    address: '',
    phone: '',
    email: '',
    latitude: 0,
    longitude: 0,
    openingTime: '10:00',
    closingTime: '22:00',
  });

  useEffect(() => {
    if (isAdmin) {
      fetchStores();
    }
  }, [isAdmin]);

  const fetchStores = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setStores(data.data || []);
      }
    } catch (error) {
      console.error('[v0] Fetch stores error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        fetchStores();
        setShowForm(false);
        setFormData({
          name: '',
          city: '',
          state: '',
          address: '',
          phone: '',
          email: '',
          latitude: 0,
          longitude: 0,
          openingTime: '10:00',
          closingTime: '22:00',
        });
      }
    } catch (error) {
      console.error('[v0] Create store error:', error);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading stores...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Stores</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded font-semibold hover:opacity-90"
        >
          <Plus size={20} />
          Add Store
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Store Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="md:col-span-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="md:col-span-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="time"
              placeholder="Opening Time"
              value={formData.openingTime}
              onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="time"
              placeholder="Closing Time"
              value={formData.closingTime}
              onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-2 rounded font-semibold hover:opacity-90"
              >
                Create Store
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 text-gray-900 py-2 rounded font-semibold hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div key={store._id} className="bg-white rounded shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{store.name}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={14} /> {store.city}, {store.state}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p><strong>Phone:</strong> {store.phone}</p>
              <p><strong>Email:</strong> {store.email}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-white py-2 rounded text-sm hover:opacity-90">
                Edit
              </button>
              <button className="bg-red-500 text-white px-3 py-2 rounded hover:opacity-90">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
