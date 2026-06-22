'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, loading, isAdmin, router]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="text-sm text-gray-600">
              Welcome, {user?.name}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Dashboard Cards */}
          <DashboardCard title="Total Products" value="0" icon="📦" />
          <DashboardCard title="Total Orders" value="0" icon="🛒" />
          <DashboardCard title="Total Revenue" value="₹0" icon="💰" />
          <DashboardCard title="Active Users" value="0" icon="👥" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/admin/products"
                className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
              >
                Manage Products
              </Link>
              <Link
                href="/admin/categories"
                className="block w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
              >
                Manage Categories
              </Link>
              <Link
                href="/admin/orders"
                className="block w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-center"
              >
                View Orders
              </Link>
              <Link
                href="/admin/coupons"
                className="block w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-center"
              >
                Manage Coupons
              </Link>
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Admin Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Name:</span> {user?.name}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {user?.email}
              </div>
              <div>
                <span className="font-semibold">Phone:</span> {user?.phone}
              </div>
              <div>
                <span className="font-semibold">Role:</span>{' '}
                <span className="capitalize">{user?.role.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
