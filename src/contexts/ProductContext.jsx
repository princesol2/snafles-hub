import { createContext, useContext, useState, useEffect } from 'react'
import { productsAPI, vendorsAPI } from '../services/api'
import { demoProducts, demoVendors } from '../data/demoData'

const ProductContext = createContext()

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log('Loading data from API...')
      
      // Load products and vendors in parallel
      const [productsResponse, vendorsResponse] = await Promise.all([
        productsAPI.getProducts(),
        vendorsAPI.getVendors()
      ])
      
      const normalizeVendor = (v) => ({
        ...v,
        id: v.id || v._id
      })

      const normalizeProduct = (p) => ({
        ...p,
        id: p.id || p._id,
        // Ensure a convenient image field exists
        image: p.image || (Array.isArray(p.images) ? p.images[0] : undefined),
        // Normalize nested vendor
        vendor: typeof p.vendor === 'object' && p.vendor !== null
          ? { ...p.vendor, id: p.vendor.id || p.vendor._id }
          : p.vendor
      })

      let rawProducts = productsResponse.products || productsResponse || []
      let rawVendors = vendorsResponse.vendors || vendorsResponse || []

      // Fallback to demo data in dev if API returns empty
      const allowDemo = (import.meta.env.VITE_ALLOW_DEMO_DATA === 'true') || import.meta.env.DEV
      if (allowDemo && rawProducts.length === 0) {
        console.warn('API returned no products. Falling back to demo data.')
        rawProducts = demoProducts
        rawVendors = demoVendors
      }

      const normalizedVendors = rawVendors.map(normalizeVendor)
      const normalizedProducts = rawProducts.map(normalizeProduct)

      setProducts(normalizedProducts)
      setVendors(normalizedVendors)
      setError(null)
      console.log('Data loaded successfully from API!')
    } catch (err) {
      console.error('Error loading data from API:', err)
      const allowDemo = (import.meta.env.VITE_ALLOW_DEMO_DATA === 'true') || import.meta.env.DEV
      if (allowDemo) {
        console.warn('Falling back to demo data after API error.')
        setProducts(demoProducts)
        setVendors(demoVendors)
        setError(null)
      } else {
        setError('Failed to load data: ' + err.message)
        setProducts([])
        setVendors([])
      }
    } finally {
      setLoading(false)
    }
  }

  const getProductById = (id) => {
    return products.find(product => (product.id || product._id) === id)
  }

  const getVendorById = (id) => {
    return vendors.find(vendor => (vendor.id || vendor._id) === id)
  }

  const getProductsByCategory = (category) => {
    if (category === 'all') return products
    return products.filter(product => product.category === category)
  }

  const getProductsByVendor = (vendorId) => {
    return products.filter(product => {
      const v = product.vendor
      const currentVendorId = typeof v === 'object' && v !== null ? (v.id || v._id) : v
      return currentVendorId === vendorId
    })
  }

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured)
  }

  const getNewArrivals = () => {
    return products.slice(-8) // Last 8 products
  }

  const getBestSellers = () => {
    return products.filter(product => product.rating >= 4.5)
  }

  const getDeals = () => {
    return products.filter(product => product.originalPrice)
  }

  const searchProducts = (query) => {
    if (!query) return products
    
    const lowercaseQuery = query.toLowerCase()
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.vendor?.name?.toLowerCase().includes(lowercaseQuery)
    )
  }

  const value = {
    products,
    vendors,
    loading,
    error,
    getProductById,
    getVendorById,
    getProductsByCategory,
    getProductsByVendor,
    getFeaturedProducts,
    getNewArrivals,
    getBestSellers,
    getDeals,
    searchProducts
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}
