'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Package, Star } from 'lucide-react';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';

export default function WishlistPage() {
  const { items: wishlistItems, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      slug: item.slug,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Heart size={28} className="text-red-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600">Your favorite products saved for later</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-2">Your wishlist is empty</p>
            <p className="text-gray-500 text-sm mb-6">Start adding your favorite products to see them here</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6 text-sm">You have <strong>{wishlistItems.length}</strong> item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {wishlistItems.map((product) => (
                <div key={product.productId} className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Package size={40} className="text-gray-400" />
                      </div>
                    )}
                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => removeItem(product.productId)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 text-gray-700 hover:text-white p-2 rounded-full shadow-md transition-all"
                      title="Remove from wishlist"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 mb-2">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-4">
                      <p className="text-lg md:text-xl font-bold text-blue-600">₹{product.price.toFixed(2)}</p>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:shadow-lg transition-all"
                      >
                        View Product
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
