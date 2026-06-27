"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";
import OfferCarousel from "./components/OfferCarousel";
import ReviewsSection from "./components/ReviewsSection";
import { useTouchScroll } from "./hooks/useTouchScroll";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Heart,
  Phone,
  Mail,
  ChevronRight,
  Star,
  ChevronLeft,
  Home,
  Package,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: Category;
  rating: number;
  reviewCount: number;
  stock: number;
  totalSold: number;
  gender: string;
}

interface Banner {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const productsRef = useRef<HTMLElement>(null);
  const bestSellersScrollRef = useTouchScroll();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [bestSellerIndex, setBestSellerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { user, logout } = useAuth();
  const { items: cart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const bannerTimer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(bannerTimer);
  }, [banners.length]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("#mobile-menu") &&
        !target.closest("#mobile-menu-btn")
      ) {
        closeMobileMenu();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchProducts(),
        fetchBestSellers(),
        fetchBanners(),
        fetchOffers(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `/api/categories`,
      );
      const data = await res.json();
      if (data.statusCode === "SUCCESS") setCategories(data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const closeMobileMenu = () => {
    setMenuVisible(false);
    setTimeout(() => setMobileMenuOpen(false), 280);
  };

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
    setTimeout(() => setMenuVisible(true), 10);
  };

  const fetchProducts = async (categoryId?: string, gender?: string) => {
    try {
      let url = `/api/products?limit=12`;
      if (categoryId) url += `&category=${categoryId}`;
      if (gender) url += `&gender=${gender}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(
        data.statusCode === "SUCCESS" && data.data
          ? data.data.products || []
          : [],
      );
    } catch (e) {
      console.error(e);
      setProducts([]);
    }
  };

  const fetchBestSellers = async () => {
    try {
      const res = await fetch(
        `/api/products?limit=5&sort=-totalSold`,
      );
      const data = await res.json();
      if (data.statusCode === "SUCCESS" && data.data)
        setBestSellers(data.data.products || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await fetch(`/api/banners`);
      const data = await res.json();
      if (data.statusCode === "SUCCESS") setBanners(data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch("/api/offers?active=true");
      const data = await res.json();
      if (data.statusCode === "SUCCESS") {
        setOffers(data.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch offers:", e);
    }
  };

  // Handle offer click - scroll to products section
  useEffect(() => {
    const offerClicked = searchParams.get('offerClicked');
    if (offerClicked && productsRef.current) {
      // Small delay to ensure page is fully rendered
      setTimeout(() => {
        productsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  const handleCategoryFilter = (categoryId: string) => {
    const next = categoryId === selectedCategory ? "" : categoryId;
    setSelectedCategory(next);
    setSelectedGender("");
    fetchProducts(next, "");
  };

  const handleGenderFilter = (gender: string) => {
    const next = gender === selectedGender ? "" : gender;
    setSelectedGender(next);
    fetchProducts(selectedCategory || undefined, next);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(query)}&limit=20`,
        );
        const data = await res.json();
        if (data.statusCode === "SUCCESS" && data.data)
          setProducts(data.data.products || []);
      } catch (e) {
        console.error(e);
      }
    } else {
      fetchProducts();
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedGender("");
    fetchProducts();
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    // pb-16 on mobile gives space for the bottom nav bar
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-14 md:h-16 gap-3">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 mr-2">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Ziya
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="flex-1 hidden md:flex justify-center">
              <div className="w-full max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products, brands..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-sm text-gray-900 bg-white border-2 border-transparent focus:outline-none focus:border-secondary placeholder-gray-400"
                  />
                  <Search
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Spacer on mobile */}
            <div className="flex-1 md:hidden" />

            {/* Mobile: search icon toggle */}
            <button
              onClick={() => {
                setSearchOpen((v) => !v);
                setTimeout(() => searchRef.current?.focus(), 100);
              }}
              className="md:hidden text-white p-1"
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>

            {/* Desktop right icons */}
            <nav className="hidden md:flex items-center gap-4 ml-auto">
              <Link
                href="/wishlist"
                className="relative text-white hover:text-secondary transition"
              >
                <Heart
                  size={22}
                  fill={wishlist.size > 0 ? "currentColor" : "none"}
                />
                {wishlist.size > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.size}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative text-white hover:text-secondary transition"
              >
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
                    {user.role !== "customer" && (
                      <span className="text-xs bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full font-bold">
                        {user.role === "super_admin" ? "SUPER ADMIN" : "ADMIN"}
                      </span>
                    )}
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/orders"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/account"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Account
                    </Link>
                    {user.role !== "customer" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2.5 text-sm text-secondary font-semibold hover:bg-gray-50 border-t border-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => logout()}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 border-t border-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-white text-sm font-medium hover:text-secondary transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile: hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() =>
                mobileMenuOpen ? closeMobileMenu() : openMobileMenu()
              }
              className="md:hidden text-white p-1"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Search Bar (collapsible) */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-200 ${searchOpen ? "max-h-14 pb-2" : "max-h-0"}`}
          >
            <div className="relative">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-900 bg-white border-2 border-transparent focus:outline-none focus:border-secondary placeholder-gray-400"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Drawer (full-screen overlay) ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${menuVisible ? "opacity-100" : "opacity-0"}`}
            onClick={closeMobileMenu}
          />
          <div
            id="mobile-menu"
            className={`absolute right-0 top-0 bottom-0 w-4/5 max-w-xs bg-white shadow-2xl overflow-y-auto flex flex-col transition-transform duration-300 ease-in-out ${menuVisible ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-4 bg-primary">
              <span className="text-white font-bold text-lg">Menu</span>
              <button onClick={closeMobileMenu} className="text-white">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 px-4 py-4 space-y-1 text-gray-800">
              {user ? (
                <>
                  {/* User info */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                    <div className="w-11 h-11 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 text-base flex-shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <DrawerLink
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </DrawerLink>
                  <DrawerLink
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Account
                  </DrawerLink>
                  <DrawerLink
                    href="/track-order"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Track Order
                  </DrawerLink>
                  <DrawerLink
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact Us
                  </DrawerLink>
                  <DrawerLink
                    href="/stores"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Store Locator
                  </DrawerLink>

                  {/* Categories */}
                  {categories.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <button
                        onClick={() => setCategoryOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition"
                      >
                        Shop by Category
                        <ChevronRight
                          size={16}
                          className={`text-gray-400 transition-transform duration-300 ${categoryOpen ? "rotate-90" : ""}`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${categoryOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        <div className="pt-1 pb-2 pl-3 space-y-0.5">
                          {categories.map((cat) => (
                            <button
                              key={cat._id}
                              onClick={() => {
                                handleCategoryFilter(cat._id);
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${selectedCategory === cat._id ? "bg-primary/10 text-primary font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gender */}
                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setGenderOpen((v) => !v)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    >
                      Shop by Gender
                      <ChevronRight
                        size={16}
                        className={`text-gray-400 transition-transform duration-300 ${genderOpen ? "rotate-90" : ""}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${genderOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="pt-1 pb-2 pl-3 space-y-0.5">
                        {["male", "female", "unisex"].map((g) => (
                          <button
                            key={g}
                            onClick={() => {
                              handleGenderFilter(g);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition ${selectedGender === g ? "bg-secondary/10 text-secondary font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {user.role !== "customer" && (
                    <div className="pt-3">
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center bg-secondary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90"
                      >
                        Admin Dashboard
                      </Link>
                    </div>
                  )}

                  <div className="pt-3">
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 pt-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-primary text-white px-4 py-3 rounded-xl font-semibold hover:opacity-90"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center border-2 border-primary text-primary px-4 py-3 rounded-xl font-semibold hover:bg-primary/5"
                  >
                    Sign Up
                  </Link>
                  <div className="pt-4 border-t border-gray-100">
                    <DrawerLink
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact Us
                    </DrawerLink>
                    <DrawerLink
                      href="/stores"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Store Locator
                    </DrawerLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Banner Carousel ── */}
      {banners.length > 0 && (
        <div className="relative h-52 sm:h-64 md:h-80 bg-gray-200 overflow-hidden">
          {banners.map((banner, idx) => (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === currentBannerIndex ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
                loading={idx === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end pb-8 md:items-center md:pb-0 md:justify-center">
                <div className="px-6 text-white md:text-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2 leading-tight">
                    {banner.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg mb-3 md:mb-4 text-white/90 line-clamp-2">
                    {banner.description}
                  </p>
                  {banner.link && (
                    <Link
                      href={banner.link}
                      className="inline-block bg-secondary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                    >
                      Shop Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className={`rounded-full transition-all ${idx === currentBannerIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
                  aria-label={`Go to banner ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Offer Carousel ── */}
      {offers.length > 0 && <OfferCarousel offers={offers} />}

      {/* ── Main Content ── */}
      <section ref={productsRef} className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* Category Filter Tabs */}
            {categories.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                  Shop by Category
                </h2>
                {/* Hide scrollbar on mobile but keep it scrollable */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
                  <FilterChip
                    active={selectedCategory === ""}
                    onClick={() => handleCategoryFilter("")}
                  >
                    All
                  </FilterChip>
                  {categories.map((cat) => (
                    <FilterChip
                      key={cat._id}
                      active={selectedCategory === cat._id}
                      onClick={() => handleCategoryFilter(cat._id)}
                    >
                      {cat.name}
                    </FilterChip>
                  ))}
                </div>
              </section>
            )}

            {/* Gender Filter */}
            <section className="mb-8">
              <div className="flex flex-wrap gap-2">
                {["male", "female", "unisex"].map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGenderFilter(g)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition border ${
                      selectedGender === g
                        ? "bg-secondary text-white border-secondary"
                        : "bg-white text-gray-700 border-gray-200 hover:border-secondary hover:text-secondary"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </section>

            {/* Best Sellers */}
            {bestSellers.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                    Best Sellers
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setBestSellerIndex(
                          (p) =>
                            (p - 1 + bestSellers.length) % bestSellers.length,
                        )
                      }
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
                      aria-label="Previous"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setBestSellerIndex((p) => (p + 1) % bestSellers.length)
                      }
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
                      aria-label="Next"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl">
                  <div
                    ref={bestSellersScrollRef}
                    className="flex transition-transform duration-500 ease-in-out cursor-grab active:cursor-grabbing scroll-smooth"
                    style={{
                      transform: `translateX(-${bestSellerIndex * 100}%)`,
                      overflowX: 'auto',
                      scrollBehavior: 'smooth',
                      WebkitOverflowScrolling: 'touch',
                      WebkitScrollSnap: 'type: x mandatory',
                      scrollSnapType: 'x mandatory',
                    }}
                  >
                    {bestSellers.map((product) => (
                      <div key={product._id} className="w-full flex-shrink-0">
                        <ProductCardLarge
                          product={product}
                          isWishlisted={wishlist.has(product._id)}
                          onWishlistToggle={() => toggleWishlist(product._id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots for best sellers */}
                <div className="flex justify-center gap-1.5 mt-3">
                  {bestSellers.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setBestSellerIndex(i)}
                      className={`rounded-full transition-all ${i === bestSellerIndex ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-gray-300"}`}
                      aria-label={`Go to product ${i + 1}`}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Products Grid */}
            <section>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                  {selectedCategory || selectedGender
                    ? "Filtered Products"
                    : "All Products"}
                  {products.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-400">
                      ({products.length})
                    </span>
                  )}
                </h2>
                {(selectedCategory || selectedGender) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-medium transition"
                  >
                    <X size={14} /> Clear Filters
                  </button>
                )}
              </div>

              {products.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                  <div className="text-5xl mb-3">🛍️</div>
                  <p className="text-gray-500 mb-4 text-sm">
                    No products found for the selected filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 text-sm"
                  >
                    View All Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isWishlisted={wishlist.has(product._id)}
                      onWishlistToggle={() => toggleWishlist(product._id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>

      {/* ── Reviews Section ── */}
      <ReviewsSection />

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-white mt-12 pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-xl font-bold mb-3">Ziya</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Premium lifestyle products for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/stores" className="hover:text-white transition">
                    Store Locator
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">
                Support
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/faq" className="hover:text-white transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="hover:text-white transition"
                  >
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white transition">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">
                Contact
              </h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone size={14} /> +91-XXX-XXX-XXXX
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} /> support@ziya.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
            <p>&copy; 2025 Ziya Creations. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 flex items-center h-16 shadow-lg">
        <Link
          href="/"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-primary"
        >
          <Home size={20} />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link
          href="/cart"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-500 relative"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute top-1 right-6 bg-secondary text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-xs">Cart</span>
        </Link>
        <Link
          href="/wishlist"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-500 relative"
        >
          <Heart
            size={20}
            fill={wishlist.size > 0 ? "#ef4444" : "none"}
            className={wishlist.size > 0 ? "text-red-500" : ""}
          />
          <span className="text-xs">Wishlist</span>
        </Link>
        <Link
          href={user ? "/account" : "/auth/login"}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-500"
        >
          <User size={20} />
          <span className="text-xs">{user ? "Account" : "Login"}</span>
        </Link>
      </nav>
    </div>
  );
}

/* ── Small reusable components ── */

function DrawerLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
    >
      {children}
    </Link>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition border ${
        active
          ? "bg-primary text-white border-primary"
          : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Categories skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 h-9 w-24 bg-gray-200 rounded-full"
          />
        ))}
      </div>
      {/* Best seller skeleton */}
      <div className="h-56 md:h-80 bg-gray-200 rounded-xl" />
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-xl aspect-[3/4]" />
        ))}
      </div>
    </div>
  );
}

/* ── Product Card (grid) ── */
function ProductCard({
  product,
  isWishlisted,
  onWishlistToggle,
}: {
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
}) {
  const discount = product.discountedPrice
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100,
      )
    : 0;

  return (
    // FIXED: added `relative` here so the absolute wishlist button is scoped correctly
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Wishlist button — now correctly positioned inside relative parent */}
      <button
        onClick={onWishlistToggle}
        className="absolute top-2.5 left-2.5 z-10 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm hover:shadow-md transition"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={16}
          className={`transition ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
        />
      </button>

      <Link
        href={`/products/${product.slug}`}
        className="block relative flex-shrink-0"
      >
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
              No Image
            </div>
          )}
        </div>
        {discount > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-secondary text-white px-1.5 py-0.5 rounded text-xs font-bold">
            {discount}% OFF
          </div>
        )}
      </Link>

      <div className="flex-1 p-3 flex flex-col gap-1.5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 text-gray-900 group-hover:text-primary transition leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-auto">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs font-medium text-gray-700">
            {product.rating.toFixed(1)}
          </span>
          {product.reviewCount > 0 && (
            <span className="text-xs text-gray-400">
              ({product.reviewCount})
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1.5 flex-wrap">
          {product.discountedPrice ? (
            <>
              <span className="text-sm sm:text-base font-bold text-primary">
                ₹{product.discountedPrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-sm sm:text-base font-bold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="px-3 pb-3">
        <Link
          href={`/products/${product.slug}`}
          className="block w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition text-xs sm:text-sm text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

/* ── Product Card Large (Best Sellers) ── */
function ProductCardLarge({
  product,
  isWishlisted,
  onWishlistToggle,
}: {
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
}) {
  const discount = product.discountedPrice
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100,
      )
    : 0;

  return (
    // FIXED: stacked on mobile (flex-col), side-by-side on md+ (flex-row)
    // No fixed heights — content determines height naturally
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
      {/* Image — square on mobile, fixed width on desktop */}
      <div className="relative w-full md:w-72 lg:w-96 aspect-square md:aspect-auto flex-shrink-0 overflow-hidden group">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
            No Image
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-secondary text-white px-2.5 py-1 rounded text-xs font-bold">
            {discount}% OFF
          </div>
        )}
        <button
          onClick={onWishlistToggle}
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={18}
            className={`transition ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 p-5 md:p-8 flex flex-col justify-between">
        <div>
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
            Best Seller
          </span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 hover:text-primary transition leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-400 text-sm">{product.reviewCount} reviews</p>
        </div>

        <div className="my-4">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={15}
                className={
                  i < Math.round(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-200"
                }
              />
            ))}
            <span className="text-sm font-medium text-gray-700 ml-1">
              {product.rating.toFixed(1)}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            {product.discountedPrice ? (
              <>
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  ₹{product.discountedPrice.toLocaleString()}
                </span>
                <span className="text-base text-gray-400 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-2xl md:text-3xl font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="inline-block bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition text-center text-sm md:text-base"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
