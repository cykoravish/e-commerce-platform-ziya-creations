# Ziya Creations - Getting Started Guide

## 🎯 Quick Overview

Ziya Creations is a complete e-commerce platform with three types of users:
- **Super Admin**: Platform management, user management, analytics
- **Admin**: Product management, order processing
- **Customer**: Browse products, shop, track orders

---

## 📝 User Roles & Access

### 1. **Super Admin (Platform Owner)**
- Full platform control
- User management
- Analytics & reports
- System settings
- **Initial Setup Required** (See below)

### 2. **Admin (Staff)**
- Product CRUD operations
- Category management
- Order processing & fulfillment
- Coupon creation
- Customer support

### 3. **Customer (Regular User)**
- Browse & search products
- Add to cart & checkout
- Place orders with Razorpay
- Track orders
- Leave reviews & ratings
- Manage addresses

---

## 🚀 Getting Started - Step by Step

### **Phase 1: Initial Setup (Super Admin Creation)**

Since this is a new platform, you need to create the first Super Admin account directly in MongoDB.

#### **Option A: Direct MongoDB Insertion (Recommended for first setup)**

1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Connect to your database
3. Navigate to your database and find the `users` collection
4. Click "Insert Document" and paste:

```json
{
  "email": "superadmin@ziyacreations.com",
  "password": "$2b$10$YourHashedPasswordHere",
  "name": "Super Admin",
  "role": "super_admin",
  "phone": "9876543210",
  "isEmailVerified": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

**To generate the hashed password:**
- Use an online bcrypt generator: https://bcrypt.online/
- Enter your desired password (e.g., "superadmin123")
- Use rounds: 10
- Copy the hash and replace `$2b$10$YourHashedPasswordHere` with it

#### **Option B: Using Signup Flow (Normal)**

1. Visit http://localhost:3000/auth/signup
2. Enter email and password
3. You'll receive an OTP via email
4. After signup, manually change the role to `super_admin` in MongoDB

---

### **Phase 2: First Login (Super Admin)**

#### **Step 1: Navigate to Admin Login**
- Open http://localhost:3000/auth/login
- Click "Admin Login" or go directly to http://localhost:3000/auth/login?type=admin

#### **Step 2: Enter Credentials**
```
Email: superadmin@ziyacreations.com
Password: (your password)
```

#### **Step 3: Access Admin Dashboard**
- After successful login, you'll be redirected to http://localhost:3000/admin
- You'll see the Admin Dashboard with metrics and options

---

## 📊 Admin Dashboard Features

### **Dashboard Home** (`/admin`)
- View total users, products, orders
- See recent orders
- Quick navigation to all admin features

### **Products Management** (`/admin/products`)
**What you can do:**
- ✅ View all products with details
- ✅ Add new products (with images via Cloudinary)
- ✅ Edit product details (name, price, description)
- ✅ Manage inventory/stock
- ✅ Set discounts
- ✅ Delete products

**Add Product Form:**
```
- Name: "Premium Leather Wallet"
- Slug: "premium-leather-wallet" (auto-generated)
- Price: 1500
- Discounted Price: 999 (optional)
- Category: Select from dropdown
- Stock: 50
- Description: "High-quality genuine leather wallet"
- Images: Upload via Cloudinary
- Rating: 4.5 (initial rating)
```

### **Categories Management** (`/admin/categories`)
**What you can do:**
- ✅ Create new categories
- ✅ View all categories
- ✅ Edit category names
- ✅ Delete categories

**Example Categories:**
- Accessories
- Fashion
- Home & Kitchen
- Electronics
- Beauty & Personal Care

### **Orders Management** (`/admin/orders`)
**What you can do:**
- ✅ View all customer orders
- ✅ See order status (pending, processing, shipped, delivered)
- ✅ Track payment status
- ✅ View customer details
- ✅ See order items & total amount

### **Coupons Management** (`/admin/coupons`)
**What you can do:**
- ✅ Create discount coupons
- ✅ Set discount percentage or fixed amount
- ✅ Set expiry dates
- ✅ Limit usage per user
- ✅ View coupon usage statistics

**Create Coupon Example:**
```
Code: SAVE20
Discount Type: Percentage
Discount Value: 20
Max Uses: 100
Expiry Date: 2025-12-31
Min Order Amount: 500
```

---

## 🛍️ Customer Experience (Shopping)

### **Phase 1: Customer Signup**

#### **Step 1: Go to Signup**
- Visit http://localhost:3000/auth/signup

#### **Step 2: Enter Details**
```
Name: John Doe
Email: john@example.com
Password: SecurePassword123
Phone: 9876543210
```

#### **Step 3: Verify OTP**
- Check your email for OTP
- Enter OTP on verification page
- Account is now active!

### **Phase 2: Browse & Shop**

#### **Step 1: Home Page** (`/`)
- View all products or filter by category
- See product cards with:
  - Product image
  - Price and discounted price
  - Star ratings
  - Quick add-to-cart button

#### **Step 2: View Product Details** (`/products/[slug]`)
- Full product information
- High-quality images
- Customer reviews & ratings
- Add to cart with quantity selector
- See related products

#### **Step 3: Shopping Cart** (`/cart`)
- View all cart items
- Change quantities
- Apply coupon code
- See total price with discount
- Proceed to checkout

**Cart Features:**
- Persistent storage (survives page reload)
- Update quantities
- Remove items
- See real-time total
- Apply discount codes

### **Phase 3: Checkout & Payment**

#### **Step 1: Go to Checkout** (`/checkout`)
- Review cart items
- Select or add shipping address

#### **Step 2: Add Shipping Address**
```
Full Name: John Doe
Street: 123 Main Street
City: Mumbai
State: Maharashtra
Postal Code: 400001
Phone: 9876543210
```

#### **Step 3: Select Address & Payment**
- Choose shipping address
- Apply coupon (optional)
- See order summary:
  - Subtotal
  - Discount (if coupon applied)
  - Taxes
  - Final Total

#### **Step 4: Complete Payment**
- Click "Pay with Razorpay"
- **Test Razorpay Credentials:**
  ```
  Card Number: 4111111111111111
  Expiry: 12/25
  CVV: 123
  OTP: 123456 (if prompted)
  ```
- Payment will be processed
- Order confirmation email sent
- Redirected to order details page

### **Phase 4: Track Orders** (`/orders`)
- View all your orders
- See order status:
  - Pending (waiting for payment)
  - Processing (being prepared)
  - Shipped (on the way)
  - Delivered (completed)
- Click on order to see details
- Track shipment

### **Phase 5: Reviews & Ratings**
- After delivery, leave reviews
- Rate products 1-5 stars
- Write detailed reviews
- See reviews from other customers

### **Phase 6: Account Management** (`/account`)
- View profile information
- Manage addresses
- View order history
- Download invoices
- Manage preferences
- Logout

---

## 🔑 Quick Login Credentials

### **Super Admin (First Time)**
```
Email: superadmin@ziyacreations.com
Password: (your chosen password)
Role: Super Admin
Access: Full platform control
Dashboard: /admin
```

### **Regular Admin (Staff)**
```
Email: admin@ziyacreations.com
Password: (set by super admin)
Role: Admin
Access: Product & Order management
Dashboard: /admin
```

### **Customer**
```
Email: customer@example.com
Password: (user's chosen password)
Role: Customer
Access: Shopping features only
Dashboard: /
```

---

## 🧪 Testing the Platform

### **Test Scenario 1: Create a Product**

1. **Login as Super Admin**
   - Go to http://localhost:3000/auth/login
   - Enter super admin credentials

2. **Add a Product**
   - Navigate to `/admin/products`
   - Click "Add New Product"
   - Fill in:
     - Name: "Test Wireless Earbuds"
     - Price: 2999
     - Stock: 25
     - Category: Electronics
     - Upload image from Cloudinary

3. **Verify Product is Live**
   - Go to home page `/`
   - Product appears in product grid
   - Can add to cart

### **Test Scenario 2: Complete Customer Journey**

1. **Sign Up as Customer**
   - Go to http://localhost:3000/auth/signup
   - Fill in details
   - Verify email with OTP

2. **Browse Products**
   - Filter by category
   - Click on product to view details
   - See reviews from other customers

3. **Add to Cart**
   - Add 2-3 products
   - See cart updated
   - View cart `/cart`

4. **Apply Coupon**
   - On checkout page
   - Enter coupon code (if super admin created one)
   - See discount applied

5. **Complete Checkout**
   - Add shipping address
   - Make payment with test card
   - Order confirmation received

6. **Track Order**
   - Go to `/orders`
   - See order status
   - View order details

---

## 📧 Email Notifications

The platform sends emails for:

1. **OTP Verification**
   - When user signs up
   - Includes 6-digit OTP code
   - Valid for 10 minutes

2. **Order Confirmation**
   - After successful payment
   - Contains order details & invoice link

3. **Order Updates**
   - When status changes (shipped, delivered)
   - Real-time tracking info

**Note:** Emails use Gmail SMTP. Make sure `EMAIL_USER` and `EMAIL_PASSWORD` are configured.

---

## 💳 Payment Gateway (Razorpay)

### **Test Cards for Development**

| Type | Card Number | Exp | CVV | OTP |
|------|------------|-----|-----|-----|
| Success | 4111111111111111 | 12/25 | 123 | 123456 |
| Failure | 4000000000000002 | 12/25 | 123 | 123456 |
| Recurring | 4111111111111111 | 12/25 | 123 | 123456 |

**How Payment Works:**
1. Customer places order
2. Directed to Razorpay payment gateway
3. Enters test card details
4. Enters OTP (123456)
5. Payment processed
6. Order marked as "paid"
7. Super admin can see in orders dashboard

---

## 🎨 Customization

### **Change Platform Name**
- File: `app/page.tsx`
- Change: `<Link href="/" className="text-2xl font-bold text-blue-600">Ziya Creations</Link>`

### **Change Colors**
- File: `app/globals.css`
- Update: Color variables and Tailwind classes

### **Add Your Logo**
- Upload to `/public/logo.png`
- Update header in `app/page.tsx`

### **Customize Email Templates**
- File: `lib/email.ts`
- Modify HTML templates for OTP and order confirmation

---

## 🔧 Common Issues & Solutions

### **Issue: "Email not sending"**
**Solution:**
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in env vars
- Enable Gmail App Passwords (not regular password)
- Allow "Less secure apps" (if not using App Password)

### **Issue: "Payment fails"**
**Solution:**
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- Use test cards provided above
- Check Razorpay dashboard for API key status

### **Issue: "Cannot upload images"**
**Solution:**
- Verify Cloudinary credentials in env vars
- Check API key permissions in Cloudinary dashboard
- Test API key validity

### **Issue: "Database connection failed"**
**Solution:**
- Check `MONGODB_URI` format
- Verify IP whitelist in MongoDB Atlas
- Test connection string in MongoDB Compass

---

## 📱 Website URLs

### **Customer Pages**
- Home: http://localhost:3000
- Products: http://localhost:3000/products/[slug]
- Cart: http://localhost:3000/cart
- Checkout: http://localhost:3000/checkout
- Orders: http://localhost:3000/orders
- Account: http://localhost:3000/account
- Signup: http://localhost:3000/auth/signup
- Login: http://localhost:3000/auth/login

### **Admin Pages**
- Dashboard: http://localhost:3000/admin
- Products: http://localhost:3000/admin/products
- Categories: http://localhost:3000/admin/categories
- Orders: http://localhost:3000/admin/orders
- Coupons: http://localhost:3000/admin/coupons

---

## ✅ Checklist - Your First 30 Minutes

- [ ] Set all environment variables
- [ ] Start dev server (`pnpm dev`)
- [ ] Create Super Admin account in MongoDB
- [ ] Login to admin dashboard
- [ ] Create a test product
- [ ] Create a test category
- [ ] Create a test coupon
- [ ] Sign up as a customer
- [ ] Browse products on home page
- [ ] Add product to cart
- [ ] Complete checkout with test payment
- [ ] View order in admin dashboard
- [ ] View order in customer account

---

## 🎓 Next Steps

1. **Configure all external services** (MongoDB, Gmail, Razorpay, Cloudinary)
2. **Populate with real products** via admin panel
3. **Test complete shopping flow** with test payment
4. **Customize branding** (colors, logo, name)
5. **Deploy to Vercel** for production
6. **Set up real payment keys** for production
7. **Configure production database** for Vercel

---

## 📞 Support

For issues or questions:
1. Check the API_DOCUMENTATION.md for endpoint details
2. Review IMPLEMENTATION_NOTES.md for architecture
3. Check console logs for error messages
4. Verify all environment variables are set correctly

---

**You're all set! Start building your e-commerce empire with Ziya Creations! 🚀**
