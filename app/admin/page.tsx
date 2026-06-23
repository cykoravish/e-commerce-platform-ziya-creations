'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import {
  BarChart3,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Tag,
  Settings,
  Crown,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, loading, isAdmin, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-secondary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );

  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Professional Navbar */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary via-blue-600 to-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="text-2xl font-bold text-white">Ziya</div>
              <div className="text-xs text-secondary font-bold">Admin</div>
            </Link>

            {/* Super Admin Badge - Center */}
            <div className="hidden md:flex items-center gap-3">
              {isSuperAdmin ? (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition">
                  <Crown size={18} className="text-white" />
                  <span className="font-bold text-white text-sm">SUPER ADMIN</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full shadow-lg">
                  <Settings size={18} className="text-white" />
                  <span className="font-bold text-white text-sm">ADMIN</span>
                </div>
              )}
            </div>

            {/* Right Side - User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-blue-100">{user?.email}</p>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition transform hover:scale-105"
              >
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-blue-400 pt-3 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2 rounded text-white font-bold text-sm">
                <Crown size={16} />
                {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            {isSuperAdmin ? (
              <>
                <Crown size={18} className="text-yellow-500" />
                You have full platform access as Super Admin
              </>
            ) : (
              <>
                <Settings size={18} className="text-secondary" />
                You have admin access
              </>
            )}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Package className="w-8 h-8 text-primary" />}
            title="Total Products"
            value="0"
            trend="+0%"
            color="blue"
          />
          <StatCard
            icon={<ShoppingCart className="w-8 h-8 text-green-500" />}
            title="Total Orders"
            value="0"
            trend="+0%"
            color="green"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8 text-orange-500" />}
            title="Revenue"
            value="₹0"
            trend="+0%"
            color="orange"
          />
          <StatCard
            icon={<Users className="w-8 h-8 text-purple-500" />}
            title="Active Users"
            value="0"
            trend="+0%"
            color="purple"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions - Full Width on Mobile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Management Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 size={24} className="text-primary" />
                Management Center
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ActionCard
                  href="/admin/products"
                  icon={<Package size={24} />}
                  title="Manage Products"
                  description="Add, edit, and delete products"
                  color="bg-blue-50 hover:bg-blue-100 border-blue-200"
                />
                <ActionCard
                  href="/admin/categories"
                  icon={<Tag size={24} />}
                  title="Manage Categories"
                  description="Create and organize product categories"
                  color="bg-purple-50 hover:bg-purple-100 border-purple-200"
                />
                <ActionCard
                  href="/admin/orders"
                  icon={<ShoppingCart size={24} />}
                  title="View Orders"
                  description="Track and manage customer orders"
                  color="bg-green-50 hover:bg-green-100 border-green-200"
                />
                <ActionCard
                  href="/admin/coupons"
                  icon={<Tag size={24} />}
                  title="Manage Coupons"
                  description="Create and apply discount coupons"
                  color="bg-orange-50 hover:bg-orange-100 border-orange-200"
                />
              </div>
            </div>

            {/* Super Admin Only Section */}
            {isSuperAdmin && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 border border-yellow-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Crown size={24} className="text-yellow-500" />
                  Super Admin Controls
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <ActionCard
                    href="/admin/manage-admins"
                    icon={<Users size={24} />}
                    title="Manage Admins"
                    description="Create and manage admin user accounts"
                    color="bg-white hover:bg-gray-50 border-yellow-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Admin Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b-2 border-primary">
                Account Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    {isSuperAdmin && <p className="text-xs text-yellow-600 font-bold">SUPER ADMIN</p>}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-gray-600 font-medium mb-1">Email</p>
                    <p className="text-gray-900 break-all">{user?.email}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-gray-600 font-medium mb-1">Phone</p>
                    <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-gray-600 font-medium mb-1">Role</p>
                    <p className="text-gray-900 capitalize font-semibold">
                      {user?.role.replace('_', ' ')}
                    </p>
                  </div>
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
        </div>
      </main>
    </div>
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
  const bgClass =
    color === 'blue'
      ? 'bg-blue-50 border-blue-200'
      : color === 'green'
        ? 'bg-green-50 border-green-200'
        : color === 'orange'
          ? 'bg-orange-50 border-orange-200'
          : 'bg-purple-50 border-purple-200';

  return (
    <div className={`${bgClass} border rounded-lg p-6 hover:shadow-lg transition`}>
      <div className="flex items-start justify-between mb-3">{icon}</div>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-green-600 font-semibold mt-2">{trend} from last month</p>
    </div>
  );
}

function ActionCard({
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
      <div
        className={`${color} border rounded-lg p-4 transition transform hover:scale-105 cursor-pointer group`}
      >
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
