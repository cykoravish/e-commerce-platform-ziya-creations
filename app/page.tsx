"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
import { useAuth } from "./context/AuthContext";
import OfferCarousel from "./components/OfferCarousel";
import ReviewsSection from "./components/ReviewsSection";
import { useTouchScroll } from "./hooks/useTouchScroll";
import { X, Heart, ChevronRight, Star, ChevronLeft } from "lucide-react";

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
  const { toggleItem, isInWishlist } = useWishlist();

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
      const res = await fetch(`/api/categories`);
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
      // First try to get admin-managed best sellers
      const res = await fetch(`/api/admin/best-sellers`);
      const data = await res.json();
      if (data.statusCode === "SUCCESS" && data.data && data.data.length > 0) {
        // Extract products from best sellers
        setBestSellers(data.data.map((bs: any) => bs.productId));
      } else {
        // Fallback to products sorted by sales if no best sellers are set
        const fallbackRes = await fetch(`/api/products?limit=5&sort=-totalSold`);
        const fallbackData = await fallbackRes.json();
        if (fallbackData.statusCode === "SUCCESS" && fallbackData.data)
          setBestSellers(fallbackData.data.products || []);
      }
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
    const offerClicked = searchParams.get("offerClicked");
    if (offerClicked && productsRef.current) {
      // Small delay to ensure page is fully rendered
      setTimeout(() => {
        productsRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const handleToggleWishlist = (product: Product) => {
    toggleItem({
      productId: product._id,
      name: product.name,
      price: product.discountedPrice || product.price,
      image: product.images[0],
      slug: product.slug,
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    // pb-16 on mobile gives space for the bottom nav bar
    <div className="min-h-screen bg-gray-50">
      {/* ── Banner Carousel ─�� */}
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
      <section
        ref={productsRef}
        className="max-w-7xl mx-auto px-4 py-6 md:py-10"
      >
        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* Best Sellers */}
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
                        setBestSellerIndex((p) => Math.max(0, p - 1))
                      }
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
                      aria-label="Previous"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setBestSellerIndex((p) =>
                          Math.min(bestSellers.length - 1, p + 1),
                        )
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
                    className="flex transition-transform duration-500 ease-in-out cursor-grab active:cursor-grabbing select-none"
                    style={{
                      transform: `translateX(-${bestSellerIndex * 100}%)`,
                    }}
                    onMouseDown={(e) => {
                      const startX = e.clientX;
                      const onMove = (ev: MouseEvent) => {
                        const diff = startX - ev.clientX;
                        if (Math.abs(diff) > 50) {
                          diff > 0
                            ? setBestSellerIndex((p) =>
                                Math.min(bestSellers.length - 1, p + 1),
                              )
                            : setBestSellerIndex((p) => Math.max(0, p - 1));
                          document.removeEventListener("mousemove", onMove);
                          document.removeEventListener("mouseup", onUp);
                        }
                      };
                      const onUp = () => {
                        document.removeEventListener("mousemove", onMove);
                        document.removeEventListener("mouseup", onUp);
                      };
                      document.addEventListener("mousemove", onMove);
                      document.addEventListener("mouseup", onUp);
                    }}
                    onTouchStart={(e) => {
                      const startX = e.touches[0].clientX;
                      const onMove = (ev: TouchEvent) => {
                        const diff = startX - ev.touches[0].clientX;
                        if (Math.abs(diff) > 50) {
                          diff > 0
                            ? setBestSellerIndex((p) =>
                                Math.min(bestSellers.length - 1, p + 1),
                              )
                            : setBestSellerIndex((p) => Math.max(0, p - 1));
                          document.removeEventListener("touchmove", onMove);
                          document.removeEventListener("touchend", onEnd);
                        }
                      };
                      const onEnd = () => {
                        document.removeEventListener("touchmove", onMove);
                        document.removeEventListener("touchend", onEnd);
                      };
                      document.addEventListener("touchmove", onMove, {
                        passive: true,
                      });
                      document.addEventListener("touchend", onEnd, {
                        passive: true,
                      });
                    }}
                  >
                    {bestSellers.map((product) => (
                      <div key={product._id} className="w-full flex-shrink-0">
                        <ProductCardLarge
                          product={product}
                          isWishlisted={isInWishlist(product._id)}
                          onWishlistToggle={() => handleToggleWishlist(product)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isWishlisted={isInWishlist(product._id)}
                      onWishlistToggle={() => handleToggleWishlist(product)}
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
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
      <div className="relative w-full md:w-72 lg:w-96 aspect-square md:h-80 lg:h-96 md:aspect-auto flex-shrink-0 overflow-hidden group">
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
              {(product.rating || 0).toFixed(1)}
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
