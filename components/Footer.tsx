'use client';

import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold mb-3">Ziya</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Premium lifestyle products for everyone.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/stores" className="hover:text-white transition">Store Locator</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/orders" className="hover:text-white transition">My Orders</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">Contact</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2"><Phone size={14} /> +91-XXX-XXX-XXXX</li>
              <li className="flex items-center gap-2"><Mail size={14} /> support@ziya.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
          <p>&copy; 2025 Ziya Creations. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}