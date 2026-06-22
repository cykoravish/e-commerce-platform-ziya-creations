# Seed Database with Dummy Products

This guide explains how to populate your Ziya Creations database with dummy products, categories, and other test data.

## Quick Start (3 Steps)

### Step 1: Environment Setup

Make sure you have set all environment variables in your Vercel project settings:
- `MONGODB_URI` - Your MongoDB connection string
- All other variables from `.env.development.local`

### Step 2: Run the Seed Script

Open your terminal and run:

```bash
cd /vercel/share/v0-project
pnpm seed
```

**What this does:**
- Connects to MongoDB
- Clears existing products and categories
- Creates 5 test categories
- Creates 25 test products across all categories
- All with realistic pricing, discounts, and ratings

### Step 3: Verify Data

Open MongoDB Atlas:
1. Go to https://www.mongodb.com/cloud/atlas
2. Click your cluster
3. Click "Browse Collections"
4. You should see:
   - **categories** collection: 5 documents
   - **products** collection: 25 documents

---

## What Data Gets Created?

### Categories (5):
1. **Electronics**
   - Wireless Earbuds Pro
   - Smart Watch Ultra
   - USB-C Charger 65W
   - 4K Webcam
   - Wireless Keyboard Mouse

2. **Fashion**
   - Cotton T-Shirt
   - Denim Jeans
   - Casual Shoes
   - Winter Jacket
   - Sports Sneakers

3. **Home & Furniture**
   - Office Chair
   - Dining Table
   - Bed Sheet Set
   - Wall Lamp
   - Coffee Table

4. **Beauty & Personal Care**
   - Face Moisturizer
   - Hair Shampoo
   - Sunscreen SPF 50
   - Lip Balm
   - Hair Oil

5. **Sports & Outdoors**
   - Yoga Mat
   - Dumbbells Set
   - Running Shoes
   - Sports Water Bottle
   - Camping Tent

### Product Details:
- **Name**: Realistic product names
- **Price**: Range from ₹299 to ₹24,999
- **Discount**: 20-30% off on most items
- **Rating**: 4.2 to 4.6 stars
- **Stock**: 10-300 units
- **Images**: Placeholder images (you can update with real images later)
- **Description**: Product descriptions included

---

## Troubleshooting

### Issue: "MONGODB_URI is not defined"

**Solution:**
1. Go to your Vercel project settings (top-right gear icon)
2. Click "Vars"
3. Make sure `MONGODB_URI` is set
4. Restart terminal and try again

```bash
pnpm seed
```

### Issue: "Cannot find module 'mongoose'"

**Solution:**
1. Make sure dependencies are installed:
```bash
pnpm install
```

2. Try again:
```bash
pnpm seed
```

### Issue: Connection timeout

**Solution:**
1. Check MongoDB Atlas IP whitelist:
   - Go to MongoDB Atlas Dashboard
   - Click "Network Access"
   - Click "Add IP Address"
   - Select "Allow access from anywhere" or add your IP
   - Try seed again

### Issue: "Please define the MONGODB_URI environment variable"

**Solution:**
```bash
# Add to .env.development.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Then run:
pnpm seed
```

---

## Manual Data Addition

If you prefer to add products manually through the admin panel:

### Step 1: Create a Category
1. Login at http://localhost:3000/auth/login
   - Email: `superadmin@ziyacreations.com`
   - Password: `superadmin123`

2. Go to Admin Dashboard → Categories
3. Click "Add Category"
4. Fill in:
   - Name: "Electronics"
   - Description: "Latest electronic gadgets"
   - Click Save

### Step 2: Create a Product
1. Go to Admin Dashboard → Products
2. Click "Add Product"
3. Fill in:
   - Name: "Wireless Earbuds"
   - Price: 4999
   - Discounted Price: 3499
   - Category: Select "Electronics"
   - Stock: 50
   - SKU: "WEB-001"
   - Click Save

### Step 3: Add More Products
Repeat Step 2 for each product

---

## Testing with Seed Data

Once you've run the seed script, you can test the entire platform:

### 1. View Products
- Go to http://localhost:3000
- You should see all 5 categories
- Click a category to see products

### 2. Add to Cart
- Click a product
- Click "Add to Cart"
- View cart at http://localhost:3000/cart

### 3. Checkout
- Click "Proceed to Checkout"
- Fill in address
- Use test payment: `4111111111111111`
- Complete order

### 4. Admin Dashboard
- Go to http://localhost:3000/admin
- View all orders
- View all products
- Create coupons

---

## Resetting Data

If you want to clear all data and start fresh:

```bash
# This will delete all categories and products
pnpm seed
```

Or manually in MongoDB Atlas:
1. Go to Browse Collections
2. Click "products" → Delete all documents
3. Click "categories" → Delete all documents
4. Run `pnpm seed` again

---

## Next Steps

1. ✅ Run seed script: `pnpm seed`
2. ✅ Verify data in MongoDB
3. ✅ Start dev server: `pnpm dev`
4. ✅ Test shopping flow
5. ✅ Customize products with real images

---

## API Endpoints for Testing

After seeding, test these API endpoints:

### Get All Categories
```bash
curl http://localhost:3000/api/categories
```

### Get All Products
```bash
curl "http://localhost:3000/api/products?limit=12"
```

### Get Products by Category
```bash
curl "http://localhost:3000/api/products?category=<category_id>&limit=12"
```

### Get Single Product
```bash
curl "http://localhost:3000/api/products/wireless-earbuds-pro"
```

---

## Database Schema After Seeding

### Categories Collection
```
{
  _id: ObjectId,
  name: string,
  slug: string,
  description: string,
  image: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```
{
  _id: ObjectId,
  name: string,
  slug: string,
  description: string,
  price: number,
  discountedPrice: number,
  category: ObjectId (ref to Category),
  images: [string],
  stock: number,
  rating: number,
  reviewCount: number,
  sku: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Customization

### Change Product Prices
Edit `/vercel/share/v0-project/scripts/seed.ts` and modify prices in the `products` array.

### Add More Products
1. Open `scripts/seed.ts`
2. Add objects to the `products` array
3. Run `pnpm seed`

### Update Product Images
1. After seeding, go to Admin Dashboard
2. Edit each product
3. Upload real images (via Cloudinary integration)

---

## Support

If you have issues:
1. Check the Troubleshooting section above
2. Verify MongoDB Atlas is accessible
3. Check that MONGODB_URI is correct
4. Make sure ts-node is installed: `pnpm add -D ts-node`

---

**Ready to seed your database? Run: `pnpm seed`**
