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
    <div className="min-h-screen bg-white">
      <div className="bg-primary shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <div className="text-sm text-white">
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
          <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/admin/products"
                className="block w-full px-4 py-2 bg-primary text-white rounded hover:opacity-90 text-center font-medium"
              >
                Manage Products
              </Link>
              <Link
                href="/admin/categories"
                className="block w-full px-4 py-2 bg-primary text-white rounded hover:opacity-90 text-center font-medium"
              >
                Manage Categories
              </Link>
              <Link
                href="/admin/orders"
                className="block w-full px-4 py-2 bg-primary text-white rounded hover:opacity-90 text-center font-medium"
              >
                View Orders
              </Link>
              <Link
                href="/admin/coupons"
                className="block w-full px-4 py-2 bg-secondary text-white rounded hover:opacity-90 text-center font-medium"
              >
                Manage Coupons
              </Link>
              {user?.role === 'super_admin' && (
                <Link
                  href="/admin/manage-admins"
                  className="block w-full px-4 py-2 bg-secondary text-white rounded hover:opacity-90 text-center font-medium"
                >
                  Manage Admins
                </Link>
              )}
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Admin Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Name:</span> <span className="text-gray-900">{user?.name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Email:</span> <span className="text-gray-900">{user?.email}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-900">{user?.phone}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Role:</span>{' '}
                <span className="capitalize text-gray-900 font-medium">{user?.role.replace('_', ' ')}</span>
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
    <div className="bg-white border border-gray-200 rounded p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
