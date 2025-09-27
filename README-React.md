# SNAFLEShub - React App

A modern, full-featured e-commerce frontend built with React, providing a complete shopping experience with authentication, cart, vendors, and orders.

## Features

### E-commerce Core
- Product catalog with filtering and search
- Product detail pages with images, reviews, specs
- Shopping cart with quantity management and persistence
- Checkout flow with shipping and payment
- Order history, tracking, and statuses

### User System
- Authentication (login/register)
- Profiles and preferences
- Wishlist
- Order history

### Vendor System
- Vendor directory and individual vendor pages
- Vendor products

### Modern UI/UX
- Responsive design
- Tailwind CSS + Lucide icons
- Framer Motion animations
- Toast notifications

## Technology Stack
- React 18, Vite
- React Router DOM
- Context API
- Tailwind CSS
- Lucide, Framer Motion, React Hot Toast
- React Hook Form

## Setup
```bash
npm install
npm run dev
```

Create `.env.local`:
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

## Scripts
```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview build
npm run lint      # lint
```

