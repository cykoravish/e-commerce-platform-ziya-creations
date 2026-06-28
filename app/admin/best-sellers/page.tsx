'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  slug: string;
}

interface BestSeller {
  _id: string;
  productId: Product;
  displayOrder: number;
}

export default function BestSellersPage() {
  const router = useRouter();
  const { user, authToken } = useAuth();
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'super_admin') {
      router.push('/admin');
      return;
    }
    fetchBestSellers();
    fetchProducts();
  }, [user, router]);

  const fetchBestSellers = async () => {
    try {
      const response = await fetch('/api/admin/best-sellers');
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setBestSellers(data.data);
      }
    } catch (error) {
      console.error('[v0] Fetch best sellers error:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setAllProducts(data.data.products || []);
      }
    } catch (error) {
      console.error('[v0] Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBestSeller = async () => {
    if (!selectedProduct) {
      setMessage('Please select a product');
      return;
    }

    try {
      const response = await fetch('/api/admin/best-sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ productId: selectedProduct }),
      });

      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setMessage('Product added to best sellers');
        setSelectedProduct('');
        setShowAddForm(false);
        fetchBestSellers();
      } else {
        setMessage(data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('[v0] Add best seller error:', error);
      setMessage('Error adding product');
    }
  };

  const handleRemove = async (productId: string) => {
    if (!window.confirm('Remove this product from best sellers?')) return;

    try {
      const response = await fetch('/api/admin/best-sellers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      if (data.statusCode === 'SUCCESS') {
        setMessage('Product removed from best sellers');
        fetchBestSellers();
      } else {
        setMessage(data.message || 'Failed to remove product');
      }
    } catch (error) {
      console.error('[v0] Remove best seller error:', error);
      setMessage('Error removing product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  const availableProducts = allProducts.filter(
    (p) => !bestSellers.some((bs) => bs.productId._id === p._id)
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Best Sellers Management</h1>
        <p className="text-gray-600">Select products to display in the best sellers section on the home page</p>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('Error') || message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Add Product Section */}
      {!showAddForm && availableProducts.length > 0 && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add to Best Sellers
        </button>
      )}

      {showAddForm && availableProducts.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-2">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a product...</option>
              {availableProducts.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddBestSeller}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setSelectedProduct('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {availableProducts.length === 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 mb-6">
          All available products are already in best sellers
        </div>
      )}

      {/* Current Best Sellers */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">
            Current Best Sellers ({bestSellers.length})
          </h2>
        </div>

        {bestSellers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No best sellers added yet. Add products to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {bestSellers.map((seller, index) => (
                  <tr key={seller._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <GripVertical size={16} />
                        {seller.displayOrder}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={seller.productId.images[0]}
                          alt={seller.productId.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {seller.productId.name}
                          </p>
                          <p className="text-sm text-gray-500">{seller.productId.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{seller.productId.discountedPrice || seller.productId.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemove(seller.productId._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Remove from best sellers"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
