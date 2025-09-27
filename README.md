# SNAFLEShub - E-commerce Marketplace

A modern, full-stack e-commerce marketplace built with React and Node.js, featuring vendor management, negotiation, payments, and reviews.

## Features

### Frontend (React)
- Modern UI/UX with React 18, Vite, Tailwind CSS
- Responsive design and animations (Framer Motion)
- State via React Context (auth, cart, products)
- Routing with React Router DOM
- Stripe payments integration
- Reviews with ratings and stats
- Negotiation messaging UI

### Backend (Node.js/Express)
- RESTful API with Express + MongoDB (Mongoose)
- JWT authentication (users, vendors, admins)
- Image upload (Multer)
- Stripe payment intents
- WebSocket-ready for negotiations

### Roles
- Customers: browse, purchase, negotiate, review
- Vendors: manage products, orders, analytics
- Admins: platform management and moderation

## Tech Stack

### Frontend
- React 18, Vite, Tailwind CSS
- React Router, Framer Motion, Lucide, React Hot Toast
- Stripe.js

### Backend
- Node.js, Express.js, MongoDB, Mongoose
- JWT, bcrypt, Multer, Stripe

## Installation

### Prerequisites
- Node.js v16+
- MongoDB (local or cloud)
- Stripe account (for payments)

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
cp env.example .env
# edit .env with your values
npm start
```

### Windows Quick Setup
```bash
setup.bat
```

## Configuration

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snafleshub
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key
```

## Running

### Development
```bash
# Terminal 1 (frontend)
npm run dev

# Terminal 2 (backend)
# Real API
cd backend && npm start

# OR use the Mock API server (recommended for now)
# Windows
./run-backend.bat --mock --dev
# macOS/Linux
./run-backend.sh --mock --dev
# or from project root via npm scripts
npm run start:backend:dev:mock
```

### Production
```bash
npm run build
cd backend && npm start
```

### Mock API Notes
- Frontend requests use base `'/api'` and Vite proxies to `http://localhost:5000`.
- The mock server runs on port `5000` and implements the routes used in the app.
- No database is required when running the mock server.

## Project Structure
```
SNAFLEShub/
  public/
  src/
    components/
      layout/
      payment/
      reviews/
      vendor/
    contexts/
    pages/
    services/
    main.jsx
  backend/
    models/
    routes/
    middleware/
    server.js
  README.md
```

## Security
- JWT auth, bcrypt password hashing
- Env var configuration
- Input validation, CORS, rate limiting

## Payments
- Stripe payment processing, secure checkout, confirmations

## Reviews
- 5-star ratings, written reviews, stats, moderation

## Negotiation
- Real-time messaging, price negotiation, moderation, history

## UI/UX
- Modern, responsive, dark/light themes, loading and error states

## Pages

### Customer
- Home, Products, Product Detail, Cart, Checkout, Orders, Profile, Wishlist, Reviews

### Vendor
- Dashboard, Product Management, Order Management, Analytics, Profile

### Admin
- Dashboard, User Management, Vendor Management, Negotiation Moderation, Settings

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# deploy dist/
```

### Backend (Heroku/Railway)
```bash
# set env vars then deploy backend/
```

## Contributing
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push and open a PR

## License
MIT

## Support
Email support@snafleshub.com or open an issue.

## Version History
- v1.0.0 Initial release
- v1.1.0 Vendor dashboard
- v1.2.0 Negotiation system
- v1.3.0 Reviews and ratings
- v1.4.0 UI/UX enhancements
