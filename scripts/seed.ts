import mongoose from 'mongoose';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic gadgets and devices',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop',
  },
  {
    name: 'Home & Furniture',
    slug: 'home-furniture',
    description: 'Furniture and home decor items',
    image: 'https://images.unsplash.com/photo-1522771753035-1a5b6562f3ba?w=300&h=300&fit=crop',
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    description: 'Beauty and personal care products',
    image: 'https://images.unsplash.com/photo-1596462502278-47bf1fcbdca3?w=300&h=300&fit=crop',
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment and outdoor gear',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop',
  },
];

const products = [
  // Electronics
  {
    name: 'Wireless Earbuds Pro',
    slug: 'wireless-earbuds-pro',
    description: 'High-quality wireless earbuds with noise cancellation and 30-hour battery life.',
    price: 4999,
    discountedPrice: 3499,
    category: 'electronics',
    images: ['https://placehold.co/400x400/2563eb/ffffff?text=Wireless+Earbuds'],
    stock: 50,
    sku: 'WEB-PRO-001',
    rating: 4.5,
  },
  {
    name: 'Smart Watch Ultra',
    slug: 'smart-watch-ultra',
    description: 'Advanced smartwatch with health tracking, GPS, and water resistance.',
    price: 15999,
    discountedPrice: 12499,
    category: 'electronics',
    images: ['https://placehold.co/400x400/4f46e5/ffffff?text=Smart+Watch'],
    stock: 30,
    sku: 'SWU-001',
    rating: 4.3,
  },
  {
    name: 'USB-C Charger 65W',
    slug: 'usb-c-charger-65w',
    description: 'Fast charging USB-C charger compatible with all devices.',
    price: 1299,
    discountedPrice: 899,
    category: 'electronics',
    images: ['https://placehold.co/400x400/7c3aed/ffffff?text=USB-C+Charger'],
    stock: 100,
    sku: 'USC-65W-001',
    rating: 4.6,
  },
  {
    name: '4K Webcam',
    slug: '4k-webcam',
    description: 'Professional 4K webcam with auto-focus and built-in microphone.',
    price: 8999,
    discountedPrice: 6999,
    category: 'electronics',
    images: ['https://placehold.co/400x400/0891b2/ffffff?text=4K+Webcam'],
    stock: 25,
    sku: '4KWC-001',
    rating: 4.4,
  },
  {
    name: 'Wireless Keyboard Mouse',
    slug: 'wireless-keyboard-mouse',
    description: 'Ergonomic wireless keyboard and mouse combo with silent keys.',
    price: 2499,
    discountedPrice: 1799,
    category: 'electronics',
    images: ['https://placehold.co/400x400/0d9488/ffffff?text=Keyboard+Mouse'],
    stock: 60,
    sku: 'WKM-001',
    rating: 4.2,
  },

  // Fashion
  {
    name: 'Cotton T-Shirt',
    slug: 'cotton-t-shirt',
    description: 'Premium quality 100% cotton t-shirt available in multiple colors.',
    price: 599,
    discountedPrice: 399,
    category: 'fashion',
    images: ['https://placehold.co/400x400/f59e0b/ffffff?text=Cotton+T-Shirt'],
    stock: 200,
    sku: 'CTS-001',
    rating: 4.3,
  },
  {
    name: 'Denim Jeans',
    slug: 'denim-jeans',
    description: 'Comfortable and stylish denim jeans for everyday wear.',
    price: 1999,
    discountedPrice: 1499,
    category: 'fashion',
    images: ['https://placehold.co/400x400/1e40af/ffffff?text=Denim+Jeans'],
    stock: 80,
    sku: 'DNM-001',
    rating: 4.4,
  },
  {
    name: 'Casual Shoes',
    slug: 'casual-shoes',
    description: 'Lightweight and comfortable casual shoes for men and women.',
    price: 2999,
    discountedPrice: 1999,
    category: 'fashion',
    images: ['https://placehold.co/400x400/ec4899/ffffff?text=Casual+Shoes'],
    stock: 120,
    sku: 'CAS-001',
    rating: 4.5,
  },
  {
    name: 'Winter Jacket',
    slug: 'winter-jacket',
    description: 'Warm and stylish winter jacket with water-resistant coating.',
    price: 4999,
    discountedPrice: 3499,
    category: 'fashion',
    images: ['https://placehold.co/400x400/1f2937/ffffff?text=Winter+Jacket'],
    stock: 40,
    sku: 'WNJ-001',
    rating: 4.6,
  },
  {
    name: 'Sports Sneakers',
    slug: 'sports-sneakers',
    description: 'High-performance sports sneakers with excellent cushioning.',
    price: 3499,
    discountedPrice: 2499,
    category: 'fashion',
    images: ['https://placehold.co/400x400/ef4444/ffffff?text=Sports+Sneakers'],
    stock: 90,
    sku: 'SPN-001',
    rating: 4.4,
  },

  // Home & Furniture
  {
    name: 'Office Chair',
    slug: 'office-chair',
    description: 'Ergonomic office chair with lumbar support and adjustable height.',
    price: 12999,
    discountedPrice: 9999,
    category: 'home-furniture',
    images: ['https://placehold.co/400x400/6366f1/ffffff?text=Office+Chair'],
    stock: 20,
    sku: 'OFC-001',
    rating: 4.5,
  },
  {
    name: 'Dining Table',
    slug: 'dining-table',
    description: 'Beautiful wooden dining table that seats 6 people.',
    price: 24999,
    discountedPrice: 18999,
    category: 'home-furniture',
    images: ['https://placehold.co/400x400/92400e/ffffff?text=Dining+Table'],
    stock: 10,
    sku: 'DNT-001',
    rating: 4.3,
  },
  {
    name: 'Bed Sheet Set',
    slug: 'bed-sheet-set',
    description: 'Soft and comfortable cotton bed sheet set with pillowcases.',
    price: 1499,
    discountedPrice: 999,
    category: 'home-furniture',
    images: ['https://placehold.co/400x400/8b5cf6/ffffff?text=Bed+Sheet+Set'],
    stock: 150,
    sku: 'BDS-001',
    rating: 4.4,
  },
  {
    name: 'Wall Lamp',
    slug: 'wall-lamp',
    description: 'Modern wall lamp with energy-efficient LED bulb.',
    price: 899,
    discountedPrice: 599,
    category: 'home-furniture',
    images: ['https://placehold.co/400x400/eab308/ffffff?text=Wall+Lamp'],
    stock: 75,
    sku: 'WLP-001',
    rating: 4.3,
  },
  {
    name: 'Coffee Table',
    slug: 'coffee-table',
    description: 'Sleek glass and wood coffee table for modern living rooms.',
    price: 8999,
    discountedPrice: 6999,
    category: 'home-furniture',
    images: ['https://placehold.co/400x400/57534e/ffffff?text=Coffee+Table'],
    stock: 35,
    sku: 'CFT-001',
    rating: 4.2,
  },

  // Beauty & Personal Care
  {
    name: 'Face Moisturizer',
    slug: 'face-moisturizer',
    description: 'Hydrating face moisturizer suitable for all skin types.',
    price: 899,
    discountedPrice: 599,
    category: 'beauty-personal-care',
    images: ['https://placehold.co/400x400/f472b6/ffffff?text=Face+Moisturizer'],
    stock: 200,
    sku: 'FMR-001',
    rating: 4.4,
  },
  {
    name: 'Hair Shampoo',
    slug: 'hair-shampoo',
    description: 'Professional hair shampoo for all hair types with natural ingredients.',
    price: 399,
    discountedPrice: 249,
    category: 'beauty-personal-care',
    images: ['https://placehold.co/400x400/06b6d4/ffffff?text=Hair+Shampoo'],
    stock: 300,
    sku: 'HSM-001',
    rating: 4.5,
  },
  {
    name: 'Sunscreen SPF 50',
    slug: 'sunscreen-spf-50',
    description: 'Water-resistant sunscreen with SPF 50 protection.',
    price: 599,
    discountedPrice: 399,
    category: 'beauty-personal-care',
    images: ['https://placehold.co/400x400/f97316/ffffff?text=Sunscreen+SPF50'],
    stock: 150,
    sku: 'SUN-50-001',
    rating: 4.6,
  },
  {
    name: 'Lip Balm',
    slug: 'lip-balm',
    description: 'Moisturizing lip balm with natural oils and vitamin E.',
    price: 299,
    discountedPrice: 179,
    category: 'beauty-personal-care',
    images: ['https://placehold.co/400x400/fb7185/ffffff?text=Lip+Balm'],
    stock: 250,
    sku: 'LPB-001',
    rating: 4.3,
  },
  {
    name: 'Hair Oil',
    slug: 'hair-oil',
    description: 'Nourishing hair oil with blend of essential oils.',
    price: 449,
    discountedPrice: 299,
    category: 'beauty-personal-care',
    images: ['https://placehold.co/400x400/16a34a/ffffff?text=Hair+Oil'],
    stock: 180,
    sku: 'HOL-001',
    rating: 4.4,
  },

  // Sports & Outdoors
  {
    name: 'Yoga Mat',
    slug: 'yoga-mat',
    description: 'Non-slip yoga mat with carrying strap and cushioning.',
    price: 1999,
    discountedPrice: 1299,
    category: 'sports-outdoors',
    images: ['https://placehold.co/400x400/a855f7/ffffff?text=Yoga+Mat'],
    stock: 100,
    sku: 'YGM-001',
    rating: 4.4,
  },
  {
    name: 'Dumbbells Set',
    slug: 'dumbbells-set',
    description: 'Adjustable dumbbell set ranging from 2kg to 20kg.',
    price: 8999,
    discountedPrice: 6999,
    category: 'sports-outdoors',
    images: ['https://placehold.co/400x400/dc2626/ffffff?text=Dumbbells+Set'],
    stock: 30,
    sku: 'DBS-001',
    rating: 4.5,
  },
  {
    name: 'Running Shoes',
    slug: 'running-shoes',
    description: 'Professional running shoes with cushioning and support.',
    price: 4999,
    discountedPrice: 3499,
    category: 'sports-outdoors',
    images: ['https://placehold.co/400x400/0ea5e9/ffffff?text=Running+Shoes'],
    stock: 60,
    sku: 'RNS-001',
    rating: 4.6,
  },
  {
    name: 'Sports Water Bottle',
    slug: 'sports-water-bottle',
    description: 'Insulated water bottle keeps drinks hot or cold for 24 hours.',
    price: 1599,
    discountedPrice: 999,
    category: 'sports-outdoors',
    images: ['https://placehold.co/400x400/6366f1/ffffff?text=Water+Bottle'],
    stock: 150,
    sku: 'SWB-001',
    rating: 4.3,
  },
  {
    name: 'Camping Tent',
    slug: 'camping-tent',
    description: 'Waterproof camping tent for 4 people with easy setup.',
    price: 12999,
    discountedPrice: 9999,
    category: 'sports-outdoors',
    images: ['https://placehold.co/400x400/059669/ffffff?text=Camping+Tent'],
    stock: 20,
    sku: 'CPT-001',
    rating: 4.4,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[v0] Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('[v0] Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`[v0] Created ${createdCategories.length} categories`);

    // Map category names to IDs for product creation
    const categoryMap: { [key: string]: string } = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id.toString();
    });

    // Update products with actual category IDs
    const productsWithCategoryIds = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));

    // Create products
    const createdProducts = await Product.insertMany(productsWithCategoryIds);
    console.log(`[v0] Created ${createdProducts.length} products`);

    console.log('[v0] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[v0] Seeding error:', error);
    process.exit(1);
  }
}

seed();

// npx tsx scripts/seed.ts