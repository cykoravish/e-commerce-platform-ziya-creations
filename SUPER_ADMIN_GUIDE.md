# Super Admin Guide - Ziya Creations

## 👑 What is a Super Admin?

A Super Admin has **full control** over the entire e-commerce platform. They can:
- Manage all products and categories
- Process and fulfill orders
- Create marketing coupons
- Manage other admins and users
- View analytics and reports
- Configure system settings

---

## 🔐 First Login - Step by Step

### **Step 1: Prepare Your Database**

Before logging in, you need to create a Super Admin account in your MongoDB database.

#### **Option A: Using MongoDB Atlas UI (Easiest)**

1. **Open MongoDB Atlas**
   - Go to https://www.mongodb.com/cloud/atlas
   - Login with your account
   - Select your cluster
   - Click "Browse Collections"

2. **Find the Users Collection**
   - Expand your database
   - Click on "users" collection
   - Click "+ INSERT DOCUMENT"

3. **Insert Super Admin Document**
   - Delete the auto-generated `_id` field
   - Paste the following JSON:

```json
{
  "_id": ObjectId(),
  "email": "superadmin@ziyacreations.com",
  "password": "$2b$10$EIXwL/glR3e.tIUYKgfcLOLwKlY8aQrVVsRHCHzKjWQvQwX0MNVvW",
  "name": "Super Admin",
  "role": "super_admin",
  "phone": "9876543210",
  "isEmailVerified": true,
  "createdAt": new Date(),
  "updatedAt": new Date(),
  "__v": 0
}
```

**Note:** The password hash above is for password: `superadmin123`

4. **Generate Your Own Password Hash**
   - Go to https://bcrypt.online/
   - Enter your desired password (e.g., `YourSecurePassword123`)
   - Set rounds to: `10`
   - Click "Hash"
   - Copy the hash starting with `$2b$10$`
   - Replace the password field with your hash

5. **Click "Insert"**
   - Your Super Admin account is created!

#### **Option B: Using MongoDB Compass**

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `ziya_creations` > `users`
4. Click "Insert Document"
5. Paste the Super Admin JSON (same as above)
6. Click "Insert"

---

### **Step 2: Start the Application**

1. **Open Terminal**
   ```bash
   cd /vercel/share/v0-project
   pnpm dev
   ```

2. **Wait for Server to Start**
   - You should see: `Ready in XXXms`
   - App is running on http://localhost:3000

---

### **Step 3: Navigate to Login**

1. **Open Browser**
   - Go to http://localhost:3000/auth/login

2. **You'll see a login form**
   - If you see "Customer Login", that's fine
   - (Admin login uses the same form with admin credentials)

3. **Enter Your Credentials**
   ```
   Email: superadmin@ziyacreations.com
   Password: superadmin123 (or your custom password)
   ```

4. **Click "Login"**
   - System will verify your role
   - Redirects to Admin Dashboard: http://localhost:3000/admin

---

## 📊 Super Admin Dashboard Overview

### **Dashboard Home** - `/admin`

This is your command center showing:

**Key Metrics:**
- Total Users (customers registered)
- Total Products (in catalog)
- Total Orders (all time)
- Total Revenue (sum of all orders)

**Recent Orders Section:**
- Last 5 orders placed
- Order ID, Customer, Amount, Status
- Click to view full order details

**Quick Navigation:**
- Products Management
- Categories Management
- Orders Management
- Coupons Management

---

## 🛍️ Products Management - `/admin/products`

### **Viewing Products**

When you first access this page, you'll see:
- **Empty list** (no products yet - this is normal!)
- "Add New Product" button

### **Add Your First Product**

1. **Click "Add New Product"**
   - Form opens with fields:

2. **Fill in Product Details**

```
BASIC INFO:
- Product Name: "Premium Leather Wallet"
- Category: (Select from dropdown - if empty, create category first)
- Price: 1500
- Discounted Price: 999 (Optional - for sales)
- Stock Quantity: 50

DESCRIPTION:
- Description: "Genuine leather wallet with 
   multiple card slots, made with premium materials"

IMAGES:
- Click "Upload Image" to add product photos
- You can upload multiple images
```

3. **Click "Create Product"**
   - Product is created
   - Gets a unique URL slug
   - Appears on home page for customers

### **Edit Product**

1. Find the product in the list
2. Click the "Edit" icon (pencil)
3. Modify any fields
4. Click "Update"

### **Delete Product**

1. Find the product in the list
2. Click the "Delete" icon (trash)
3. Confirm deletion
4. Product is removed from catalog

### **Product Fields Explained**

| Field | Purpose | Example |
|-------|---------|---------|
| Name | Product title shown to customers | "Wireless Bluetooth Earbuds" |
| Slug | URL identifier (auto-generated) | wireless-bluetooth-earbuds |
| Category | Product category | Electronics |
| Price | Original/regular price | 2999 |
| Discounted Price | Sale price (optional) | 1999 |
| Stock | Quantity available | 100 |
| Images | Product photos | Upload 3-5 images |
| Description | Detailed product info | "High-quality audio..." |

---

## 📂 Categories Management - `/admin/categories`

### **Create Category**

1. Go to `/admin/categories`
2. Click "Add New Category"
3. Enter category name: "Electronics"
4. System auto-generates slug: "electronics"
5. Click "Create"

### **Common Categories for E-Commerce**

```
- Electronics
- Fashion & Apparel
- Home & Kitchen
- Beauty & Personal Care
- Sports & Outdoors
- Books & Media
- Toys & Games
- Jewelry & Accessories
- Shoes
- Furniture
```

### **Edit/Delete Categories**

- Click "Edit" to rename
- Click "Delete" to remove
- Products in category remain (just without category assignment)

---

## 📦 Orders Management - `/admin/orders`

### **View All Orders**

Navigate to `/admin/orders` to see:
- All customer orders
- Order ID
- Customer name
- Order amount
- Payment status (Paid/Pending)
- Order status (Processing/Shipped/Delivered)

### **Order Statuses Explained**

| Status | Meaning | Your Action |
|--------|---------|------------|
| Pending | Customer placed order, awaiting payment | Monitor payment |
| Processing | Order paid, being prepared | Pack & ship |
| Shipped | On way to customer | Update tracking |
| Delivered | Reached customer | Close order |
| Cancelled | Customer cancelled | Refund if paid |

### **View Order Details**

1. Click on any order in the list
2. See:
   - Customer information
   - Shipping address
   - Items ordered (with quantities)
   - Payment details
   - Timeline of status changes

### **Update Order Status**

1. Open order details
2. Click "Update Status" button
3. Select new status from dropdown:
   - Processing (preparing for shipment)
   - Shipped (sent with tracking)
   - Delivered (reached customer)
4. Click "Update"
5. Customer receives email notification

---

## 🎟️ Coupons Management - `/admin/coupons`

### **Create a Discount Coupon**

1. Go to `/admin/coupons`
2. Click "Create New Coupon"
3. Fill in details:

```
COUPON CODE: SAVE20
(What customers enter at checkout)

DISCOUNT TYPE: Percentage
(Choose: Percentage OR Fixed Amount)

DISCOUNT VALUE: 20
(If Percentage: 20% off)
(If Fixed: ₹500 off)

MINIMUM ORDER AMOUNT: 500
(Coupon only applies to orders ≥ ₹500)

MAXIMUM USES: 100
(How many times coupon can be used total)

EXPIRY DATE: 2025-12-31
(When coupon stops working)

DESCRIPTION: "Flat 20% off on all products"
(Shown to customers)
```

4. Click "Create Coupon"
5. Coupon is active immediately

### **Coupon Examples**

**Flash Sale:**
```
Code: FLASH50
Type: Percentage
Value: 50%
Max Uses: 10 (limited quantity)
Expiry: Today + 1 day
```

**New Customer:**
```
Code: WELCOME15
Type: Percentage
Value: 15%
Max Uses: Unlimited
Expiry: 3 months from today
```

**Clearance:**
```
Code: CLEARANCE
Type: Fixed Amount
Value: ₹500
Min Order: ₹1000
Max Uses: 50
```

### **How Customers Use Coupons**

1. Add products to cart
2. Go to checkout
3. See "Enter Coupon Code" field
4. Type: `SAVE20`
5. Click "Apply"
6. Discount appears in order total
7. Proceed to payment

---

## 📊 Analytics & Metrics

On the Admin Dashboard, you see:

### **Key Metrics**

1. **Total Users**
   - How many customers have signed up
   - Indicates market reach

2. **Total Products**
   - How many products in catalog
   - Affects customer choice

3. **Total Orders**
   - Lifetime orders processed
   - Business volume indicator

4. **Total Revenue**
   - Sum of all order amounts
   - Business profitability

### **Recent Orders Section**

Shows last 5 orders with:
- Order reference ID
- Customer name
- Order total amount
- Current status
- Option to view full details

---

## 🔒 Security Best Practices

### **Your Super Admin Account**

1. **Use Strong Password**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Don't reuse passwords

2. **Keep Credentials Private**
   - Don't share with anyone
   - Don't commit to Git
   - Use secure password manager

3. **Regular Backups**
   - Export database monthly
   - Keep in secure location

4. **Monitor Activity**
   - Regularly check orders
   - Review product list
   - Monitor suspicious patterns

### **Environment Variables**

Keep these secret:
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Session encryption key
- `RAZORPAY_KEY_SECRET` - Payment processing
- `CLOUDINARY_API_SECRET` - Image storage

Never commit `.env` files to Git!

---

## 📈 Daily Operations Checklist

### **Morning**
- [ ] Login to admin dashboard
- [ ] Check new orders overnight
- [ ] Verify payment status
- [ ] Update order statuses (process shipments)

### **Throughout Day**
- [ ] Monitor new orders
- [ ] Respond to customer inquiries
- [ ] Update shipping tracking
- [ ] Handle returns/cancellations

### **End of Day**
- [ ] Confirm all orders processed
- [ ] Update any pending shipments
- [ ] Review product inventory
- [ ] Check for stock issues

### **Weekly**
- [ ] Analyze sales trends
- [ ] Review customer feedback
- [ ] Plan new promotions/coupons
- [ ] Add new products if needed

---

## 🚨 Troubleshooting

### **Problem: Can't Login**

**Solution:**
1. Verify email is correct
2. Check password is correct
3. Confirm account exists in MongoDB
4. Check if `role` field is `"super_admin"`
5. Verify `JWT_SECRET` is set in env vars

### **Problem: Products Not Showing**

**Solution:**
1. Go to `/admin/products`
2. Click "Add New Product"
3. Make sure category exists first
4. Fill all required fields
5. Click "Create Product"

### **Problem: Emails Not Sending**

**Solution:**
1. Check `EMAIL_USER` (Gmail address)
2. Verify `EMAIL_PASSWORD` (App Password, not regular)
3. Enable 2FA on Gmail
4. Generate App Password from myaccount.google.com/apppasswords

### **Problem: Payment Not Processing**

**Solution:**
1. Verify Razorpay test keys in env vars
2. Use test card: 4111111111111111
3. Use test OTP: 123456
4. Check Razorpay dashboard for errors
5. Verify `NEXT_PUBLIC_API_URL` is correct

---

## 💡 Tips & Tricks

1. **Bulk Product Upload**
   - Currently: Add one at a time
   - Future: Import CSV with multiple products

2. **Email Reminders**
   - Set up filters for pending orders
   - Create alerts for low stock

3. **Coupon Strategy**
   - Use discount coupons for promotions
   - Track which codes are popular
   - Adjust expiry dates based on usage

4. **Product Photography**
   - Use high-quality images
   - Cloudinary auto-optimizes for web
   - Customers trust good product photos

---

## 📞 Quick Reference

### **Important URLs**

- Admin Dashboard: http://localhost:3000/admin
- Products: http://localhost:3000/admin/products
- Categories: http://localhost:3000/admin/categories
- Orders: http://localhost:3000/admin/orders
- Coupons: http://localhost:3000/admin/coupons

### **Default Credentials**

```
Email: superadmin@ziyacreations.com
Password: superadmin123
Role: Super Admin
```

### **Test Card for Payments**

```
Card: 4111111111111111
Expiry: 12/25
CVV: 123
OTP: 123456
```

---

**You're ready to manage your e-commerce store! 🚀**

**Next: Create your first product and start selling!**
