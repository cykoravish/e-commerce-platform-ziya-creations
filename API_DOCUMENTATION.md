# Ziya Creations API Documentation

## Base URL
`http://localhost:3000/api`

## Authentication
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format

### Success Response
```json
{
  "statusCode": "SUCCESS",
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "statusCode": "ERROR",
  "message": "Error description",
  "data": null
}
```

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/auth/signup`

Send OTP to email for verification.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9999999999",
  "password": "password123"
}
```

**Response:**
```json
{
  "statusCode": "OTP_SENT",
  "message": "OTP sent to email",
  "data": {
    "email": "john@example.com",
    "phone": "9999999999"
  }
}
```

### 2. Verify OTP
**POST** `/auth/verify-otp`

Verify OTP and create account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9999999999",
  "password": "password123",
  "otp": "123456"
}
```

**Response:**
```json
{
  "statusCode": "VERIFIED",
  "message": "Account verified successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9999999999",
      "role": "customer"
    }
  }
}
```

### 3. Login
**POST** `/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "statusCode": "SUCCESS",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9999999999",
      "role": "customer"
    }
  }
}
```

---

## Product Endpoints

### 1. Get All Products
**GET** `/products`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 12)
- `category` (optional: category ID)
- `search` (optional: search term)
- `sort` (default: -createdAt)

**Request:**
```
GET /products?page=1&limit=20&category=507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "statusCode": "SUCCESS",
  "message": "Products fetched successfully",
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Product Name",
        "slug": "product-name",
        "description": "Product description",
        "price": 999,
        "discountedPrice": 799,
        "images": ["url1", "url2"],
        "stock": 50,
        "rating": 4.5,
        "reviewCount": 23,
        "category": {...}
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### 2. Get Product Details
**GET** `/products/[slug]`

**Request:**
```
GET /products/product-name
```

**Response:**
```json
{
  "statusCode": "SUCCESS",
  "message": "Product fetched successfully",
  "data": {
    "product": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Product Name",
      "description": "Detailed description",
      "price": 999,
      "discountedPrice": 799,
      "images": ["url1", "url2"],
      "stock": 50,
      "rating": 4.5,
      "reviewCount": 23,
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Electronics",
        "slug": "electronics"
      }
    },
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "rating": 5,
        "title": "Great product!",
        "comment": "Very satisfied",
        "user": {
          "name": "John",
          "avatar": "url"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 3. Get Categories
**GET** `/categories`

**Response:**
```json
{
  "statusCode": "SUCCESS",
  "message": "Categories fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Electronics",
      "slug": "electronics",
      "image": "url",
      "description": "Electronic products",
      "isActive": true
    }
  ]
}
```

---

## Admin Endpoints

### 1. Create Product (Admin only)
**POST** `/admin/products/create`

**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 999,
  "discountedPrice": 799,
  "category": "507f1f77bcf86cd799439012",
  "stock": 100,
  "sku": "SKU001",
  "images": ["url1", "url2"]
}
```

**Response:** 201 Created
```json
{
  "statusCode": "CREATED",
  "message": "Product created successfully",
  "data": { ... }
}
```

### 2. Update Product (Admin only)
**PUT** `/admin/products/[id]`

**Request:**
```json
{
  "name": "Updated Product",
  "price": 1099,
  "stock": 80
}
```

### 3. Delete Product (Super Admin only)
**DELETE** `/admin/products/[id]`

### 4. Create Category (Admin only)
**POST** `/admin/categories/create`

**Request:**
```json
{
  "name": "New Category",
  "description": "Category description",
  "image": "url"
}
```

### 5. Create Coupon (Admin only)
**POST** `/admin/coupons/create`

**Request:**
```json
{
  "code": "SAVE20",
  "description": "Save 20% on orders",
  "discountType": "percentage",
  "discountValue": 20,
  "minOrderValue": 500,
  "maxDiscount": 5000,
  "usageLimit": 100,
  "expiryDate": "2024-12-31T23:59:59Z"
}
```

---

## Order Endpoints

### 1. Create Order (Authenticated)
**POST** `/orders/create`

**Headers:**
```
Authorization: Bearer USER_JWT_TOKEN
```

**Request:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2
    }
  ],
  "address": "507f1f77bcf86cd799439013"
}
```

**Response:** 201 Created
```json
{
  "statusCode": "CREATED",
  "message": "Order created successfully",
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439014",
      "orderId": "ZC-1704067200000-ABC123",
      "user": "507f1f77bcf86cd799439010",
      "items": [...],
      "total": 1998,
      "status": "pending",
      "paymentStatus": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 2. Verify Payment
**POST** `/orders/verify-payment`

**Request:**
```json
{
  "razorpayOrderId": "order_xyz123",
  "razorpayPaymentId": "pay_xyz123",
  "razorpaySignature": "signature_hash",
  "orderId": "ZC-1704067200000-ABC123"
}
```

### 3. Get Order Details
**GET** `/orders/[id]`

**Headers:**
```
Authorization: Bearer USER_JWT_TOKEN
```

---

## User Endpoints

### 1. Get Addresses (Authenticated)
**GET** `/user/addresses`

**Headers:**
```
Authorization: Bearer USER_JWT_TOKEN
```

**Response:**
```json
{
  "statusCode": "SUCCESS",
  "message": "Addresses fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Home",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "pincode": "10001",
      "phone": "9999999999",
      "isDefault": true,
      "type": "home"
    }
  ]
}
```

### 2. Create Address (Authenticated)
**POST** `/user/addresses`

**Headers:**
```
Authorization: Bearer USER_JWT_TOKEN
```

**Request:**
```json
{
  "name": "Office",
  "phone": "9999999999",
  "email": "john@example.com",
  "street": "456 Office Blvd",
  "city": "New York",
  "state": "NY",
  "pincode": "10002",
  "type": "work",
  "isDefault": false
}
```

### 3. Get User Orders (Authenticated)
**GET** `/user/orders`

**Headers:**
```
Authorization: Bearer USER_JWT_TOKEN
```

---

## Review Endpoints

### 1. Create Review (Authenticated)
**POST** `/reviews/create`

**Headers:**
```
Authorization: Bearer USER_JWT_TOKEN
```

**Request:**
```json
{
  "product": "507f1f77bcf86cd799439011",
  "order": "507f1f77bcf86cd799439014",
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Really satisfied with the quality",
  "images": ["url1", "url2"]
}
```

---

## Coupon Endpoints

### 1. Validate Coupon
**POST** `/coupons/validate`

**Request:**
```json
{
  "code": "SAVE20",
  "cartTotal": 1000
}
```

**Response:**
```json
{
  "statusCode": "SUCCESS",
  "message": "Coupon validated successfully",
  "data": {
    "coupon": {
      "code": "SAVE20",
      "discountType": "percentage",
      "discountValue": 20
    },
    "discount": 200
  }
}
```

---

## Error Codes

- `UNAUTHORIZED` (401) - Missing or invalid token
- `FORBIDDEN` (403) - Insufficient permissions
- `VALIDATION_ERROR` (400) - Invalid request data
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource already exists
- `SERVER_ERROR` (500) - Internal server error

---

## Rate Limiting

Rate limits may be implemented in production. Current limits:
- Authentication: 5 attempts per minute
- General API: No limit (implement in production)

---

## Testing API Endpoints

### Using cURL

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","phone":"9999999999","password":"pass123"}'

# Get products
curl http://localhost:3000/api/products?limit=10

# Create order (with auth token)
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"items":[{"productId":"ID","quantity":1}],"address":"ADDRESS_ID"}'
```

### Using Postman

1. Import the API endpoints
2. Set `{{base_url}}` to `http://localhost:3000/api`
3. Set `{{token}}` variable after login
4. Test each endpoint

---

For more details, refer to `README.md` and `SETUP_GUIDE.md`
