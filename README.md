# Ziya Creations - E-Commerce Platform

A comprehensive Flipkart-inspired e-commerce platform built with Next.js 16, MongoDB, and modern web technologies.

## Features

### Customer Features
- **User Authentication**: OTP-based signup, email verification, and login
- **Product Browsing**: Category-based filtering, search functionality, and product details
- **Shopping Cart**: Add/remove items, update quantities, persistent cart storage
- **Checkout**: Multiple address management, coupon validation, order placement
- **Order Management**: View order history, track order status, view order details
- **Reviews & Ratings**: Leave product reviews with ratings and images
- **User Profile**: Manage account information, addresses, and personal data

### Admin Features
- **Dashboard**: Quick overview of products, orders, revenue, and active users
- **Product Management**: Create, update, and delete products with stock management
- **Category Management**: Organize products by categories
- **Order Management**: View and manage customer orders
- **Coupon Management**: Create and manage discount coupons
- **Analytics**: Track sales, revenue, and user metrics

### Super Admin Features
- All admin capabilities plus:
- Delete products permanently
- Manage all system coupons and promotions
- Full platform oversight

## Tech Stack

- **Frontend**: React 19, Next.js 16, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Bcrypt password hashing
- **Payment**: Razorpay integration (ready for configuration)
- **Email**: Nodemailer for OTP and notifications
- **Image Storage**: Cloudinary (configuration required)
- **State Management**: React Context API (Cart, Auth)

## Database Schema

### Collections
1. **Users** - Customer and admin accounts
2. **Products** - Product catalog with pricing and inventory
3. **Categories** - Product categorization
4. **Orders** - Order records with status tracking
5. **OrderItems** - Individual items in orders
6. **Reviews** - Customer reviews and ratings
7. **Coupons** - Discount codes with usage limits
8. **Addresses** - Customer delivery and billing addresses
9. **OTPs** - One-time passwords for email verification

## API Routes

### Authentication
- `POST /api/auth/signup` - User registration with OTP
- `POST /api/auth/verify-otp` - OTP verification and account creation
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - List all products with filtering
- `GET /api/products/[slug]` - Product details and reviews
- `GET /api/categories` - List all categories

### Admin APIs
- `POST /api/admin/products/create` - Create new product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `POST /api/admin/categories/create` - Create category
- `POST /api/admin/coupons/create` - Create coupon

### User APIs
- `GET /api/user/addresses` - Get user addresses
- `POST /api/user/addresses` - Create new address
- `GET /api/user/orders` - Get user orders

### Orders & Payments
- `POST /api/orders/create` - Create new order
- `POST /api/orders/verify-payment` - Verify Razorpay payment
- `GET /api/orders/[id]` - Get order details

### Reviews & Coupons
- `POST /api/reviews/create` - Create product review
- `POST /api/coupons/validate` - Validate coupon code

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ziya_creations

# Authentication
JWT_SECRET=your-random-secret-key-32-characters
BCRYPT_ROUNDS=10

# Email Service
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-public-key
RAZORPAY_KEY_SECRET=your-razorpay-secret-key

# Image Storage
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Client
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Installation & Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 3. Setup Database
- Create a MongoDB cluster on MongoDB Atlas
- Create an account on Cloudinary for image storage
- Set up Razorpay for payment processing
- Configure Gmail App Password for emails

### 4. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## File Structure

```
/app
  /api              # Backend API routes
  /auth             # Authentication pages
  /admin            # Admin dashboard
  /products         # Product pages
  /cart             # Shopping cart
  /checkout         # Checkout process
  /orders           # Order management
  /account          # User account
  /context          # React context providers
/lib
  /models           # MongoDB schemas
  /db.ts            # Database connection
  /auth.ts          # Authentication utilities
  /email.ts         # Email templates and sending
```

## Default Admin Login

To access the admin dashboard, create an admin user with the following credentials in MongoDB:

```javascript
{
  name: "Admin",
  email: "admin@ziyacreations.com",
  phone: "9999999999",
  password: "hashed-password", // Use bcrypt to hash
  role: "admin",
  isVerified: true
}
```

## Key Features Implemented

### Phase 1: Database & Authentication
- MongoDB connection with Mongoose
- JWT-based authentication
- OTP email verification
- User roles (customer, admin, super_admin)

### Phase 2: Product Management
- Product and category models
- Admin product CRUD operations
- Public product browsing with filtering

### Phase 3: Admin Dashboard
- Dashboard overview with key metrics
- Product management interface
- Category management
- Order and coupon management pages

### Phase 4: Shopping Experience
- Product catalog with pagination
- Product detail pages with reviews
- Shopping cart with persistent storage
- Checkout process with address selection

### Phase 5: Payment Integration
- Order creation with stock management
- Razorpay payment verification
- Order confirmation and tracking

### Phase 6: Reviews & Coupons
- Customer review submission
- Coupon validation with rules
- Review moderation system

### Phase 7: Order Management
- User order history
- Order tracking and status updates
- Order detail pages

### Phase 8+: Additional Features
- User profile management
- Address management
- Account information pages
- Future: Analytics, notifications, advanced features

## Deployment

### Deploy to Vercel
```bash
vercel deploy
```

### Set Environment Variables on Vercel
Go to Vercel dashboard > Project Settings > Environment Variables and add all required variables.

## Future Enhancements

- Real-time notifications for orders
- Advanced analytics dashboard
- Wishlist functionality
- Product recommendations
- Live chat support
- Mobile app version
- Payment gateway integration (full implementation)
- Email notifications automation
- Refund management system
- Inventory alerts

## Testing

Basic testing guidelines:
1. Create an account with OTP verification
2. Browse products and filter by category
3. Add items to cart and proceed to checkout
4. Place an order
5. Access admin dashboard to manage products
6. Create and apply coupons

## Support

For issues or questions, please contact: support@ziyacreations.com

## License

All rights reserved - Ziya Creations
