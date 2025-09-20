import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ProductProvider } from './contexts/ProductContext'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Vendors from './pages/Vendors'
import VendorShop from './pages/VendorShop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Wishlist from './pages/Wishlist'

// Vendor Pages
import VendorDashboard from './pages/VendorDashboard'
import VendorLogin from './pages/VendorLogin'
import VendorRegister from './pages/VendorRegister'

// Admin Pages
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'

// Negotiation Pages
import Negotiations from './pages/Negotiations'

// Review Pages
import Reviews from './pages/Reviews'
import VendorProfile from './pages/VendorProfile'

function App() {
  console.log('App component rendering...')
  
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/vendors" element={<Vendors />} />
                  <Route path="/vendor/:id" element={<VendorShop />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/negotiations" element={<Negotiations />} />
                  <Route path="/reviews" element={<Reviews />} />
                  
                  {/* Vendor Routes */}
                  <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                  <Route path="/vendor-login" element={<VendorLogin />} />
                  <Route path="/vendor-register" element={<VendorRegister />} />
                  <Route path="/vendor-profile" element={<VendorProfile />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                </Routes>
              </main>
              <Footer />
              <Toaster position="top-right" />
            </div>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

