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
- Node.js 18+ (LTS recommended)
- MongoDB 5.0+ (local or MongoDB Atlas)
- Stripe account (for payments, use Test mode keys)

Check installed versions:
```bash
node -v   # should be >= 18
npm -v
mongod --version
```

Install resources:
- Node.js: https://nodejs.org/en/download
- MongoDB Community Server: https://www.mongodb.com/try/download/community
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

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

What they do and where to get them:
- `VITE_API_URL`: Base URL the frontend calls. For local dev, keep `http://localhost:5000`.
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe Publishable key (starts with `pk_test_...`) from Stripe Dashboard → Developers → API keys. Use Test key for local dev.

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snafleshub
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key
```

What they do and where to get them:
- `PORT`: Port for the backend server. Default `5000`.
- `MONGODB_URI`: MongoDB connection string. For local, use `mongodb://localhost:27017/snafleshub`. For Atlas, use the connection string from Atlas → Connect; ensure your IP is allowed and your username/password are URL-encoded.
- `JWT_SECRET`: Any long random string used to sign JWTs. Keep it secret and unique per environment.
- `STRIPE_SECRET_KEY`: Stripe Secret key (starts with `sk_test_...`) from Stripe Dashboard → Developers → API keys. Use Test key for local dev.
- `FRONTEND_URL` (optional but recommended): Used for CORS and links in emails, e.g. `http://localhost:5173`.
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` (optional): Configure only if you enable email flows (verification/reset).
- `UPLOAD_PATH`, `MAX_FILE_SIZE` (optional): File upload destination and size limit in bytes.
- `DB_MAX_RETRIES`, `DB_RETRY_DELAY_MS` (optional): Control MongoDB connection retry behavior.
- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`, `RATE_LIMIT_AUTH_MAX` (prod only, optional): Tune rate limiting thresholds.

Example: creating `backend/.env` for local dev
```bash
cd backend
cp env.example .env
# then edit .env with your values
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
    config/
    server.js
  README.md
```

## Running Tests
- This project does not yet include automated tests.
- Frontend sanity checks: `npm run lint`, `npm run build`.
- If/when test scripts are added, run them via `npm test` in the relevant package (root for frontend, `backend/` for API).

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

## Troubleshooting
- MongoDB connection issues
  - Error: `ECONNREFUSED` or `MongoNetworkError`: Ensure MongoDB is running locally (`mongod`) or your Atlas cluster is active.
  - Atlas auth errors: Confirm username/password are correct and URL-encoded; whitelist your IP in Atlas Network Access.
  - Flaky startup: Adjust `DB_MAX_RETRIES` and `DB_RETRY_DELAY_MS` in `.env`.
- Stripe not configured
  - API returns: `Stripe not configured. Set STRIPE_SECRET_KEY.` → Set `STRIPE_SECRET_KEY` in `backend/.env` and restart the server.
  - Use Test keys in development; Publishable key in the frontend (`VITE_STRIPE_PUBLISHABLE_KEY`), Secret key in the backend (`STRIPE_SECRET_KEY`).
- CORS blocked in browser
  - Set `FRONTEND_URL` in `backend/.env` to your frontend origin (e.g., `http://localhost:5173`). Restart backend.
- Port already in use
  - Change `PORT` in `backend/.env`, or stop the conflicting process.
- Invalid/expired JWT after `.env` change
  - Changing `JWT_SECRET` invalidates existing tokens. Log out and log back in.

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
