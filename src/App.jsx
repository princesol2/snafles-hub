import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ProductProvider } from './contexts/ProductContext'
import { OrderProvider } from './contexts/OrderContext'

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
import ProfileSettings from './pages/ProfileSettings'
import Settings from './pages/Settings'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
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
import VerifyEmail from './pages/VerifyEmail'
import ShoppingMascotDemo from './pages/ShoppingMascotDemo'
import OrderSuccess from './pages/OrderSuccess'
import OrderTracking from './pages/OrderTracking'
import Refund from './pages/Refund'
import Exchange from './pages/Exchange'
import HelpCenter from './pages/HelpCenter'
import ShippingInfo from './pages/ShippingInfo'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import AuthGuard from './components/routing/AuthGuard'
import NotFound from './pages/NotFound'

function App() {
  console.log('App component rendering...')
  
  return (
    <Router>
        <AuthProvider>
          <CartProvider>
            <ProductProvider>
              <OrderProvider>
              <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
              <Navbar />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password/:token" element={<ResetPassword />} />
                      <Route path="/verify-email/:token" element={<VerifyEmail />} />
                      
                      {/* Guest Allowed Routes - Can browse without login */}
                      <Route path="/products" element={
                        <AuthGuard requireAuth={false} guestAllowed={true}>
                          <Products />
                        </AuthGuard>
                      } />
                      <Route path="/product/:id" element={
                        <AuthGuard requireAuth={false} guestAllowed={true}>
                          <ProductDetail />
                        </AuthGuard>
                      } />
                      <Route path="/vendors" element={
                        <AuthGuard requireAuth={true}>
                          <Vendors />
                        </AuthGuard>
                      } />
                      <Route path="/vendor/:id" element={
                        <AuthGuard requireAuth={true}>
                          <VendorShop />
                        </AuthGuard>
                      } />
                      <Route path="/cart" element={
                        <AuthGuard requireAuth={false} guestAllowed={true}>
                          <Cart />
                        </AuthGuard>
                      } />
                      <Route path="/checkout" element={
                        <AuthGuard requireAuth={true}>
                          <Checkout />
                        </AuthGuard>
                      } />
                      <Route path="/orders" element={
                        <AuthGuard requireAuth={true}>
                          <Orders />
                        </AuthGuard>
                      } />
                      <Route path="/order-success/:orderId" element={
                        <AuthGuard requireAuth={true}>
                          <OrderSuccess />
                        </AuthGuard>
                      } />
                      <Route path="/track-order" element={<OrderTracking />} />
                      <Route path="/track-order/:orderId" element={<OrderTracking />} />
                      <Route path="/refund" element={
                        <AuthGuard requireAuth={true}>
                          <Refund />
                        </AuthGuard>
                      } />
        <Route path="/exchange" element={
          <AuthGuard requireAuth={true}>
            <Exchange />
          </AuthGuard>
        } />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/shipping-info" element={<ShippingInfo />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
                      <Route path="/profile" element={
                        <AuthGuard requireAuth={true}>
                          <Profile />
                        </AuthGuard>
                      } />
                      <Route path="/profile-settings" element={
                        <AuthGuard requireAuth={true}>
                          <ProfileSettings />
                        </AuthGuard>
                      } />
                      <Route path="/settings" element={
                        <AuthGuard requireAuth={true}>
                          <Settings />
                        </AuthGuard>
                      } />
                      <Route path="/wishlist" element={
                        <AuthGuard requireAuth={true}>
                          <Wishlist />
                        </AuthGuard>
                      } />
                      <Route path="/negotiations" element={
                        <AuthGuard requireAuth={true}>
                          <Negotiations />
                        </AuthGuard>
                      } />
                      <Route path="/reviews" element={
                        <AuthGuard requireAuth={true}>
                          <Reviews />
                        </AuthGuard>
                      } />
                      <Route path="/reviews/:type/:id" element={
                        <AuthGuard requireAuth={true}>
                          <Reviews />
                        </AuthGuard>
                      } />
                  
                  {/* Vendor Routes */}
                  <Route path="/vendor-dashboard" element={
                    <AuthGuard requireAuth={true} allowedRoles={['vendor', 'admin']}>
                      <VendorDashboard />
                    </AuthGuard>
                  } />
                  <Route path="/vendor-login" element={<VendorLogin />} />
                  <Route path="/vendor-register" element={<VendorRegister />} />
                  <Route path="/vendor/:id/profile" element={
                    <AuthGuard requireAuth={true}>
                      <VendorProfile />
                    </AuthGuard>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin-dashboard" element={
                    <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                      <AdminDashboard />
                    </AuthGuard>
                  } />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  
                  {/* Demo Routes */}
                  <Route path="/shopping-mascot-demo" element={<ShoppingMascotDemo />} />
                  
                  <Route path="*" element={<NotFound />} />
+
+                </Routes>
              </main>
              <Footer />
              <Toaster position="top-right" />
              </div>
              </OrderProvider>
            </ProductProvider>
          </CartProvider>
        </AuthProvider>
    </Router>
    )
  }

export default App

