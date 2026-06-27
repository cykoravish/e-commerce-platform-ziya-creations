'use client';

import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';

interface NavbarProps {
  activeLink?: 'wishlist' | 'cart' | 'home';
}

export default function Navbar({ activeLink }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Ziya
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Link 
              href="/wishlist" 
              className={`transition ${activeLink === 'wishlist' ? 'text-white font-bold' : 'text-blue-100 hover:text-white'}`}
              title="Wishlist"
            >
              <Heart size={22} />
            </Link>
            <Link 
              href="/cart" 
              className={`transition ${activeLink === 'cart' ? 'text-white font-bold' : 'text-blue-100 hover:text-white'}`}
              title="Cart"
            >
              <ShoppingCart size={22} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
