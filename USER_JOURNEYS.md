# User Journeys - Complete Platform Flow

## 📊 Platform User Types & Access Levels

```
┌─────────────────────────────────────────────────────────┐
│                  ZIYA CREATIONS PLATFORM                │
└─────────────────────────────────────────────────────────┘
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
      ┌────────────┐ ┌────────────┐ ┌────────────┐
      │ SUPER ADMIN│ │   ADMIN    │ │ CUSTOMER   │
      │ (Owner)    │ │  (Staff)   │ │(Shoppers)  │
      └────────────┘ └────────────┘ └────────────┘
           │              │              │
      Full Platform   Product/Order   Shopping
      Control         Management      Experience
```

---

## 🔐 Journey 1: Super Admin Setup & Login

### **Initial Setup (One-time)**

```
START
  │
  ├─ Create MongoDB Database
  │   └─ Get MongoDB URI
  │
  ├─ Insert Super Admin Document
  │   └─ Email: superadmin@ziyacreations.com
  │   └─ Password: (hashed with bcrypt)
  │   └─ Role: super_admin
  │
  └─ START APPLICATION
      └─ pnpm dev
```

### **First Login Flow**

```
VISIT: http://localhost:3000/auth/login
           │
           ▼
    Enter Credentials:
    Email: superadmin@ziyacreations.com
    Password: ••••••••
           │
           ▼
    API validates credentials
           │
           ▼
    ✓ Password matches ─→ Generate JWT Token
           │
           ▼
    Token stored in browser
           │
           ▼
    Redirect: /admin (Dashboard)
           │
           ▼
    DASHBOARD LOADED ✓
    (See metrics, recent orders)
```

### **Daily Admin Login**

```
VISIT: http://localhost:3000/auth/login
           │
           ▼
    Enter Email & Password
           │
           ▼
    JWT Token generated
           │
           ▼
    Redirect to /admin
           │
           ▼
    ✓ LOGGED IN - Full Access
```

---

## 📦 Journey 2: Super Admin - Product Management

### **Create Product Workflow**

```
START: /admin/products
           │
           ▼
    See Product List (empty initially)
           │
           ▼
    Click "Add New Product"
           │
           ▼
    PRODUCT FORM appears:
    ┌─────────────────────────────────────┐
    │ Product Name: "Wireless Earbuds"   │
    │ Category: Electronics               │
    │ Price: 2999                        │
    │ Discounted Price: 1999              │
    │ Stock: 50                           │
    │ Description: [Long text...]         │
    │ Upload Images (via Cloudinary)      │
    └─────────────────────────────────────┘
           │
           ▼
    Click "Create Product"
           │
           ▼
    API Validates:
    ✓ Name not empty
    ✓ Price is valid
    ✓ Stock >= 0
    ✓ Category exists
           │
           ▼
    Product created in database
    │
    ├─ Assigned unique slug: "wireless-earbuds"
    ├─ Status: Active
    └─ Visible to customers: YES
           │
           ▼
    Success Message: "Product Created!"
           │
           ▼
    Redirect: /admin/products
           │
           ▼
    Product appears in list ✓
```

### **Edit Product Workflow**

```
VIEW PRODUCT → Click Edit ─→ EDIT FORM
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
            Change    Change     Change
            Price     Stock      Images
                    │
                    ▼
            Click "Update Product"
                    │
                    ▼
            Database Updated
                    │
                    ▼
            ✓ Customers see new info immediately
```

---

## 📂 Journey 3: Super Admin - Category Management

### **Create Category**

```
VISIT: /admin/categories
           │
           ▼
    Click "Add Category"
           │
           ▼
    Enter Name: "Electronics"
           │
           ▼
    Auto-generate Slug: "electronics"
           │
           ▼
    Click "Create"
           │
           ▼
    Category Stored
           │
           ▼
    Customers see category in filters ✓
```

### **Category Organization**

```
Electronics
├─ Laptops
├─ Phones
├─ Accessories
└─ Gaming

Fashion
├─ Men's Clothing
├─ Women's Clothing
├─ Accessories
└─ Shoes

Home & Kitchen
├─ Furniture
├─ Decor
└─ Cookware
```

---

## 🎟️ Journey 4: Super Admin - Create Promotions

### **Create Discount Coupon**

```
VISIT: /admin/coupons
           │
           ▼
    Click "Create Coupon"
           │
           ▼
    COUPON FORM:
    ┌──────────────────────────────┐
    │ Code: SAVE20                 │
    │ Type: Percentage             │
    │ Value: 20                    │
    │ Min Order: 500               │
    │ Max Uses: 100                │
    │ Expiry: 2025-12-31           │
    └──────────────────────────────┘
           │
           ▼
    Click "Create"
           │
           ▼
    Coupon Active ✓
           │
           ▼
    Share with customers:
    "Use code SAVE20 for 20% off!"
```

### **How Customers Use It**

```
Customer in Cart
      │
      ├─ Items: ₹1000
      │
      ├─ Enter Coupon: SAVE20
      │
      ├─ Calculate: 1000 × 20% = ₹200 discount
      │
      └─ New Total: ₹800 ✓
```

---

## 👥 Journey 5: Customer - Sign Up

### **Registration Flow**

```
VISIT: http://localhost:3000/auth/signup
           │
           ▼
    SIGNUP FORM:
    ┌─────────────────────────────┐
    │ Full Name: John Doe         │
    │ Email: john@example.com     │
    │ Password: ••••••••          │
    │ Phone: 9876543210           │
    └─────────────────────────────┘
           │
           ▼
    Click "Sign Up"
           │
           ▼
    API Validates:
    ✓ Email not in use
    ✓ Password >= 8 chars
    ✓ Phone valid
           │
           ▼
    CREATE ACCOUNT:
    ├─ Hash password with bcrypt
    ├─ Store in database
    └─ Role: "customer" (auto-assigned)
           │
           ▼
    SEND EMAIL WITH OTP
    "Your verification code: 123456"
    (Valid for 10 minutes)
           │
           ▼
    Redirect: /auth/verify-otp
```

### **Email Verification**

```
Customer Receives Email:
┌─────────────────────────────────────┐
│ Welcome to Ziya Creations!          │
│                                     │
│ Your OTP: 123456                    │
│ Valid for: 10 minutes               │
│                                     │
│ If you didn't sign up, ignore this. │
└─────────────────────────────────────┘
           │
           ▼
Customer enters OTP in form
           │
           ▼
API verifies OTP
           │
           ▼
✓ Email verified
✓ Account activated
           │
           ▼
Redirect: /auth/login
           │
           ▼
Customer can now login ✓
```

---

## 🛒 Journey 6: Customer - Shopping Experience

### **Product Discovery**

```
VISIT: http://localhost:3000 (Home)
           │
           ▼
    HOME PAGE LOADS:
    ┌────────────────────────────────────┐
    │ CATEGORIES SIDEBAR    PRODUCTS    │
    │ ┌────────────────┐  ┌──────────┐ │
    │ │ All Products   │  │ Product1 │ │
    │ │ Electronics    │  │ $99.99   │ │
    │ │ Fashion        │  ├──────────┤ │
    │ │ Home & Kitchen │  │ Product2 │ │
    │ │ Beauty         │  │ $49.99   │ │
    │ └────────────────┘  └──────────┘ │
    └────────────────────────────────────┘
           │
           ├─ Filter by Category
           │  └─ Click "Electronics"
           │     └─ See only electronics products
           │
           └─ Search Products
              └─ Type in search
                 └─ Results update
```

### **View Product Details**

```
Click on Product Card
           │
           ▼
DETAIL PAGE: /products/wireless-earbuds
           │
    ┌──────────────────────────────┐
    │ [Large Product Image]        │
    │                              │
    │ Wireless Bluetooth Earbuds   │
    │ Price: ₹2999                 │
    │ Discounted: ₹1999            │
    │ ⭐ 4.5/5 Stars               │
    │                              │
    │ Description:                 │
    │ "High-quality audio..."      │
    │                              │
    │ Stock: In Stock              │
    │ Quantity: [1] [+] [-]        │
    │                              │
    │ [Add to Cart Button]         │
    │ [Wishlist Button]            │
    │                              │
    │ REVIEWS:                     │
    │ ⭐⭐⭐⭐⭐ "Great product!"  │
    │ ⭐⭐⭐⭐  "Good quality"    │
    └──────────────────────────────┘
           │
           ▼
    Click "Add to Cart"
           │
           ▼
    Item added to cart ✓
    "1 item in cart"
```

---

## 🛒 Journey 7: Customer - Shopping Cart

### **Cart Management**

```
VISIT: http://localhost:3000/cart
           │
           ▼
    CART PAGE:
    ┌────────────────────────────────────┐
    │ SHOPPING CART                      │
    │                                    │
    │ Item 1: Wireless Earbuds           │
    │ Price: ₹1999 × 2 = ₹3998           │
    │ [Remove] [+] [1] [-]               │
    │                                    │
    │ Item 2: Phone Case                 │
    │ Price: ₹299 × 1 = ₹299             │
    │ [Remove] [+] [1] [-]               │
    │                                    │
    │ SUMMARY:                           │
    │ Subtotal: ₹4297                    │
    │ Tax (18%): ₹773                    │
    │ Total: ₹5070                       │
    │                                    │
    │ [Continue Shopping] [Checkout]     │
    └────────────────────────────────────┘
           │
           ├─ Update Quantity ─→ Total recalculates
           │
           ├─ Remove Item ─→ Item deleted
           │
           └─ Click "Checkout"
                    │
                    ▼
            CHECKOUT PAGE
```

---

## 💳 Journey 8: Customer - Checkout & Payment

### **Checkout Process**

```
VISIT: http://localhost:3000/checkout
           │
           ▼
    CHECKOUT PAGE:
    Step 1: Shipping Address
    ┌─────────────────────────┐
    │ ✓ Existing Addresses:   │
    │   [ ] Home Address      │
    │   [ ] Office Address    │
    │                         │
    │ [ ] Add New Address     │
    └─────────────────────────┘
           │
           ▼
    Select Address or Add New
    ┌─────────────────────────┐
    │ Full Name: John Doe     │
    │ Street: 123 Main St     │
    │ City: Mumbai            │
    │ State: Maharashtra      │
    │ Postal Code: 400001     │
    │ Phone: 9876543210       │
    └─────────────────────────┘
           │
           ▼
    Step 2: Apply Coupon (Optional)
    ┌─────────────────────────┐
    │ Enter Coupon: SAVE20    │
    │ [Apply Button]          │
    │                         │
    │ ✓ Coupon Applied!       │
    │ Discount: -₹1000        │
    └─────────────────────────┘
           │
           ▼
    Step 3: Order Summary
    ┌─────────────────────────┐
    │ Subtotal: ₹5000         │
    │ Discount: -₹1000        │
    │ Tax: ₹640               │
    │ ─────────────────       │
    │ TOTAL: ₹4640            │
    │                         │
    │ [Cancel] [Pay Now]      │
    └─────────────────────────┘
           │
           ▼
    Click "Pay Now"
```

### **Razorpay Payment Gateway**

```
CLICK: Pay Now
           │
           ▼
    RAZORPAY MODAL OPENS:
    ┌─────────────────────────────────┐
    │ Amount: ₹4640                   │
    │                                 │
    │ [Card]  [UPI]  [Wallet]         │
    │                                 │
    │ Card Details:                   │
    │ Number: [____][____][____][__] │
    │ Expiry: [__]/[__]               │
    │ CVV: [___]                      │
    │                                 │
    │ [Pay ₹4640]                     │
    └─────────────────────────────────┘
           │
           ▼
    Enter Test Card:
    Number: 4111111111111111
    Expiry: 12/25
    CVV: 123
           │
           ▼
    Click "Pay"
           │
           ▼
    Enter OTP: 123456
           │
           ▼
    ✓ PAYMENT SUCCESSFUL
           │
           ▼
    Order Created in Database:
    ├─ Order ID: ORD-12345
    ├─ Status: Paid
    ├─ Items: [products]
    ├─ Total: ₹4640
    └─ Date: 2024-12-28
           │
           ▼
    Email Sent to Customer:
    "Your order ORD-12345 is confirmed!"
           │
           ▼
    Redirect: /orders/ORD-12345
           │
           ▼
    ✓ ORDER COMPLETE
```

---

## 📦 Journey 9: Customer - Track Orders

### **View Orders**

```
VISIT: http://localhost:3000/orders
           │
           ▼
    ORDERS PAGE:
    ┌─────────────────────────────────┐
    │ MY ORDERS                       │
    │                                 │
    │ Order #ORD-12345                │
    │ Date: 2024-12-28                │
    │ Amount: ₹4640                   │
    │ Status: Processing ⏳           │
    │ [View Details] [Track]          │
    │                                 │
    │ Order #ORD-12344                │
    │ Date: 2024-12-25                │
    │ Amount: ₹1999                   │
    │ Status: Delivered ✓             │
    │ [View Details] [Review]         │
    └─────────────────────────────────┘
           │
           ▼
    Click "View Details"
           │
           ▼
    ORDER DETAIL PAGE:
    ┌────────────────────────────────┐
    │ Order ID: ORD-12345             │
    │ Status: Processing              │
    │                                 │
    │ TIMELINE:                       │
    │ ✓ Order Placed (28 Dec, 2pm)   │
    │ ✓ Payment Confirmed (28 Dec)   │
    │ ⏳ Packing (In Progress)        │
    │ ⌛ Shipped (Expected 30 Dec)    │
    │ ⌛ Delivered (Expected 2 Jan)   │
    │                                 │
    │ ITEMS:                          │
    │ • Wireless Earbuds × 2          │
    │ • Phone Case × 1                │
    │                                 │
    │ SHIPPING TO:                    │
    │ John Doe                        │
    │ 123 Main Street                 │
    │ Mumbai, 400001                  │
    └────────────────────────────────┘
           │
           ▼
    Track Package in Real-Time ✓
```

---

## ⭐ Journey 10: Customer - Reviews & Ratings

### **Leave Review**

```
After Delivery (Status = Delivered)
           │
           ▼
    ORDERS PAGE:
    Click "Leave Review"
           │
           ▼
    REVIEW FORM:
    ┌──────────────────────────┐
    │ RATE PRODUCT             │
    │ ⭐⭐⭐⭐⭐ (5 stars)     │
    │                          │
    │ WRITE REVIEW:            │
    │ "Great product! Works    │
    │  perfectly, very happy   │
    │  with purchase."         │
    │                          │
    │ [Submit Review]          │
    └──────────────────────────┘
           │
           ▼
    Review Submitted ✓
           │
           ▼
    Appears on Product Page:
    Other customers see your review ✓
```

---

## 👤 Journey 11: Customer - Account Management

### **Account Settings**

```
VISIT: http://localhost:3000/account
           │
           ▼
    ACCOUNT PAGE:
    ┌──────────────────────────────┐
    │ PROFILE                      │
    │ Name: John Doe               │
    │ Email: john@example.com      │
    │ Phone: 9876543210            │
    │ Verified: ✓                  │
    │                              │
    │ [Edit Profile] [Change Pass] │
    │                              │
    │ ADDRESSES                    │
    │ • Home Address               │
    │ • Office Address             │
    │ • Add New Address            │
    │                              │
    │ ORDERS (5 total)             │
    │ • Recent orders listed       │
    │ • Click to view details      │
    │                              │
    │ [Download Invoices]          │
    │ [Preferences]                │
    │ [Logout]                     │
    └──────────────────────────────┘
           │
           ▼
    Manage Personal Information ✓
```

---

## 📊 Complete Platform Flow Diagram

```
                         ZIYA CREATIONS
                        ┌─────────────┐
                        │   PLATFORM  │
                        └─────────────┘
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
            ┌────────┐   ┌────────┐   ┌────────┐
            │SUPER   │   │ ADMIN  │   │CUSTOMER│
            │ADMIN   │   │        │   │        │
            └────────┘   └────────┘   └────────┘
                 │            │            │
        ┌────────┴────────┐   │   ┌────────┴─────────┐
        ▼                 ▼   ▼   ▼                  ▼
    Products        Orders    Cart           Checkout
    Categories      Coupons   Details        Payment
    Analytics       Users     Reviews        Track Orders
    Reports         Metrics   Addresses      Reviews
```

---

## 🔑 Key Access Points

| User Type | Entry Point | Dashboard |
|-----------|------------|-----------|
| Super Admin | /auth/login | /admin |
| Admin | /auth/login | /admin |
| Customer | /auth/signup | / (home) |
| Customer | /auth/login | / (home) |

---

## 📱 Essential URLs for Users

### **Super Admin/Admin**
- Login: `/auth/login`
- Dashboard: `/admin`
- Products: `/admin/products`
- Categories: `/admin/categories`
- Orders: `/admin/orders`
- Coupons: `/admin/coupons`

### **Customer**
- Home: `/`
- Signup: `/auth/signup`
- Login: `/auth/login`
- Products: `/products/[slug]`
- Cart: `/cart`
- Checkout: `/checkout`
- Orders: `/orders`
- Account: `/account`

---

**All journeys are complete and integrated! Your platform is ready to serve all user types!** 🚀
