# Quick Start Guide - 5 Minutes to Launch

## ⚡ Super-Quick Setup

### **1. Set Environment Variables (in Project Settings)**

Click settings (top-right) → Vars → Add these:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ziya
JWT_SECRET=your-secret-key-here
BCRYPT_ROUNDS=10
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RAZORPAY_KEY_ID=test-key-id
RAZORPAY_KEY_SECRET=test-secret
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Need these values?**
- **MongoDB**: Create account at https://www.mongodb.com/cloud/atlas
- **Gmail**: Enable 2FA → Generate App Password at https://myaccount.google.com/apppasswords
- **Razorpay**: Sign up at https://razorpay.com (test credentials provided)
- **Cloudinary**: Sign up at https://cloudinary.com

---

### **2. Create Super Admin in MongoDB**

1. Go to MongoDB Atlas
2. Select your database → Collections → Users → Insert Document
3. Paste this:

```json
{
  "email": "superadmin@ziyacreations.com",
  "password": "$2b$10$EIXwL/glR3e.tIUYKgfcLOLwKlY8aQrVVsRHCHzKjWQvQwX0MNVvW",
  "name": "Super Admin",
  "role": "super_admin",
  "phone": "9876543210",
  "isEmailVerified": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

**Password is:** `superadmin123`

Want to change it?
- Go to https://bcrypt.online/
- Enter your password, rounds: 10
- Copy hash and replace the `password` field

4. Click "Insert Document"

---

### **3. Start the App**

Open terminal and run:
```bash
cd /vercel/share/v0-project
pnpm dev
```

Wait for: `✓ Compiled successfully` and `Ready on http://localhost:3000`

---

## 🎯 First 10 Minutes

### **Minute 1-2: Login as Super Admin**
- Go to http://localhost:3000/auth/login
- Email: `superadmin@ziyacreations.com`
- Password: `superadmin123`
- ✓ You're in admin dashboard!

### **Minute 3-4: Create a Category**
- Click `/admin/categories`
- "Add Category"
- Name: `Electronics`
- Create
- ✓ Category added!

### **Minute 5-6: Add a Product**
- Click `/admin/products`
- "Add Product"
- Fill in:
  - Name: `Test Wireless Earbuds`
  - Category: `Electronics`
  - Price: `2999`
  - Stock: `50`
- Create
- ✓ Product added!

### **Minute 7-8: Test as Customer**
- Open incognito window
- Go to http://localhost:3000
- ✓ See your product on home page!
- Click on it → See details

### **Minute 9-10: Add to Cart**
- Click "Add to Cart"
- Go to `/cart`
- Click "Checkout"
- ✓ See checkout form!

---

## 🔓 Login Credentials

### **Super Admin**
```
Email: superadmin@ziyacreations.com
Password: superadmin123
Portal: http://localhost:3000/admin
```

### **Test Customer**
```
Email: customer@example.com
Password: customer123
(Create your own by signing up at /auth/signup)
```

### **Test Payment**
```
Card: 4111111111111111
Expiry: 12/25
CVV: 123
OTP: 123456
```

---

## 📍 Key Pages

| Purpose | URL | Who Uses It |
|---------|-----|-----------|
| Admin Dashboard | `/admin` | Super Admin |
| Add Products | `/admin/products` | Super Admin |
| Manage Orders | `/admin/orders` | Super Admin |
| Shop Home | `/` | Customers |
| Product Details | `/products/[slug]` | Customers |
| Shopping Cart | `/cart` | Customers |
| Checkout | `/checkout` | Customers |
| My Orders | `/orders` | Customers |
| Profile | `/account` | Customers |

---

## 🎯 Super Admin Tasks

### **Task 1: Add Products** ⏱️ 5 min
1. Go to `/admin/products`
2. Click "Add New Product"
3. Fill form (name, price, category, images, stock)
4. Click "Create"
5. ✓ Product is live!

### **Task 2: Create Promotion** ⏱️ 3 min
1. Go to `/admin/coupons`
2. Click "Create Coupon"
3. Enter:
   - Code: `SAVE20`
   - Type: Percentage
   - Value: 20
   - Expiry: Any future date
4. Click "Create"
5. ✓ Share code with customers!

### **Task 3: Process Orders** ⏱️ 2 min
1. Go to `/admin/orders`
2. See all customer orders
3. Click on order
4. Click "Update Status" → Select "Shipped"
5. ✓ Customer gets email notification!

---

## 🛒 Customer Experience

### **Sign Up** ⏱️ 3 min
1. Go to `/auth/signup`
2. Enter email, password, phone
3. Click "Sign Up"
4. Get OTP in email
5. Enter OTP
6. ✓ Account created!

### **Shop** ⏱️ 5 min
1. Go to home `/`
2. Filter by category
3. Click product
4. Click "Add to Cart"
5. Go to `/cart`
6. Click "Checkout"

### **Pay** ⏱️ 3 min
1. Enter shipping address
2. Apply coupon (optional)
3. Click "Pay with Razorpay"
4. Enter test card: `4111111111111111`
5. ✓ Order placed!

### **Track** ⏱️ 1 min
1. Go to `/orders`
2. Click on order
3. See status: Processing → Shipped → Delivered
4. ✓ Real-time tracking!

---

## 🚀 Deploy to Vercel

### **Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial Ziya Creations setup"
git push origin main
```

### **Step 2: Connect to Vercel**
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repo
4. Click "Import"

### **Step 3: Add Environment Variables**
- Click "Environment Variables"
- Add all the variables from "Set Environment Variables" section above
- Click "Deploy"

### **Step 4: Live!** 🎉
- Your app is deployed!
- Share the URL with customers
- Real Razorpay keys needed for production
- Real email setup needed for production

---

## 🆘 Troubleshooting

### **"Can't login"**
✓ Check MongoDB has Super Admin document
✓ Verify JWT_SECRET is set
✓ Clear browser cache

### **"Images not uploading"**
✓ Check Cloudinary credentials
✓ API key should have "Upload" permission
✓ Verify CLOUDINARY_NAME is correct

### **"Emails not sending"**
✓ Check EMAIL_USER (should be Gmail)
✓ Use App Password, not regular password
✓ Enable 2FA on Gmail first

### **"Payment not working"**
✓ Use test card: 4111111111111111
✓ Check Razorpay keys are set
✓ Verify RAZORPAY_KEY_ID in env

### **"Products not showing"**
✓ Go to `/admin/products`
✓ Create at least one product
✓ Make sure category exists first
✓ Refresh page

---

## 📚 More Info

For detailed guides, see:
- **GETTING_STARTED.md** - Complete setup guide
- **SUPER_ADMIN_GUIDE.md** - Admin operations
- **USER_JOURNEYS.md** - User flows
- **API_DOCUMENTATION.md** - API reference
- **IMPLEMENTATION_NOTES.md** - Architecture

---

## ✅ Launch Checklist

- [ ] Environment variables set
- [ ] Super Admin created in MongoDB
- [ ] Dev server running (`pnpm dev`)
- [ ] Can login to admin dashboard
- [ ] Can create a category
- [ ] Can create a product
- [ ] Product appears on home page
- [ ] Can add to cart as customer
- [ ] Can complete checkout (test payment)
- [ ] Order appears in admin dashboard

---

**You're ready! Start your e-commerce empire! 🚀**

**Next: Add more products and promote them!**
