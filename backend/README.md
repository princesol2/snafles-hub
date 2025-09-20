# SNAFLEShub Backend API

A comprehensive Node.js/Express backend API for the SNAFLEShub e-commerce application.

## 🚀 Features

### **Authentication & Users**
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- User profile management
- Role-based access control (Customer, Vendor, Admin)

### **Product Management**
- CRUD operations for products
- Advanced filtering and search
- Product categories and variants
- Image upload support
- Product reviews and ratings
- Inventory management

### **Vendor System**
- Vendor registration and management
- Vendor product listings
- Vendor statistics and analytics
- Vendor verification system

### **Order Management**
- Order creation and processing
- Order status tracking
- Order history for users
- Order cancellation and refunds
- Shipping and tracking integration

### **Payment Processing**
- Stripe integration (ready for implementation)
- Multiple payment methods
- Payment intent creation
- Refund processing
- Payment method management

### **File Upload**
- Image upload with validation
- File size and type restrictions
- Secure file storage
- Multiple file upload support

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Validation**: Express Validator
- **Email**: Nodemailer
- **Payments**: Stripe
- **Environment**: dotenv

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snafleshub-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   
   # With database seeding
   npm run seed
   ```

### Using the Startup Scripts

**Windows:**
```bash
# Basic startup
run-backend.bat

# Development mode
run-backend.bat --dev

# With database seeding
run-backend.bat --seed
```

**Linux/macOS:**
```bash
# Make executable
chmod +x run-backend.sh

# Basic startup
./run-backend.sh

# Development mode
./run-backend.sh --dev

# With database seeding
./run-backend.sh --seed
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/snafleshub

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Vendor/Admin)
- `PUT /api/products/:id` - Update product (Vendor/Admin)
- `DELETE /api/products/:id` - Delete product (Vendor/Admin)
- `POST /api/products/:id/reviews` - Add product review

### Vendors
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get single vendor with products
- `POST /api/vendors` - Create vendor (Admin)
- `PUT /api/vendors/:id` - Update vendor (Admin)
- `DELETE /api/vendors/:id` - Delete vendor (Admin)
- `PUT /api/vendors/:id/verify` - Verify vendor (Admin)
- `GET /api/vendors/:id/stats` - Get vendor statistics

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/tracking/:orderNumber` - Track order

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/wishlist` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist
- `GET /api/users/wishlist` - Get user wishlist
- `GET /api/users/stats` - Get user statistics

### File Upload
- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images
- `DELETE /api/upload/:filename` - Delete uploaded file

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `POST /api/payments/refund` - Process refund
- `GET /api/payments/methods` - Get payment methods

### Health Check
- `GET /api/health` - Server health status

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: Object,
  role: String (customer/vendor/admin),
  loyaltyPoints: Number,
  preferences: Object,
  isActive: Boolean
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  images: [String],
  category: String,
  vendor: ObjectId,
  stock: Number,
  rating: Number,
  reviews: Number,
  featured: Boolean,
  variants: [Object],
  specifications: Object,
  customerReviews: [Object]
}
```

### Vendor
```javascript
{
  name: String,
  description: String,
  logo: String,
  banner: String,
  location: String,
  categories: [String],
  rating: Number,
  reviews: Number,
  contact: Object,
  isVerified: Boolean
}
```

### Order
```javascript
{
  orderNumber: String (unique),
  user: ObjectId,
  items: [Object],
  shipping: Object,
  payment: Object,
  status: String,
  total: Number,
  tracking: Object
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent API abuse
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers
- **Input Validation**: Express validator for data validation
- **File Upload Security**: File type and size validation

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Database Seeding

The backend includes a seeding script to populate the database with sample data:

```bash
npm run seed
```

This creates:
- Demo users (including admin)
- Sample vendors
- Sample products
- Test data for development

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 API Documentation

### Request/Response Format

All API responses follow this format:

```javascript
// Success Response
{
  "message": "Success message",
  "data": { ... },
  "pagination": { ... } // For paginated responses
}

// Error Response
{
  "message": "Error message",
  "errors": [ ... ] // For validation errors
}
```

### Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Pagination

For paginated endpoints, use query parameters:
```
GET /api/products?page=1&limit=20
```

### Filtering

Many endpoints support filtering:
```
GET /api/products?category=Jewelry&minPrice=1000&maxPrice=5000&search=necklace
```

## 🔧 Development

### Project Structure
```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── scripts/         # Database seeding
├── uploads/         # File uploads
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # This file
```

### Adding New Features

1. Create model in `models/`
2. Create routes in `routes/`
3. Add middleware if needed
4. Update server.js to include routes
5. Test with API client

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**SNAFLEShub Backend** - Powering the future of e-commerce 🚀
