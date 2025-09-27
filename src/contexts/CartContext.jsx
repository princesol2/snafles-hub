import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const MAX_CART_ITEMS = 15 // Maximum number of items in cart

  useEffect(() => {
    // Load cart from localStorage on app start
    const savedCart = localStorage.getItem('snaflesCart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Filter out any items that don't have essential properties
        const validCart = parsedCart.filter(item => 
          item && 
          item.id && 
          item.name && 
          typeof item.price === 'number' && 
          typeof item.quantity === 'number'
        )
        setCart(validCart)
      } catch (error) {
        console.error('Error parsing saved cart:', error)
        setCart([])
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (!loading) {
      localStorage.setItem('snaflesCart', JSON.stringify(cart))
    }
  }, [cart, loading])

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      
      if (existingItem) {
        // Check if adding quantity would exceed the limit
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity > MAX_CART_ITEMS) {
          throw new Error(`Cannot add more items. Cart limit is ${MAX_CART_ITEMS} items per product.`)
        }
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      } else {
        // Check if adding new item would exceed total cart limit
        if (prevCart.length >= MAX_CART_ITEMS) {
          throw new Error(`Cart is full! Maximum ${MAX_CART_ITEMS} different items allowed.`)
        }
        if (quantity > MAX_CART_ITEMS) {
          throw new Error(`Cannot add more than ${MAX_CART_ITEMS} items of this product.`)
        }
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: product.price || 0,
          image: product.image || product.images?.[0],
          quantity,
          vendor: product.vendor?.name || product.vendor || 'SNAFLEShub',
          category: product.category,
          stock: product.stock || 99
        }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId)
  }

  const getCartItem = (productId) => {
    return cart.find(item => item.id === productId)
  }

  const getCartLimit = () => {
    return MAX_CART_ITEMS
  }

  const isCartFull = () => {
    return cart.length >= MAX_CART_ITEMS
  }

  const canAddToCart = (productId, quantity = 1) => {
    const existingItem = cart.find(item => item.id === productId)
    if (existingItem) {
      return existingItem.quantity + quantity <= MAX_CART_ITEMS
    }
    return cart.length < MAX_CART_ITEMS && quantity <= MAX_CART_ITEMS
  }

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getCartItem,
    getCartLimit,
    isCartFull,
    canAddToCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
