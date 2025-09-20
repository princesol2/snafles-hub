import { createContext, useContext, useState, useEffect } from 'react'
import { productsAPI, vendorsAPI } from '../services/api'

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
      
      setProducts(productsResponse.products || productsResponse || [])
      setVendors(vendorsResponse.vendors || vendorsResponse || [])
      setError(null)
      console.log('Data loaded successfully from API!')
    } catch (err) {
      setError('Failed to load data: ' + err.message)
      console.error('Error loading data from API:', err)
      
      // Fallback to mock data if API fails
      console.log('Using fallback mock data...')
      setProducts([
        {
          id: "jewelry-001",
          name: "Handmade Pearl Necklace",
          category: "Jewelry",
          price: 89.99,
          image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
          images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"],
          vendor: { id: "vendor-001", name: "Artisan Crafts Co." },
          stock: 15,
          featured: true,
          rating: 4.8,
          reviews: 23
        },
        {
          id: "decor-001",
          name: "Ceramic Vase",
          category: "Decor",
          price: 45.99,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
          images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"],
          vendor: { id: "vendor-002", name: "Creative Home Studio" },
          stock: 8,
          featured: true,
          rating: 4.7,
          reviews: 12
        },
        {
          id: "clothing-001",
          name: "Boho Silver Earrings",
          category: "Jewelry",
          price: 25.99,
          image: "https://images.unsplash.com/photo-1635767798704-3e94c9e53928?w=400&h=400&fit=crop",
          images: ["https://images.unsplash.com/photo-1635767798704-3e94c9e53928?w=400&h=400&fit=crop"],
          vendor: { id: "vendor-001", name: "Artisan Crafts Co." },
          stock: 28,
          featured: false,
          rating: 4.6,
          reviews: 15
        }
      ])
      setVendors([
        {
          id: "vendor-001",
          name: "Artisan Crafts Co.",
          type: "local",
          location: "Mumbai, India",
          description: "Traditional Indian handicrafts and jewelry",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
          rating: 4.8
        },
        {
          id: "vendor-002",
          name: "Creative Home Studio",
          type: "local",
          location: "Delhi, India",
          description: "Modern home decor and accessories",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
          rating: 4.7
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getProductById = (id) => {
    return products.find(product => product.id === id)
  }

  const getVendorById = (id) => {
    return vendors.find(vendor => vendor.id === id)
  }

  const getProductsByCategory = (category) => {
    if (category === 'all') return products
    return products.filter(product => product.category === category)
  }

  const getProductsByVendor = (vendorId) => {
    return products.filter(product => 
      product.vendor?.id === vendorId || product.vendor === vendorId
    )
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
