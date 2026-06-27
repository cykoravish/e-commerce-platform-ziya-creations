'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, Plus, Edit2, Trash2 } from 'lucide-react';

interface ShipLocation {
  _id: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  shipRocketAPIKey: string;
  isActive: boolean;
  createdAt: string;
}

export default function ShipManagement() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [locations, setLocations] = useState<ShipLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    shipRocketAPIKey: '',
    isActive: true,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'super_admin' && user.role !== 'admin')) {
      router.push('/admin');
      return;
    }
    fetchLocations();
  }, [user, router]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ship-locations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setLocations(data.data || []);
      }
    } catch (error) {
      console.error('[v0] Fetch locations error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `/api/admin/ship-locations/${editingId}`
        : '/api/admin/ship-locations';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setMessage(editingId ? 'Location updated successfully!' : 'Location added successfully!');
        resetForm();
        fetchLocations();
      } else {
        setMessage(data.message || 'Failed to save location');
      }
    } catch (error) {
      setMessage('Error saving location');
      console.error('[v0] Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const response = await fetch(`/api/admin/ship-locations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setMessage('Location deleted successfully!');
        fetchLocations();
      } else {
        setMessage(data.message || 'Failed to delete location');
      }
    } catch (error) {
      setMessage('Error deleting location');
      console.error('[v0] Error:', error);
    }
  };

  const handleEdit = (location: ShipLocation) => {
    setFormData({
      name: location.name,
      address: location.address,
      city: location.city,
      pincode: location.pincode,
      phone: location.phone,
      shipRocketAPIKey: location.shipRocketAPIKey,
      isActive: location.isActive,
    });
    setEditingId(location._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      pincode: '',
      phone: '',
      shipRocketAPIKey: '',
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Truck size={48} className="text-primary mx-auto mb-4 animate-bounce" />
          <p className="text-gray-600">Loading shipping locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Shipping Locations</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Location'}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes('success')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Shipping Location</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Location Name (e.g., Patna)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="ShipRocket API Key"
                value={formData.shipRocketAPIKey}
                onChange={(e) => setFormData({ ...formData, shipRocketAPIKey: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm">Active Location</label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {editingId ? 'Update' : 'Add'} Location
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {locations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Truck size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No shipping locations configured yet</p>
          </div>
        ) : (
          locations.map((location) => (
            <div key={location._id} className="bg-white rounded-lg shadow p-6 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{location.name}</h3>
                  {location.isActive && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{location.address}, {location.city} - {location.pincode}</p>
                <p className="text-gray-600 text-sm">Phone: {location.phone}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(location)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(location._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
