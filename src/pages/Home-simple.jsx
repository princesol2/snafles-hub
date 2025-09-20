import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  console.log('Simple Home component rendering...')
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🎉 Welcome to SNAFLEShub</h1>
          <p className="text-xl mb-8">Your Global Marketplace for Handmade Treasures</p>
          <Link 
            to="/products" 
            className="bg-white text-pink-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/products?category=Jewelry" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-2">Jewelry</h3>
              <p className="text-gray-600">Handcrafted jewelry pieces</p>
            </Link>
            <Link to="/products?category=Decor" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="text-4xl mb-4">🏺</div>
              <h3 className="text-xl font-semibold mb-2">Decor</h3>
              <p className="text-gray-600">Beautiful home decorations</p>
            </Link>
            <Link to="/products?category=Clothing" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="text-4xl mb-4">👗</div>
              <h3 className="text-xl font-semibold mb-2">Clothing</h3>
              <p className="text-gray-600">Cozy handmade clothing</p>
            </Link>
            <Link to="/products?category=Accessories" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="text-4xl mb-4">👜</div>
              <h3 className="text-xl font-semibold mb-2">Accessories</h3>
              <p className="text-gray-600">Stylish accessories</p>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-pink-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-gray-600 mb-8">Discover unique handmade products from artisans worldwide</p>
          <Link 
            to="/products" 
            className="bg-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
