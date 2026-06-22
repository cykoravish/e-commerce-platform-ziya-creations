# Implementation Notes - Ziya Creations

## Architecture Decisions

### 1. Authentication Strategy
- **JWT-Based**: Chosen for stateless authentication
- **Token Storage**: localStorage for client-side persistence
- **OTP Verification**: Email-based with 10-minute expiry
- **Password Security**: Bcrypt with 10 rounds hashing

### 2. State Management
- **Context API**: Used for Auth and Cart (lightweight solution)
- **No Redux**: Opted for simplicity given scope
- **Cart Persistence**: localStorage for client-side caching
- **Future**: Can migrate to Redux for scalability

### 3. Database Design
- **MongoDB**: Document-based for flexibility
- **Mongoose**: ODM for schema validation and relationships
- **Indexing**: Implemented on frequently queried fields (email, slug, userId)
- **Relationships**: Reference-based for performance

### 4. API Design
- **RESTful**: Standard REST principles followed
- **Response Format**: Consistent JSON structure
- **Error Codes**: Meaningful status codes for debugging
- **Validation**: Server-side input validation on all endpoints

## Implementation Details

### Frontend Architecture

```
/app
  ├── page.tsx              # Home with products
  ├── context/              # State providers
  ├── auth/                 # Auth pages
  ├── products/[slug]       # Product detail
  ├── cart/                 # Shopping cart
  ├── checkout/             # Order creation
  ├── orders/               # Order tracking
  ├── account/              # User profile
  └── admin/                # Admin dashboard
```

**Key Components:**
- AuthContext: Manages user auth state
- CartContext: Manages shopping cart state
- Protected Routes: useAuth hook validates access

### Backend Architecture

```
/app/api
  ├── auth/                 # Authentication
  ├── products/             # Product endpoints
  ├── admin/                # Admin operations
  ├── orders/               # Order management
  ├── user/                 # User endpoints
  ├── reviews/              # Review system
  └── coupons/              # Coupon management
```

**Middleware:**
- verifyAuth: JWT validation
- Role-based access control
- Error handling wrapper

### Database Relationships

```
User
  ├── has many Orders
  ├── has many Addresses
  ├── has many Reviews
  └── has many OTPs

Product
  ├── belongs to Category
  └── has many Reviews

Order
  ├── has many OrderItems
  ├── has one Address
  ├── has one Coupon
  └── belongs to User

Review
  ├── belongs to Product
  ├── belongs to User
  └── belongs to Order
```

## Code Patterns & Best Practices

### 1. Error Handling
```typescript
try {
  // operation
} catch (error) {
  console.error('[v0] Operation error:', error);
  return createErrorResponse('Error message', status, 'ERROR_CODE');
}
```

### 2. Database Connection
```typescript
import { connectDB } from '@/lib/db';
// Call at start of each API route
await connectDB();
```

### 3. API Responses
```typescript
// Success
return createResponse(data, 'Success message', 200, 'SUCCESS');

// Error
return createErrorResponse('Error message', 400, 'ERROR_CODE');
```

### 4. Authentication
```typescript
const auth = await verifyAuth(request);
if (!auth) return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED');
if (auth.role !== 'admin') return createErrorResponse('Forbidden', 403, 'FORBIDDEN');
```

### 5. Form Validation
- Client-side: HTML5 validation + React state
- Server-side: Always validate before DB operations
- Custom validators: Use utility functions

## Performance Optimizations

### Frontend
- Server-side rendering for initial load
- Static generation where applicable
- Dynamic imports for code splitting
- Image optimization with Next.js Image component

### Backend
- Database indexes on frequently queried fields
- Query optimization with lean()
- Pagination for large datasets
- Connection pooling with Mongoose

### Database
```javascript
// Indexed fields for faster queries
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
```

## Security Implementations

### 1. Authentication
- JWT secret stored in environment variables
- Bcrypt password hashing (10 rounds)
- OTP expiration (10 minutes)

### 2. Authorization
- Role-based access control (RBAC)
- User-specific data filtering
- Admin-only endpoints protected

### 3. Data Validation
- Input sanitization
- Type checking with TypeScript
- Mongoose schema validation

### 4. API Security
- CORS headers (can be configured)
- Rate limiting (can be added)
- SQL injection prevention (using Mongoose)

## Common Operations

### Create User
```typescript
const user = new User({
  name, email, phone,
  password: await hashPassword(password),
  role: 'customer',
  isVerified: true
});
await user.save();
```

### Verify Product Availability
```typescript
const product = await Product.findById(id);
if (!product || product.stock < quantity) {
  return createErrorResponse('Out of stock', 400, 'OUT_OF_STOCK');
}
```

### Calculate Order Total
```typescript
const subtotal = items.reduce((sum, item) => {
  return sum + (item.price * item.quantity);
}, 0);
const tax = Math.round(subtotal * 0.18); // 18% GST
const total = subtotal + tax;
```

## Testing Workflows

### 1. Customer Flow
1. Signup → Verify OTP → Login
2. Browse products → Search/Filter
3. View product details
4. Add to cart → Update quantities
5. Proceed to checkout
6. Select address
7. Place order
8. View order history

### 2. Admin Flow
1. Admin login
2. Access dashboard
3. Create/Edit products
4. Manage categories
5. View orders
6. Manage coupons

### 3. API Testing
```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"9999999999","password":"pass123"}'

# Test get products
curl http://localhost:3000/api/products?limit=10

# Test with auth
curl http://localhost:3000/api/user/addresses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Debugging Tips

### Enable Debug Logs
```typescript
// In any API route
console.log('[v0] Debug info:', data);
```

### Check Database
```bash
# Connect to MongoDB
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/db"

# View users
db.users.find()

# View products
db.products.find()

# Check order
db.orders.findOne({ orderId: "ZC-..." })
```

### Common Issues & Solutions

**MongoDB Connection Error**
- Check MONGODB_URI format
- Verify IP whitelist in Atlas
- Ensure database exists

**JWT Token Invalid**
- Check JWT_SECRET matches
- Verify token hasn't expired
- Check Authorization header format

**Email Not Sending**
- Verify Gmail credentials
- Use App Password (not regular password)
- Check spam folder

**API 404 Errors**
- Verify route file naming conventions
- Check parameter names match [brackets]
- Restart dev server after adding routes

## Configuration & Customization

### Modify Email Templates
See `/lib/email.ts`
- Edit `generateOTPEmail()`
- Edit `generateOrderConfirmationEmail()`

### Change Role Permissions
Edit `/lib/auth.ts` and `/app/api/` routes:
```typescript
if (auth.role !== 'super_admin') {
  return createErrorResponse('Only super admin can perform this action');
}
```

### Update Product Categories
Add categories via `/admin/categories` or MongoDB directly

### Customize Pricing Logic
Edit `/app/api/orders/create/route.ts` for tax/shipping calculations

## Deployment Considerations

### Pre-Deployment Checklist
- [ ] All environment variables set
- [ ] Database indexes created
- [ ] Email templates tested
- [ ] Test products created
- [ ] Admin account created
- [ ] CORS configured if needed
- [ ] Error logging configured
- [ ] Database backups enabled

### Production Optimizations
```typescript
// Enable caching
export const revalidate = 3600; // 1 hour

// Optimize images
next/image with optimization

// Bundle analysis
ANALYZE=true pnpm build
```

## Scaling Considerations

### When Scaling to High Traffic

1. **Database**
   - Enable sharding
   - Add read replicas
   - Optimize slow queries

2. **Caching**
   - Redis for cart/sessions
   - CDN for images
   - ISR for static pages

3. **API**
   - Rate limiting
   - Load balancing
   - API versioning

4. **Frontend**
   - Service workers
   - Edge caching
   - Progressive enhancement

## Monitoring & Logging

### Add Monitoring
```typescript
// Example: Track API performance
const startTime = Date.now();
const response = await fetch(url);
console.log('[v0] API took:', Date.now() - startTime, 'ms');
```

### Add Error Tracking
```typescript
// Integrate with Sentry/DataDog
import * as Sentry from "@sentry/nextjs";

try {
  // operation
} catch (error) {
  Sentry.captureException(error);
}
```

## Next Developer Guide

When onboarding new developers:

1. Read `README.md` for overview
2. Follow `SETUP_GUIDE.md` for local setup
3. Review `API_DOCUMENTATION.md` for endpoints
4. Read this file for architecture
5. Explore code comments
6. Run tests/development server

---

This architecture is designed to be:
- **Scalable**: Can handle growth
- **Maintainable**: Clean code structure
- **Extensible**: Easy to add features
- **Secure**: Best practices implemented
- **Performant**: Optimized for speed

Happy coding! 🚀
