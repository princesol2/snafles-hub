import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X, Heart, Store, Shield, MessageSquare, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import Logo from '../common/Logo'

const Navbar = () => {
  console.log('Navbar component rendering...')
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Safe context usage with fallbacks
  let user = null
  let logout = () => {}
  let cartItemCount = 0
  
  try {
    const authContext = useAuth()
    user = authContext?.user || null
    logout = authContext?.logout || (() => {})
  } catch (error) {
    console.log('Auth context not available:', error.message)
  }
  
  try {
    const cartContext = useCart()
    cartItemCount = cartContext?.getCartItemCount?.() || 0
  } catch (error) {
    console.log('Cart context not available:', error.message)
  }
  
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-gray-200/50">
      {/* Top Bar */}
      <div className="gradient-primary text-white py-3">
        <div className="container">
          <p className="text-center text-sm font-medium">
            🎉 Free shipping on orders over ₹999! New arrivals every week.
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group">
            <Logo size="default" className="group-hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 ml-12">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 relative group">
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/vendors" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 relative group">
              Vendors
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/second-hand" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 relative group">
              Second-Hand
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {user && (
              <Link to="/wishlist" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 relative group">
                Wishlist
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
            {user && (
              <Link to="/negotiations" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 relative group">
                Negotiations
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full pl-4 pr-12 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            {/* Cart - Only show when user is logged in */}
            {user && (
              <Link to="/cart" className="relative p-3 text-gray-700 hover:text-blue-600 transition-colors duration-300 group">
                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform duration-300" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold shadow-md">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 p-2 rounded-xl hover:bg-blue-50">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="hidden md:block font-semibold">{user.name.split(' ')[0]}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-large border border-gray-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-3">
                    <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-300">
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <Link to="/orders" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-300">
                      <Shield size={16} />
                      <span>Orders</span>
                    </Link>
                    <Link to="/wishlist" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-300">
                      <Heart size={16} />
                      <span>Wishlist</span>
                    </Link>
                    <Link to="/negotiations" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-300">
                      <MessageSquare size={16} />
                      <span>Negotiations</span>
                    </Link>
                    {(user.role === 'vendor' || user.role === 'admin') && (
                      <Link to="/vendor-dashboard" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-300">
                        <Store size={16} />
                        <span>Vendor Dashboard</span>
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin-dashboard" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-300">
                        <Shield size={16} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300"
                    >
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/vendor-login" className="btn btn-secondary text-sm">
                  <Store className="h-4 w-4 mr-1" />
                  Vendor
                </Link>
                <Link to="/admin-login" className="btn btn-pink text-sm">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-3 text-gray-700 hover:text-blue-600 transition-colors duration-300 rounded-xl hover:bg-blue-50"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full pl-4 pr-12 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
          <div className="container py-6">
            <nav className="flex flex-col space-y-6">
              <Link to="/" onClick={toggleMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 py-2">
                Home
              </Link>
              <Link to="/products" onClick={toggleMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 py-2">
                Shop
              </Link>
              <Link to="/vendors" onClick={toggleMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 py-2">
                Vendors
              </Link>
              <Link to="/second-hand" onClick={toggleMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 py-2">
                Second-Hand
              </Link>
              <Link to="/wishlist" onClick={toggleMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 py-2">
                Wishlist
              </Link>
              <Link to="/negotiations" onClick={toggleMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 py-2">
                Negotiations
              </Link>
              {user ? (
                <>
                  <div className="border-t border-gray-200 pt-6">
                    <Link to="/settings" onClick={toggleMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 py-2 block">
                      Settings
                    </Link>
                    <Link to="/orders" onClick={toggleMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 py-2 block">
                      Orders
                    </Link>
                    {(user.role === 'vendor' || user.role === 'admin') && (
                      <Link to="/vendor-dashboard" onClick={toggleMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 py-2 block">
                        <Store className="inline h-4 w-4 mr-2" />
                        Vendor Dashboard
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin-dashboard" onClick={toggleMobileMenu} className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 py-2 block">
                        <Shield className="inline h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout()
                        toggleMobileMenu()
                      }}
                      className="text-left text-red-600 hover:text-red-700 font-semibold transition-colors duration-300 py-2"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 pt-6 border-t border-gray-200">
                  <Link to="/login" onClick={toggleMobileMenu} className="btn btn-outline w-full text-center">
                    Login
                  </Link>
                  <Link to="/vendor-login" onClick={toggleMobileMenu} className="btn btn-secondary w-full text-center">
                    <Store className="h-4 w-4 mr-1" />
                    Vendor Login
                  </Link>
                  <Link to="/admin-login" onClick={toggleMobileMenu} className="btn btn-pink w-full text-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Admin Login
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
