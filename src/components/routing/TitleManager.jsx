import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TitleManager = () => {
  const location = useLocation()

  useEffect(() => {
    const routes = [
      { pattern: /^\/$/, title: 'Home' },
      { pattern: /^\/login$/, title: 'Login' },
      { pattern: /^\/forgot-password$/, title: 'Forgot Password' },
      { pattern: /^\/reset-password\/[^/]+$/, title: 'Reset Password' },
      { pattern: /^\/verify-email\/[^/]+$/, title: 'Verify Email' },
      { pattern: /^\/products$/, title: 'Products' },
      { pattern: /^\/product\/[^/]+$/, title: 'Product Details' },
      { pattern: /^\/vendors$/, title: 'Vendors' },
      { pattern: /^\/vendor\/[^/]+$/, title: 'Vendor Shop' },
      { pattern: /^\/second-hand$/, title: 'Second-Hand' },
      { pattern: /^\/cart$/, title: 'Cart' },
      { pattern: /^\/checkout$/, title: 'Checkout' },
      { pattern: /^\/orders$/, title: 'Orders' },
      { pattern: /^\/order-success\/[^/]+$/, title: 'Order Success' },
      { pattern: /^\/track-order(?:\/[^/]+)?$/, title: 'Track Order' },
      { pattern: /^\/refund$/, title: 'Refund' },
      { pattern: /^\/exchange$/, title: 'Exchange' },
      { pattern: /^\/help-center$/, title: 'Help Center' },
      { pattern: /^\/shipping-info$/, title: 'Shipping Info' },
      { pattern: /^\/contact$/, title: 'Contact' },
      { pattern: /^\/privacy-policy$/, title: 'Privacy Policy' },
      { pattern: /^\/terms-of-service$/, title: 'Terms of Service' },
      { pattern: /^\/policies\/returns$/, title: 'Returns Policy' },
      { pattern: /^\/cookie-policy$/, title: 'Cookie Policy' },
      { pattern: /^\/profile$/, title: 'Snafles Account' },
      { pattern: /^\/profile-settings$/, title: 'Profile Settings' },
      { pattern: /^\/settings$/, title: 'User Settings' },
      { pattern: /^\/wishlist$/, title: 'Wishlist' },
      { pattern: /^\/helper-points$/, title: 'Helper Points' },
      { pattern: /^\/reviews(?:\/.*)?$/, title: 'Reviews' },
      { pattern: /^\/dashboard\/vendor$/, title: 'Vendor Dashboard' },
      { pattern: /^\/vendor-login$/, title: 'Vendor Login' },
      { pattern: /^\/vendor-register$/, title: 'Vendor Register' },
      { pattern: /^\/vendor\/[^/]+\/profile$/, title: 'Vendor Profile' },
      { pattern: /^\/dashboard\/admin$/, title: 'Admin Dashboard' },
      { pattern: /^\/dashboard\/customer$/, title: 'Customer Dashboard' },
      { pattern: /^\/admin-login$/, title: 'Admin Login' },
      { pattern: /^\/shopping-mascot-demo$/, title: 'Shopping Mascot Demo' },
    ]

    const match = routes.find((r) => r.pattern.test(location.pathname))
    const base = 'Snafles Hub'
    document.title = match ? `${match.title} | ${base}` : base
  }, [location])

  return null
}

export default TitleManager
