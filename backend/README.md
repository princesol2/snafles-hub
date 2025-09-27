# SNAFLEShub Backend API

A Node.js/Express backend API for the SNAFLEShub e-commerce application.

## Features

### Authentication & Users
- Registration and login with JWT
- Password hashing (bcrypt)
- User profile management
- Role-based access (customer/vendor/admin)

### Product Management
- CRUD for products
- Filtering and search
- Categories and variants
- Image uploads
- Reviews and ratings
- Inventory management

### Vendor System
- Vendor registration and management
- Vendor product listings
- Statistics and analytics
- Verification flow

### Orders
- Create and process orders
- Status tracking and history
- Cancellation and refunds
- Shipping/tracking integration

### Payments
- Stripe integration (payment intents)
- Multiple methods (extensible)
- Refund processing

### File Upload
- Image upload with validation
- File type/size limits
- Secure storage

## Technology Stack
- Node.js, Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- Helmet, CORS, Rate limiting
- Multer (file uploads)
- Express Validator
- Nodemailer (optional)
- Stripe

## Installation

### Prerequisites
- Node.js v14+
- MongoDB (local/Atlas)
- npm or yarn

### Quick Start
```bash
# from project root
cd backend
npm install
cp env.example .env

# development
npm run dev

# production
npm start

# seed database (optional)
npm run seed
```

### Mock API Server (no DB required)
```bash
# from project root
# Windows
../run-backend.bat --mock --dev
# macOS/Linux
../run-backend.sh --mock --dev

# or (from project root) via npm
npm run start:backend:dev:mock
```

### Startup Scripts

Windows:
```bash
run-backend.bat            # basic
run-backend.bat --dev      # dev
run-backend.bat --seed     # seed
```

Linux/macOS:
```bash
chmod +x run-backend.sh
./run-backend.sh           # basic
./run-backend.sh --dev     # dev
./run-backend.sh --seed    # seed
```

## Configuration

Create `.env` in `backend/`:
```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/snafleshub

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## API Endpoints (high level)

### Auth
- POST `/api/auth/register` — register
- POST `/api/auth/login` — login
- GET `/api/auth/me` — current user
- PUT `/api/auth/profile` — update profile
- POST `/api/auth/change-password` — change password

### Products
- GET `/api/products` — list (filters supported)
- GET `/api/products/:id` — detail
- POST `/api/products` — create (vendor/admin)
- PUT `/api/products/:id` — update (vendor/admin)
- DELETE `/api/products/:id` — delete (vendor/admin)
- POST `/api/products/:id/reviews` — add review

### Vendors
- GET `/api/vendors` — list
- GET `/api/vendors/:id` — detail + products
- POST `/api/vendors` — create (admin)
- PUT `/api/vendors/:id` — update (admin)
- DELETE `/api/vendors/:id` — delete (admin)
- PUT `/api/vendors/:id/verify` — verify (admin)
- GET `/api/vendors/:id/stats` — stats

### Orders
- GET `/api/orders` — my orders
- GET `/api/orders/:id` — detail
- POST `/api/orders` — create
- PUT `/api/orders/:id/status` — update status
- POST `/api/orders/:id/cancel` — cancel
- GET `/api/orders/tracking/:orderNumber` — track

### Users
- GET `/api/users/profile` — get profile
- PUT `/api/users/profile` — update profile
- POST `/api/users/wishlist` — add to wishlist
- DELETE `/api/users/wishlist/:productId` — remove from wishlist
- GET `/api/users/wishlist` — get wishlist
- GET `/api/users/stats` — stats

### Upload
- POST `/api/upload/single` — single image
- POST `/api/upload/multiple` — multiple images
- DELETE `/api/upload/:filename` — delete file

### Payments
- POST `/api/payments/create-payment-intent`
- POST `/api/payments/confirm-payment`
- POST `/api/payments/refund`
- GET `/api/payments/methods`

### Health
- GET `/api/health`

## Models (shape overview)

### User
```js
{
  name: String,
  email: String, // unique
  password: String, // hashed
  phone: String,
  address: Object,
  role: 'customer'|'vendor'|'admin',
  loyaltyPoints: Number,
  preferences: Object,
  isActive: Boolean
}
```

### Product
```js
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
```js
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
```js
{
  orderNumber: String, // unique
  user: ObjectId,
  items: [Object],
  shipping: Object,
  payment: Object,
  status: String,
  total: Number,
  tracking: Object
}
```

## Security
- JWT auth, bcrypt
- Rate limiting, CORS, Helmet
- Input validation
- File upload validation (type/size)

## Deployment
```bash
# dev
npm run dev

# prod
npm start
```

### Docker (optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Project Structure
```
backend/
  models/
  routes/
  middleware/
  scripts/
  uploads/
  server.js
  package.json
  README.md
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes and tests
4. Open a pull request

## License
MIT
