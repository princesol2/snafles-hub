import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X, Heart, Store, Shield, MessageSquare } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

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
    <header className="bg-white shadow-sm sticky top-0 z-50">
              {/* Top Bar */}
              <div className="bg-primary text-white py-2">
                <div className="container">
                  <p className="text-center text-sm">
                    🎉 Free shipping on orders over ₹999! New arrivals every week.
                  </p>
                </div>
              </div>

      {/* Main Navigation */}
      <nav className="container py-4">
        <div className="flex items-center justify-between">
                  {/* Logo */}
                  <Link to="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      S
                    </div>
                    <span className="text-2xl font-bold text-primary">SNAFLEShub</span>
                  </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary font-medium">
              Shop
            </Link>
            <Link to="/vendors" className="text-gray-700 hover:text-primary font-medium">
              Vendors
            </Link>
            <Link to="/wishlist" className="text-gray-700 hover:text-primary font-medium">
              Wishlist
            </Link>
            <Link to="/negotiations" className="text-gray-700 hover:text-primary font-medium">
              Negotiations
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary">
                  <User size={24} />
                  <span className="hidden md:block">{user.name.split(' ')[0]}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Orders
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Wishlist
                    </Link>
                    <Link to="/negotiations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <MessageSquare className="inline h-4 w-4 mr-2" />
                      Negotiations
                    </Link>
                    {(user.role === 'vendor' || user.role === 'admin') && (
                      <Link to="/vendor-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Store className="inline h-4 w-4 mr-2" />
                        Vendor Dashboard
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Shield className="inline h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/vendor-login" className="btn btn-outline text-sm">
                  <Store className="h-4 w-4 mr-1" />
                  Vendor
                </Link>
                <Link to="/admin-login" className="btn btn-outline text-sm">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-700 hover:text-primary"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary font-medium">
                Home
              </Link>
              <Link to="/products" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary font-medium">
                Shop
              </Link>
              <Link to="/vendors" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary font-medium">
                Vendors
              </Link>
              <Link to="/wishlist" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary font-medium">
                Wishlist
              </Link>
              <Link to="/negotiations" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary font-medium">
                Negotiations
              </Link>
              {user ? (
                <>
                  <Link to="/profile" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary font-medium">
                    Profile
                  </Link>
                  <Link to="/orders" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary font-medium">
                    Orders
                  </Link>
                  {(user.role === 'vendor' || user.role === 'admin') && (
                    <Link to="/vendor-dashboard" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary font-medium">
                      <Store className="inline h-4 w-4 mr-2" />
                      Vendor Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin-dashboard" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary font-medium">
                      <Shield className="inline h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      toggleMobileMenu()
                    }}
                    className="text-left text-gray-700 hover:text-primary font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={toggleMobileMenu} className="btn btn-primary w-full text-center">
                    Login
                  </Link>
                  <Link to="/vendor-login" onClick={toggleMobileMenu} className="btn btn-outline w-full text-center">
                    <Store className="h-4 w-4 mr-1" />
                    Vendor Login
                  </Link>
                  <Link to="/admin-login" onClick={toggleMobileMenu} className="btn btn-outline w-full text-center">
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
