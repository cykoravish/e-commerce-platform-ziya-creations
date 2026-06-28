'use client';

import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import {
  BarChart3,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Tag,
  Crown,
  Gift,
  Star,
  Images,
  MapPin,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-blue-100 text-sm mt-1">Manage your platform with ease</p>
            </div>
            {isSuperAdmin && (
              <div className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg">
                <Crown size={18} />
                SUPER ADMIN
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-gray-600 flex items-center gap-2">
              <Crown size={16} className="text-yellow-500" />
              You have full platform access as {isSuperAdmin ? 'Super Admin' : 'Admin'}
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<Package size={24} />}
              title="Total Products"
              value="0"
              trend="+0% from last month"
              color="bg-blue-50"
            />
            <StatCard
              icon={<ShoppingCart size={24} />}
              title="Total Orders"
              value="0"
              trend="+0% from last month"
              color="bg-green-50"
            />
            <StatCard
              icon={<TrendingUp size={24} />}
              title="Revenue"
              value="₹0"
              trend="+0% from last month"
              color="bg-orange-50"
            />
            <StatCard
              icon={<Users size={24} />}
              title="Active Users"
              value="0"
              trend="+0% from last month"
              color="bg-purple-50"
            />
          </div>

          {/* Management Center */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Management Center
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ManagementCard
                href="/admin/products"
                icon={<Package size={24} />}
                title="Manage Products"
                description="Add, edit, and delete products"
                color="bg-blue-50 border-blue-200"
              />
              <ManagementCard
                href="/admin/categories"
                icon={<Tag size={24} />}
                title="Manage Categories"
                description="Create and organize product categories"
                color="bg-purple-50 border-purple-200"
              />
              <ManagementCard
                href="/admin/orders"
                icon={<ShoppingCart size={24} />}
                title="View Orders"
                description="Track and manage customer orders"
                color="bg-green-50 border-green-200"
              />
              <ManagementCard
                href="/admin/coupons"
                icon={<Tag size={24} />}
                title="Manage Coupons"
                description="Create discount codes and promotions"
                color="bg-orange-50 border-orange-200"
              />
              <ManagementCard
                href="/admin/banners"
                icon={<Images size={24} />}
                title="Manage Banners"
                description="Upload and manage website banners"
                color="bg-pink-50 border-pink-200"
              />

              {isSuperAdmin && (
                <>
                  <ManagementCard
                    href="/admin/offers"
                    icon={<Gift size={24} />}
                    title="Manage Offers"
                    description="Create and manage promotional offers"
                    color="bg-red-50 border-red-200"
                  />
                  <ManagementCard
                    href="/admin/reviews"
                    icon={<Star size={24} />}
                    title="Manage Reviews"
                    description="Approve, edit, and display customer reviews"
                    color="bg-indigo-50 border-indigo-200"
                  />
                </>
              )}
            </div>
          </div>

          {/* Super Admin Section */}
          {isSuperAdmin && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Crown size={20} className="text-yellow-500" />
                Super Admin Controls
              </h3>
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-lg p-6">
                <Link href="/admin/manage-admins">
                  <div className="flex items-center justify-between hover:opacity-75 transition cursor-pointer">
                    <div>
                      <h4 className="font-bold text-gray-900">Manage Admin Accounts</h4>
                      <p className="text-sm text-gray-600">Create and manage admin credentials</p>
                    </div>
                    <Users size={24} className="text-primary" />
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Account Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-3">Account Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-primary font-medium uppercase">
                    {isSuperAdmin ? 'Super Admin' : 'Admin'}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600"><span className="font-semibold">Email:</span> {user?.email}</p>
                <p className="text-sm text-gray-600"><span className="font-semibold">Phone:</span> {user?.phone || 'Not provided'}</p>
              </div>
              <Link
                href="/account"
                className="block w-full text-center bg-primary text-white py-2 rounded font-medium hover:opacity-90 transition mt-4"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function StatCard({
  icon,
  title,
  value,
  trend,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  color: string;
}) {
  return (
    <div className={`${color} rounded-lg border border-gray-200 p-6 transition hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
      <p className="text-xs text-green-600 font-medium mt-3">{trend}</p>
    </div>
  );
}

function ManagementCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <div className={`${color} border rounded-lg p-4 transition transform hover:scale-105 cursor-pointer group`}>
        <div className="flex items-start gap-4">
          <div className="text-gray-700 group-hover:text-primary transition">{icon}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
