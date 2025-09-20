# SNAFLEShub - E-commerce Marketplace

A modern, full-stack e-commerce marketplace built with React and Node.js, featuring vendor management, negotiation system, payment integration, and review system.

## 🚀 Features

### Frontend (React)
- **Modern UI/UX**: Built with React 18, Vite, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful animations
- **State Management**: Context API for authentication, cart, and products
- **Routing**: React Router DOM for seamless navigation
- **Payment Integration**: Stripe payment processing
- **Review System**: Fiverr-style rating and review system
- **Negotiation System**: Real-time messaging between users and vendors

### Backend (Node.js/Express)
- **RESTful API**: Express.js server with MongoDB
- **Authentication**: JWT-based auth for users, vendors, and admins
- **File Upload**: Image upload for products and profiles
- **Payment Processing**: Stripe integration for secure payments
- **Real-time Features**: WebSocket support for negotiations

### User Roles
- **Customers**: Browse, purchase, negotiate, and review
- **Vendors**: Manage products, orders, and analytics
- **Admins**: Platform management and moderation

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Framer Motion
- Lucide React (Icons)
- React Hot Toast
- Stripe.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Multer
- Stripe

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Stripe account (for payments)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp env.example .env

# Edit .env with your configuration
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# STRIPE_SECRET_KEY=your_stripe_secret_key

# Start backend server
npm start
```

### Quick Setup (Windows)
```bash
# Run the setup script
setup.bat
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snafleshub
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

## 🚀 Running the Application

### Development Mode
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend && npm start
```

### Production Mode
```bash
# Build frontend
npm run build

# Start backend
cd backend && npm start
```

## 📁 Project Structure

```
SNAFLEShub/
├── public/                 # Static assets
│   ├── products.json      # Product data
│   └── vendors.json       # Vendor data
├── src/                   # React frontend
│   ├── components/        # Reusable components
│   │   ├── layout/        # Layout components
│   │   ├── payment/       # Payment components
│   │   ├── reviews/       # Review components
│   │   └── vendor/        # Vendor components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── main.jsx          # App entry point
├── backend/               # Node.js backend
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── server.js         # Server entry point
└── README.md
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Environment variable protection
- Input validation and sanitization
- CORS configuration
- Rate limiting

## 💳 Payment Integration

- Stripe payment processing
- Secure checkout flow
- Payment confirmation
- Order management

## ⭐ Review System

- 5-star rating system
- Written reviews
- Review statistics
- Vendor profile ratings
- Review moderation

## 🤝 Negotiation System

- Real-time messaging
- Price negotiation
- Admin moderation
- Message history

## 🎨 UI/UX Features

- Modern, responsive design
- Smooth animations
- Dark/light theme support
- Mobile-optimized
- Loading states
- Error handling

## 📱 Pages

### Customer Pages
- Home
- Products
- Product Detail
- Cart
- Checkout
- Orders
- Profile
- Wishlist
- Reviews

### Vendor Pages
- Dashboard
- Product Management
- Order Management
- Analytics
- Profile

### Admin Pages
- Dashboard
- User Management
- Vendor Management
- Negotiation Moderation
- Platform Settings

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy backend/ folder
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@snafleshub.com or create an issue in the repository.

## 🔄 Version History

- v1.0.0 - Initial release with basic e-commerce features
- v1.1.0 - Added vendor dashboard and management
- v1.2.0 - Implemented negotiation system
- v1.3.0 - Added review and rating system
- v1.4.0 - Enhanced UI/UX and mobile responsiveness

---

**SNAFLEShub** - Your one-stop marketplace for everything! 🛍️
