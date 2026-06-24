'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Trash2, Plus } from 'lucide-react';

interface Banner {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminBanners() {
  const { user, isAdmin } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    displayOrder: 0,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchBanners();
    }
  }, [isAdmin]);

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`);
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setBanners(data.data || []);
      }
    } catch (error) {
      console.error('[v0] Fetch banners error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        fetchBanners();
        setShowForm(false);
        setFormData({ title: '', description: '', imageUrl: '', link: '', displayOrder: 0 });
      }
    } catch (error) {
      console.error('[v0] Create banner error:', error);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading banners...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Banners</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded font-semibold hover:opacity-90"
        >
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
            <input
              type="url"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="url"
              placeholder="Link (optional)"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Display Order"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-2 rounded font-semibold hover:opacity-90"
              >
                Create Banner
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
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white rounded shadow-md overflow-hidden">
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2">{banner.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{banner.description}</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary text-white py-2 rounded text-sm hover:opacity-90">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-2 rounded hover:opacity-90">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
