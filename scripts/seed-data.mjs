import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  discountedPrice: Number,
  category: mongoose.Schema.Types.ObjectId,
  gender: { type: String, enum: ['male', 'female', 'unisex'], default: 'unisex' },
  images: [String],
  stock: Number,
  rating: Number,
  reviewCount: Number,
  totalSold: Number,
  sku: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create categories
    const categories = await Category.create([
      { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
      { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories' },
      { name: 'Home & Furniture', slug: 'home-furniture', description: 'Home and furniture items' },
      { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', description: 'Beauty and personal care products' },
      { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Sports and outdoor equipment' },
    ]);

    console.log(`Created ${categories.length} categories`);

    // Create products
    const products = [
      {
        name: '4K Webcam',
        slug: '4k-webcam',
        description: 'Ultra HD 4K webcam with autofocus and built-in microphone. Perfect for streaming and video calls.',
        price: 8999,
        discountedPrice: 6999,
        category: categories[0]._id,
        gender: 'unisex',
        images: ['https://via.placeholder.com/500?text=4K+Webcam'],
        stock: 25,
        rating: 4.4,
        reviewCount: 120,
        totalSold: 450,
        sku: 'WEB-4K-001',
      },
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
        price: 4999,
        discountedPrice: 3499,
        category: categories[0]._id,
        gender: 'unisex',
        images: ['https://via.placeholder.com/500?text=Wireless+Headphones'],
        stock: 45,
        rating: 4.6,
        reviewCount: 340,
        totalSold: 890,
        sku: 'HDP-WRL-002',
      },
      {
        name: 'Smart Watch',
        slug: 'smart-watch',
        description: 'Feature-rich smartwatch with heart rate monitor, GPS, and 7-day battery.',
        price: 7999,
        discountedPrice: 5999,
        category: categories[0]._id,
        gender: 'unisex',
        images: ['https://via.placeholder.com/500?text=Smart+Watch'],
        stock: 30,
        rating: 4.5,
        reviewCount: 280,
        totalSold: 620,
        sku: 'SWT-PRO-003',
      },
      {
        name: 'Premium T-Shirt',
        slug: 'premium-t-shirt',
        description: 'Comfortable cotton T-shirt available in multiple colors. Perfect for casual wear.',
        price: 799,
        discountedPrice: 499,
        category: categories[1]._id,
        gender: 'male',
        images: ['https://via.placeholder.com/500?text=T-Shirt'],
        stock: 100,
        rating: 4.3,
        reviewCount: 180,
        totalSold: 1200,
        sku: 'TSH-PRM-004',
      },
      {
        name: 'Denim Jeans',
        slug: 'denim-jeans',
        description: 'Stylish denim jeans with perfect fit and durable fabric.',
        price: 1999,
        discountedPrice: 1499,
        category: categories[1]._id,
        gender: 'unisex',
        images: ['https://via.placeholder.com/500?text=Denim+Jeans'],
        stock: 50,
        rating: 4.4,
        reviewCount: 220,
        totalSold: 580,
        sku: 'DIN-CLK-005',
      },
      {
        name: 'Wooden Dining Table',
        slug: 'wooden-dining-table',
        description: 'Beautiful wooden dining table made from premium hardwood. Seats 6 people.',
        price: 19999,
        discountedPrice: 14999,
        category: categories[2]._id,
        gender: 'unisex',
        images: ['https://via.placeholder.com/500?text=Dining+Table'],
        stock: 10,
        rating: 4.7,
        reviewCount: 95,
        totalSold: 320,
        sku: 'TBL-WOD-006',
      },
      {
        name: 'Office Chair',
        slug: 'office-chair',
        description: 'Ergonomic office chair with lumbar support and adjustable height.',
        price: 8999,
        discountedPrice: 6999,
        category: categories[2]._id,
        gender: 'unisex',
        images: ['https://via.placeholder.com/500?text=Office+Chair'],
        stock: 35,
        rating: 4.5,
        reviewCount: 150,
        totalSold: 420,
        sku: 'CHR-OFC-007',
      },
      {
        name: 'Face Moisturizer',
        slug: 'face-moisturizer',
        description: 'Daily face moisturizer with SPF 30 protection. Suitable for all skin types.',
        price: 899,
        discountedPrice: 599,
        category: categories[3]._id,
        gender: 'female',
        images: ['https://via.placeholder.com/500?text=Face+Moisturizer'],
        stock: 80,
        rating: 4.6,
        reviewCount: 420,
        totalSold: 2100,
        sku: 'CSM-FCS-008',
      },
      {
        name: 'Hair Shampoo',
        slug: 'hair-shampoo',
        description: 'Natural hair shampoo with organic ingredients. Gentle on hair and scalp.',
        price: 399,
        discountedPrice: 249,
        category: categories[3]._id,
        gender: 'female',
        images: ['https://via.placeholder.com/500?text=Hair+Shampoo'],
        stock: 120,
        rating: 4.4,
        reviewCount: 560,
        totalSold: 3400,
        sku: 'SHP-NTR-009',
      },
      {
        name: 'Yoga Mat',
        slug: 'yoga-mat',
        description: 'Non-slip yoga mat with carrying strap. Perfect for yoga and fitness.',
        price: 1999,
        discountedPrice: 1299,
        category: categories[4]._id,
        gender: 'female',
        images: ['https://via.placeholder.com/500?text=Yoga+Mat'],
        stock: 60,
        rating: 4.4,
        reviewCount: 310,
        totalSold: 890,
        sku: 'YGM-PRO-010',
      },
      {
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'Comfortable running shoes with cushioned sole. Available in multiple sizes.',
        price: 4999,
        discountedPrice: 3699,
        category: categories[4]._id,
        gender: 'male',
        images: ['https://via.placeholder.com/500?text=Running+Shoes'],
        stock: 55,
        rating: 4.5,
        reviewCount: 380,
        totalSold: 1200,
        sku: 'SHO-RUN-011',
      },
      {
        name: 'Dumbells Set',
        slug: 'dumbells-set',
        description: '10kg dumbells set with carrying case. Perfect for home workouts.',
        price: 6999,
        discountedPrice: 4999,
        category: categories[4]._id,
        gender: 'unisex',
        images: ['https://via.placeholder.com/500?text=Dumbells+Set'],
        stock: 40,
        rating: 4.6,
        reviewCount: 290,
        totalSold: 750,
        sku: 'DBL-SET-012',
      },
    ];

    await Product.create(products);
    console.log(`Created ${products.length} products`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
