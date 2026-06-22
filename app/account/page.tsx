'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

export default function Account() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/account"
                  className="block px-4 py-2 bg-blue-100 text-blue-700 rounded font-semibold"
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="block px-4 py-2 hover:bg-gray-100 rounded"
                >
                  My Orders
                </Link>
                <Link
                  href="/account/addresses"
                  className="block px-4 py-2 hover:bg-gray-100 rounded"
                >
                  Addresses
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded font-semibold"
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Account Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900">{user.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <p className="text-gray-900 capitalize">{user.role.replace('_', ' ')}</p>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    <Link
                      href="/orders"
                      className="block px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                    >
                      View My Orders
                    </Link>
                    <Link
                      href="/account/addresses"
                      className="block px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                    >
                      Manage Addresses
                    </Link>
                    <Link
                      href="/"
                      className="block px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
