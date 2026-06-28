'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

export default function SettingsPage() {
  const { user, authToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    storeName: 'Ziya Creations',
    email: 'support@ziyacreations.com',
    phone: '+91 9876-543-210',
    address: 'Ziya Creations HQ',
    city: 'India',
  });
  const [taxSettings, setTaxSettings] = useState({
    taxEnabled: true,
    taxPercentage: 18,
    codAdvanceAmount: 500,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTaxSettings();
  }, []);

  const fetchTaxSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setTaxSettings(data.data);
      }
    } catch (error) {
      console.error('[v0] Fetch settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaxChange = (field: string, value: any) => {
    setTaxSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Simulate saving store settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTaxSettings = async () => {
    if (!user || user.role !== 'super_admin') {
      setMessage('Only superadmin can change tax settings');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(taxSettings),
      });

      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setMessage('Tax settings updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to update tax settings');
      }
    } catch (error) {
      console.error('[v0] Save tax settings error:', error);
      setMessage('Error updating tax settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      {saved && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          Settings saved successfully!
        </div>
      )}

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Store Settings */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Store Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Store Name</label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-secondary disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
        </div>

        {/* Tax & Payment Settings */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tax & Payment Settings</h2>
          {user?.role === 'super_admin' ? (
            <div className="space-y-6">
              {/* GST Toggle */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-900">Enable GST Tax</label>
                  <button
                    onClick={() => handleTaxChange('taxEnabled', !taxSettings.taxEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      taxSettings.taxEnabled ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        taxSettings.taxEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-600">
                  {taxSettings.taxEnabled ? 'GST is enabled' : 'GST is disabled'}
                </p>
              </div>

              {/* Tax Percentage */}
              {taxSettings.taxEnabled && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tax Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={taxSettings.taxPercentage}
                    onChange={(e) => handleTaxChange('taxPercentage', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-gray-600 mt-1">Current: {taxSettings.taxPercentage}%</p>
                </div>
              )}

              {/* COD Advance Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  COD Advance Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={taxSettings.codAdvanceAmount}
                  onChange={(e) => handleTaxChange('codAdvanceAmount', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-gray-600 mt-1">Current: ₹{taxSettings.codAdvanceAmount}</p>
              </div>

              <button
                onClick={handleSaveTaxSettings}
                disabled={saving}
                className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-secondary disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Tax Settings'}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Tax settings can only be managed by Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
