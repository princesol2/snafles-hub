import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import Logo from '../common/Logo'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Logo size="small" className="text-white" />
            </div>
            <p className="text-gray-300 mb-1">
              Your global marketplace for unique handmade treasures. Connecting artisans with customers worldwide.
            </p>
            <p className="text-gray-200 font-semibold mb-4">We care. We deliver.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/second-hand" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Second-Hand
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/dashboard/customer" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help-center" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Request Refund
                </Link>
              </li>
              <li>
                <Link to="/exchange" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Request Exchange
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400" />
                <span className="text-gray-300">support@snafleshub.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-blue-400" />
                <span className="text-gray-300">123 Artisan Street, Creative City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 SNAFLES HUB ALL RIGHT RESVERD
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-300 hover:text-blue-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-300 hover:text-blue-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/policies/returns" className="text-gray-300 hover:text-blue-400 text-sm transition-colors">
                Returns Policy
              </Link>
              <Link to="/cookie-policy" className="text-gray-300 hover:text-blue-400 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
