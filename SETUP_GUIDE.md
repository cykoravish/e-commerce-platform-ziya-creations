# Ziya Creations - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Razorpay account
- Cloudinary account
- Gmail account (for sending emails)

## Step-by-Step Setup

### Step 1: Configure MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Create a database named `ziya_creations`

### Step 2: Configure Email Service

1. Go to [Gmail](https://gmail.com)
2. Enable 2-factor authentication
3. Create an App Password
4. Copy the 16-character password

### Step 3: Configure Razorpay

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings > API Keys
3. Copy your Key ID and Key Secret

### Step 4: Configure Cloudinary

1. Go to [Cloudinary Console](https://cloudinary.com/console/)
2. Copy your Cloud Name, API Key, and API Secret

### Step 5: Environment Setup

Create `.env.local` in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ziya_creations

# JWT Configuration
JWT_SECRET=your-random-32-character-secret-key-here-at-least-32-chars
BCRYPT_ROUNDS=10

# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret-key

# Cloudinary Configuration
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Application URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 6: Install Dependencies

```bash
pnpm install
```

### Step 7: Generate JWT Secret

If you don't have a JWT secret, generate one:

```bash
openssl rand -base64 32
```

Copy the output to `JWT_SECRET` in `.env.local`

### Step 8: Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## First Time Setup

### 1. Create a Test Customer Account

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in the form with test data
4. Check console logs or your email for the OTP
5. Enter the OTP to verify

### 2. Create an Admin User

Connect to MongoDB and insert an admin user:

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@ziyacreations.com",
  phone: "9999999999",
  password: "$2a$10$...", // Use bcrypt hash of password "admin123"
  role: "admin",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or create via the API:
1. Sign up as a regular customer
2. Update the user in MongoDB: `db.users.updateOne({email: "admin@ziyacreations.com"}, {$set: {role: "admin"}})`

### 3. Create Test Products

1. Login as admin at http://localhost:3000/auth/login
2. Go to http://localhost:3000/admin/products
3. Click "Add Product"
4. Fill in product details
5. Save

Or use the API:

```bash
curl -X POST http://localhost:3000/api/admin/products/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "Sample Product",
    "description": "Test product",
    "price": 999,
    "category": "CATEGORY_ID",
    "sku": "SKU001",
    "stock": 100
  }'
```

### 4. Create Categories

1. Go to http://localhost:3000/admin/categories
2. Click "Add Category"
3. Fill in category details
4. Save

## Testing the Platform

### Customer Flow
1. Browse products on homepage
2. Filter by category
3. Click on product to view details
4. Add to cart
5. Go to cart
6. Proceed to checkout
7. Select address (create new if needed)
8. Place order

### Admin Flow
1. Login as admin
2. Go to dashboard
3. Manage products, categories, and coupons
4. View orders

## Common Issues & Solutions

### MongoDB Connection Error
- Check MongoDB URI in `.env.local`
- Ensure IP whitelist includes your machine IP
- Verify database name matches

### Email Not Sending
- Verify Gmail credentials in `.env.local`
- Ensure App Password is used (not regular password)
- Check spam folder for emails

### Build Errors
```bash
# Clear cache and rebuild
pnpm clean
pnpm build
```

### Database Issues
```bash
# Check MongoDB connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/ziya_creations"
```

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Database indexes created
- [ ] Email templates tested
- [ ] Payment gateway credentials verified
- [ ] Image upload working with Cloudinary
- [ ] Admin users created
- [ ] Initial products added
- [ ] Test order completed
- [ ] Admin dashboard accessible
- [ ] All pages loading correctly

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
vercel deploy
```

### Update NEXT_PUBLIC_API_URL

In production, update `NEXT_PUBLIC_API_URL` to your Vercel domain:

```env
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

## Support

For detailed API documentation, check `README.md`

For issues, review console logs:

```bash
# In development
pnpm dev
# Check browser console and terminal output
```

## Next Steps

1. Configure payment gateway to go live
2. Set up email notifications
3. Create social media login (OAuth)
4. Add advanced search and filters
5. Implement analytics
6. Set up CDN for images
7. Add backup and monitoring

Enjoy building with Ziya Creations!
