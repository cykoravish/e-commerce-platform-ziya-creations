'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import {
  ShoppingCart, User, Search, Menu, X, Heart, ChevronRight,
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items: cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => { if (d.statusCode === 'SUCCESS') setCategories(d.data || []); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('#mobile-menu') && !t.closest('#mobile-menu-btn')) closeMobileMenu();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMenuVisible(false);
    setTimeout(() => setMobileMenuOpen(false), 280);
  };

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
    setTimeout(() => setMenuVisible(true), 10);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-14 md:h-16 gap-3">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 mr-2">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">Ziya</span>
            </Link>

            {/* Desktop Search */}
            <div className="flex-1 hidden md:flex justify-center">
              <div className="w-full max-w-md relative">
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-sm text-gray-900 bg-white border-2 border-transparent focus:outline-none focus:border-secondary placeholder-gray-400"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="flex-1 md:hidden" />

            {/* Mobile search toggle */}
            <button
              onClick={() => { setSearchOpen((v) => !v); setTimeout(() => searchRef.current?.focus(), 100); }}
              className="md:hidden text-white p-1"
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>

            {/* Desktop right icons */}
            <nav className="hidden md:flex items-center gap-4 ml-auto">
              <Link href="/wishlist" className="relative text-white hover:text-secondary transition">
                <Heart size={22} />
              </Link>
              <Link href="/cart" className="relative text-white hover:text-secondary transition">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-white hover:text-secondary transition">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    {user.role !== 'customer' && (
                      <span className="text-xs bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full font-bold">
                        {user.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
                      </span>
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link href="/orders" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                    <Link href="/account" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">My Account</Link>
                    {user.role !== 'customer' && (
                      <Link href="/admin" className="block px-4 py-2.5 text-sm text-secondary font-semibold hover:bg-gray-50 border-t border-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => logout()} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 border-t border-gray-100">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/auth/login" className="text-white text-sm font-medium hover:text-secondary transition">Login</Link>
                  <Link href="/auth/signup" className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">Sign Up</Link>
                </>
              )}
            </nav>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => mobileMenuOpen ? closeMobileMenu() : openMobileMenu()}
              className="md:hidden text-white p-1"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className={`md:hidden overflow-hidden transition-all duration-200 ${searchOpen ? 'max-h-14 pb-2' : 'max-h-0'}`}>
            <div className="relative">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-900 bg-white border-2 border-transparent focus:outline-none focus:border-secondary placeholder-gray-400 pr-16"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 transition">
                    <X size={14} />
                  </button>
                )}
                <Search size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${menuVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeMobileMenu}
          />
          <div
            id="mobile-menu"
            className={`absolute right-0 top-0 bottom-0 w-4/5 max-w-xs bg-white shadow-2xl overflow-y-auto flex flex-col transition-transform duration-300 ease-in-out ${menuVisible ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="flex items-center justify-between px-4 py-4 bg-primary">
              <span className="text-white font-bold text-lg">Menu</span>
              <button onClick={closeMobileMenu} className="text-white"><X size={22} /></button>
            </div>

            <div className="flex-1 px-4 py-4 space-y-1 text-gray-800">
              {user ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                    <div className="w-11 h-11 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 text-base flex-shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <DrawerLink href="/orders" onClick={closeMobileMenu}>My Orders</DrawerLink>
                  <DrawerLink href="/account" onClick={closeMobileMenu}>My Account</DrawerLink>
                  <DrawerLink href="/track-order" onClick={closeMobileMenu}>Track Order</DrawerLink>
                  <DrawerLink href="/contact" onClick={closeMobileMenu}>Contact Us</DrawerLink>
                  <DrawerLink href="/stores" onClick={closeMobileMenu}>Store Locator</DrawerLink>

                  {categories.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <button
                        onClick={() => setCategoryOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition"
                      >
                        Shop by Category
                        <ChevronRight size={16} className={`text-gray-400 transition-transform duration-300 ${categoryOpen ? 'rotate-90' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${categoryOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pt-1 pb-2 pl-3 space-y-0.5">
                          {categories.map((cat) => (
                            <DrawerLink key={cat._id} href={`/?category=${cat.slug}`} onClick={closeMobileMenu}>
                              {cat.name}
                            </DrawerLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setGenderOpen((v) => !v)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    >
                      Shop by Gender
                      <ChevronRight size={16} className={`text-gray-400 transition-transform duration-300 ${genderOpen ? 'rotate-90' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${genderOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="pt-1 pb-2 pl-3 space-y-0.5">
                        {['male', 'female', 'unisex'].map((g) => (
                          <DrawerLink key={g} href={`/?gender=${g}`} onClick={closeMobileMenu}>
                            <span className="capitalize">{g}</span>
                          </DrawerLink>
                        ))}
                      </div>
                    </div>
                  </div>

                  {user.role !== 'customer' && (
                    <div className="pt-3">
                      <Link href="/admin" onClick={closeMobileMenu} className="block w-full text-center bg-secondary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
                        Admin Dashboard
                      </Link>
                    </div>
                  )}
                  <div className="pt-3">
                    <button
                      onClick={() => { logout(); closeMobileMenu(); }}
                      className="w-full bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 pt-2">
                  <Link href="/auth/login" onClick={closeMobileMenu} className="block w-full text-center bg-primary text-white px-4 py-3 rounded-xl font-semibold hover:opacity-90">Login</Link>
                  <Link href="/auth/signup" onClick={closeMobileMenu} className="block w-full text-center border-2 border-primary text-primary px-4 py-3 rounded-xl font-semibold hover:bg-primary/5">Sign Up</Link>
                  <div className="pt-4 border-t border-gray-100">
                    <DrawerLink href="/contact" onClick={closeMobileMenu}>Contact Us</DrawerLink>
                    <DrawerLink href="/stores" onClick={closeMobileMenu}>Store Locator</DrawerLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 flex items-center h-16 shadow-lg">
        <Link href="/" className="flex-1 flex flex-col items-center justify-center gap-0.5 text-primary">
          <ShoppingCart size={20} />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/cart" className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-500 relative">
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-xs">Cart</span>
        </Link>
        <Link href="/wishlist" className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-500">
          <Heart size={20} />
          <span className="text-xs">Wishlist</span>
        </Link>
        <Link href={user ? '/account' : '/auth/login'} className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-500">
          <User size={20} />
          <span className="text-xs">{user ? 'Account' : 'Login'}</span>
        </Link>
      </nav>
    </>
  );
}

function DrawerLink({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
      {children}
    </Link>
  );
}