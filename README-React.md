# SNAFLEShub - React E-commerce Application

A modern, full-featured e-commerce application built with React, featuring a complete shopping experience with authentication, cart management, vendor system, and order tracking.

## 🚀 Features

### 🛍️ **E-commerce Core**
- **Product Catalog**: Browse products with advanced filtering and search
- **Product Details**: Detailed product pages with images, reviews, and specifications
- **Shopping Cart**: Add/remove items, quantity management, persistent storage
- **Checkout Flow**: Multi-step checkout with shipping and payment options
- **Order Management**: Order history, tracking, and status updates

### 👥 **User System**
- **Authentication**: Login/register with demo accounts
- **User Profiles**: Manage personal information and preferences
- **Wishlist**: Save favorite products for later
- **Order History**: View and track all past orders

### 🏪 **Vendor System**
- **Vendor Directory**: Browse all vendors and their shops
- **Individual Vendor Pages**: Dedicated pages for each vendor
- **Vendor Products**: View products from specific vendors

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works perfectly on all devices
- **Modern Components**: Built with Tailwind CSS and Lucide React icons
- **Smooth Animations**: Framer Motion for delightful interactions
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ **Technology Stack**

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form
- **Build Tool**: Vite

## 📦 **Installation & Setup**

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 🎯 **Demo Accounts**

### Demo Account (Rich Data)
- **Email**: `demo@snafles.com`
- **Password**: `demo123`
- **Features**: Pre-loaded with sample orders, wishlist, and cart items

### Test Account (Clean)
- **Email**: `testexample@gmail.com`
- **Password**: `123`
- **Features**: Fresh account for testing registration and new user flows

## 📱 **Pages & Features**

### **Home Page** (`/`)
- Hero slider with promotional content
- Featured product categories
- Best sellers, new arrivals, and deals sections
- Responsive design with mobile navigation

### **Products Page** (`/products`)
- Advanced filtering by category, price range
- Sorting options (name, price, rating, newest)
- Grid and list view modes
- Search functionality
- Pagination support

### **Product Detail** (`/product/:id`)
- High-quality product images with thumbnails
- Detailed product information and specifications
- Customer reviews and ratings
- Add to cart and wishlist functionality
- Related products suggestions

### **Vendors** (`/vendors`)
- Vendor directory with search
- Vendor cards with ratings and product counts
- Direct links to vendor shops

### **Vendor Shop** (`/vendor/:id`)
- Individual vendor pages
- Vendor information and story
- Products from specific vendor
- Sorting and filtering options

### **Shopping Cart** (`/cart`)
- Item management with quantity controls
- Coupon code system
- Order summary with tax and shipping
- Security badges and trust indicators

### **Checkout** (`/checkout`)
- Multi-step checkout process
- Shipping information form
- Payment method selection
- Order confirmation and tracking

### **Orders** (`/orders`)
- Order history with status tracking
- Order details and item information
- Reorder functionality
- Delivery tracking

### **Profile** (`/profile`)
- Personal information management
- Address and contact details
- Notification preferences
- Account statistics

### **Wishlist** (`/wishlist`)
- Saved products management
- Quick add to cart functionality
- Remove items from wishlist

### **Login/Register** (`/login`)
- User authentication
- Registration with validation
- Demo account quick access
- Password visibility toggle

## 🎨 **Design System**

### **Colors**
- **Primary**: #E75480 (Pink)
- **Secondary**: #FF8FA3 (Light Pink)
- **Accent**: #8E44AD (Purple)
- **Background**: #F8F9FA (Light Gray)
- **Text**: #2D3436 (Dark Gray)

### **Components**
- **Buttons**: Primary, secondary, outline, ghost variants
- **Cards**: Rounded corners with subtle shadows
- **Forms**: Consistent input styling with focus states
- **Navigation**: Responsive header with mobile menu

### **Responsive Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 **State Management**

### **AuthContext**
- User authentication state
- Login/logout functionality
- Profile management
- Session persistence

### **CartContext**
- Shopping cart state
- Add/remove items
- Quantity management
- Local storage persistence

### **ProductContext**
- Product data management
- Vendor information
- Search and filtering
- Data loading states

## 📊 **Data Structure**

### **Products**
```javascript
{
  id: string,
  name: string,
  price: number,
  originalPrice?: number,
  image: string,
  images?: string[],
  description: string,
  category: string,
  vendor: string,
  rating: number,
  reviews: number,
  stock: number,
  featured: boolean,
  variants?: Array<{name: string, price: number}>,
  specifications?: Object,
  customerReviews?: Array<{name: string, rating: number, comment: string}>
}
```

### **Vendors**
```javascript
{
  id: string,
  name: string,
  logo: string,
  banner: string,
  description: string,
  location: string,
  rating: number,
  reviews: number,
  joinDate: string,
  products: string[]
}
```

### **Orders**
```javascript
{
  id: string,
  items: Array<CartItem>,
  shipping: ShippingInfo,
  payment: PaymentInfo,
  total: number,
  status: 'Processing' | 'Shipped' | 'Delivered',
  createdAt: string,
  estimatedDelivery: string
}
```

## 🚀 **Getting Started**

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start development server**: `npm run dev`
4. **Open browser**: Navigate to `http://localhost:3000`
5. **Use demo account**: `demo@snafles.com` / `demo123`

## 📱 **Mobile Experience**

- **Touch-friendly**: Large buttons and touch targets
- **Responsive navigation**: Hamburger menu for mobile
- **Optimized images**: Proper sizing and loading
- **Smooth scrolling**: Native mobile scrolling behavior
- **Fast loading**: Optimized bundle size and lazy loading

## 🔒 **Security Features**

- **Input validation**: Form validation and sanitization
- **Secure storage**: Local storage for demo data
- **XSS protection**: React's built-in XSS protection
- **CSRF protection**: Form token validation
- **Secure headers**: Content Security Policy

## 🎯 **Performance Optimizations**

- **Code splitting**: Route-based code splitting
- **Lazy loading**: Component lazy loading
- **Image optimization**: Responsive images with proper sizing
- **Bundle optimization**: Tree shaking and minification
- **Caching**: Local storage for data persistence

## 🧪 **Testing**

- **Component testing**: React Testing Library
- **Integration testing**: User flow testing
- **E2E testing**: Playwright or Cypress
- **Performance testing**: Lighthouse audits

## 📈 **Future Enhancements**

- **Backend integration**: Real API endpoints
- **Payment processing**: Stripe/PayPal integration
- **Real-time updates**: WebSocket connections
- **Advanced search**: Elasticsearch integration
- **Admin panel**: Vendor and product management
- **Mobile app**: React Native version
- **PWA features**: Offline support and push notifications

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

---

**SNAFLEShub** - Your Global Marketplace for Handmade Treasures 🌟
