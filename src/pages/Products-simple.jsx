import React from 'react'
import { Link } from 'react-router-dom'

const Products = () => {
  console.log('Simple Products component rendering...')
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Products */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Sample Product 1</h3>
              <p className="text-gray-600 mb-2">Beautiful handmade item</p>
              <p className="text-pink-500 font-bold">$29.99</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Sample Product 2</h3>
              <p className="text-gray-600 mb-2">Unique artisan creation</p>
              <p className="text-pink-500 font-bold">$45.99</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Sample Product 3</h3>
              <p className="text-gray-600 mb-2">Handcrafted with love</p>
              <p className="text-pink-500 font-bold">$19.99</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Products
